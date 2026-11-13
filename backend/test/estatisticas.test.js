import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { db, iniciar } from './helpers.js'
import { calcularEstatisticas, calcularSequencias } from '../src/services/estatisticas.js'

let s

before(async () => { s = await iniciar() })
after(() => s.parar())

const estatisticas = async (u, consulta = '') => {
  const r = await s.api('GET', `/api/estatisticas${consulta}`, { token: u.token })
  assert.equal(r.status, 200, JSON.stringify(r.corpo))
  return r.corpo
}
const responder = (u, id, alternativa) => s.api('POST', `/api/questoes/${id}/resposta`, { token: u.token, corpo: { alternativa } })

function tentativasEm(usuarioId, datas, origem = 'registro') {
  for (const d of datas) {
    db.prepare(`
      INSERT INTO tentativas (usuario_id, questao_id, alternativa, correta, respondida_em, origem)
      VALUES (?, 1, 'B', 1, ?, ?)
    `).run(usuarioId, d, origem)
  }
}

test('conta recém-criada: tudo zerado, sem dias nem sequência fictícios', async () => {
  const u = await s.criarUsuario('Nova Conta', 'nova@teste.com')
  const e = await estatisticas(u)

  assert.deepEqual(e.geral, {
    resolvidas: 0, acertos: 0, erros: 0, taxaAcerto: null, salvas: 0, revisar: 0,
    tentativas: 0, diasEstudados: 0, sequenciaAtual: 0, maiorSequencia: 0
  })
  assert.deepEqual(e.calendario.dias, [])
  assert.equal(e.historicoParcial, false)
  assert.ok(e.conteudos.length >= 15, 'todos os conteúdos aparecem')
  assert.ok(e.conteudos.every(c => c.respondidas === 0 && c.taxaAcerto === null && c.conclusao === 0))
})

test('primeira resposta, erro, resposta repetida e taxa de acerto (última resposta)', async () => {
  const u = await s.criarUsuario('Ana Souza', 'ana@teste.com')

  await responder(u, 1, 'B')
  let g = (await estatisticas(u)).geral
  assert.deepEqual([g.resolvidas, g.acertos, g.erros, g.taxaAcerto, g.tentativas, g.diasEstudados, g.sequenciaAtual], [1, 1, 0, 100, 1, 1, 1])

  await responder(u, 2, 'B')
  g = (await estatisticas(u)).geral
  assert.deepEqual([g.resolvidas, g.acertos, g.erros, g.taxaAcerto, g.tentativas], [2, 1, 1, 50, 2])

  await responder(u, 2, 'A')
  const e = await estatisticas(u)
  assert.deepEqual([e.geral.resolvidas, e.geral.acertos, e.geral.erros, e.geral.taxaAcerto, e.geral.tentativas], [2, 2, 0, 100, 3])
  assert.equal(e.geral.diasEstudados, 1, 'várias tentativas no mesmo dia contam como 1 dia')
  assert.equal(e.geral.maiorSequencia, 1)

  const hoje = e.calendario.hoje
  assert.deepEqual(e.calendario.dias, [{ dia: Number(hoje.slice(8)), tentativas: 3 }])
  assert.equal(e.historicoParcial, false)

  await s.api('PUT', '/api/questoes/3/salvar', { token: u.token })
  await s.api('PUT', '/api/questoes/4/revisar', { token: u.token })
  const depois = (await estatisticas(u)).geral
  assert.deepEqual([depois.salvas, depois.revisar], [1, 1])
})

test('desempenho por conteúdo: contagens, taxa, conclusão e nenhuma questão contada duas vezes', async () => {
  const u = (await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })).corpo
  const e = await estatisticas({ token: u.token })
  const por = Object.fromEntries(e.conteudos.map(c => [c.id, c]))

  assert.deepEqual(por[2], { id: 2, nome: por[2].nome, disponiveis: 2, respondidas: 1, acertos: 1, erros: 0, taxaAcerto: 100, conclusao: 50 })
  assert.deepEqual([por[3].disponiveis, por[3].respondidas, por[3].acertos, por[3].taxaAcerto, por[3].conclusao], [1, 1, 1, 100, 100])
  assert.deepEqual([por[17].disponiveis, por[17].respondidas, por[17].taxaAcerto, por[17].conclusao], [2, 0, null, 0])

  const totalDisponivel = e.conteudos.reduce((soma, c) => soma + c.disponiveis, 0)
  assert.equal(totalDisponivel, db.prepare('SELECT COUNT(*) n FROM questoes WHERE conteudo_id IS NOT NULL').get().n)
  assert.equal(e.conteudos.reduce((soma, c) => soma + c.respondidas, 0), e.geral.resolvidas, 'soma por conteúdo = total')
})

test('erro por conteúdo: resposta errada conta como erro e baixa a taxa', async () => {
  const u = await s.criarUsuario('Beto Dias', 'beto@teste.com')
  await responder(u, 1, 'A')
  await responder(u, 6, 'A')
  const e = await estatisticas(u)
  const c2 = e.conteudos.find(c => c.id === 2)
  assert.deepEqual([c2.respondidas, c2.acertos, c2.erros, c2.taxaAcerto, c2.conclusao], [1, 0, 1, 0, 50])
  assert.equal(e.geral.taxaAcerto, 0, 'taxa 0 (há respostas), diferente de null (sem dados)')
})

test('isolamento: estatísticas de cada conta são independentes', async () => {
  const a = (await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })).corpo
  const b = (await s.api('POST', '/api/auth/login', { corpo: { email: 'beto@teste.com', senha: 'senha-segura-1' } })).corpo
  const ea = await estatisticas({ token: a.token })
  const eb = await estatisticas({ token: b.token })
  assert.equal(ea.geral.resolvidas, 2)
  assert.equal(eb.geral.resolvidas, 1)
  assert.notEqual(ea.geral.taxaAcerto, eb.geral.taxaAcerto)
})

test('calcularSequencias: atual, maior, interrupção e "ontem ainda vale"', () => {
  const dias = ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-10', '2025-03-11']

  assert.deepEqual(calcularSequencias(dias, '2025-03-11'), { atual: 2, maior: 3 })
  assert.deepEqual(calcularSequencias(dias, '2025-03-12'), { atual: 2, maior: 3 }, 'terminou ontem: continua ativa')
  assert.deepEqual(calcularSequencias(dias, '2025-03-13'), { atual: 0, maior: 3 }, 'passou um dia inteiro: quebrou')
  assert.deepEqual(calcularSequencias([], '2025-03-13'), { atual: 0, maior: 0 })
  assert.deepEqual(calcularSequencias(['2025-02-28', '2025-03-01'], '2025-03-01'), { atual: 2, maior: 2 }, 'virada de mês')
  assert.deepEqual(calcularSequencias(['2024-12-31', '2025-01-01'], '2025-01-01'), { atual: 2, maior: 2 }, 'virada de ano')
})

test('sequência e dias distintos calculados a partir do banco', async () => {
  const u = await s.criarUsuario('Carla Reis', 'carla@teste.com')

  tentativasEm(u.id, [
    '2025-03-01 15:00:00', '2025-03-02 15:00:00', '2025-03-03 15:00:00',
    '2025-03-10 15:00:00', '2025-03-10 18:00:00', '2025-03-11 02:30:00'
  ])

  const em = data => calcularEstatisticas(u.id, { agora: new Date(data) }).geral

  let g = em('2025-03-10T20:00:00Z')
  assert.equal(g.tentativas, 6)
  assert.equal(g.diasEstudados, 4, 'dias 1, 2, 3 e 10 (o das 02:30 UTC pertence ao dia 10 no Brasil)')
  assert.equal(g.maiorSequencia, 3)
  assert.equal(g.sequenciaAtual, 1)

  tentativasEm(u.id, ['2025-03-11 15:00:00'])
  g = em('2025-03-11T20:00:00Z')
  assert.deepEqual([g.diasEstudados, g.sequenciaAtual, g.maiorSequencia], [5, 2, 3])

  assert.equal(em('2025-03-12T01:00:00Z').sequenciaAtual, 2)
  assert.equal(em('2025-03-12T15:00:00Z').sequenciaAtual, 2, 'ontem (11) ainda vale')
  assert.equal(em('2025-03-13T15:00:00Z').sequenciaAtual, 0, 'dia 12 sem estudo: interrompeu')
  assert.equal(em('2025-03-13T15:00:00Z').maiorSequencia, 3, 'o recorde histórico permanece')
})

test('fuso: meia-noite de São Paulo e horário de verão antigo (2018)', async () => {
  const u = await s.criarUsuario('Davi Melo', 'davi@teste.com')

  tentativasEm(u.id, [
    '2025-03-04 02:59:00',
    '2025-03-04 03:00:00',
    '2018-01-15 02:30:00'
  ])

  const { calendario } = calcularEstatisticas(u.id, { agora: new Date('2025-03-04T12:00:00Z'), mes: '2025-03' })
  assert.deepEqual(calendario.dias, [{ dia: 3, tentativas: 1 }, { dia: 4, tentativas: 1 }])

  const verao = calcularEstatisticas(u.id, { agora: new Date('2025-03-04T12:00:00Z'), mes: '2018-01' }).calendario
  assert.deepEqual(verao.dias, [{ dia: 15, tentativas: 1 }])
})

test('calendário: mês real, dias da semana, navegação e meses sem atividade', async () => {
  const u = (await s.api('POST', '/api/auth/login', { corpo: { email: 'carla@teste.com', senha: 'senha-segura-1' } })).corpo

  const marco = (await estatisticas({ token: u.token }, '?mes=2025-03')).calendario
  assert.equal(marco.ano, 2025)
  assert.equal(marco.mes, 3)
  assert.equal(marco.diasNoMes, 31)
  assert.equal(marco.primeiroDiaSemana, 6, '01/03/2025 foi sábado')
  assert.deepEqual(marco.dias.map(d => d.dia), [1, 2, 3, 10, 11])
  assert.deepEqual(marco.dias.find(d => d.dia === 10), { dia: 10, tentativas: 3 })

  const vazio = (await estatisticas({ token: u.token }, '?mes=2025-04')).calendario
  assert.deepEqual([vazio.diasNoMes, vazio.dias], [30, []])
  assert.equal((await estatisticas({ token: u.token }, '?mes=2024-02')).calendario.diasNoMes, 29, 'ano bissexto')

  const atual = (await estatisticas({ token: u.token })).calendario
  assert.equal(atual.hoje.slice(0, 7), `${atual.ano}-${String(atual.mes).padStart(2, '0')}`, 'padrão: mês atual')
})

test('mês inválido retorna 400', async () => {
  const u = await s.criarUsuario('Eva Luz', 'eva@teste.com')
  for (const mes of ['2025-13', '2025-00', 'marco', '202-03', '2025-3']) {
    assert.equal((await s.api('GET', `/api/estatisticas?mes=${mes}`, { token: u.token })).status, 400, mes)
  }
})

test('histórico reconstruído é identificado como parcial', async () => {
  const u = await s.criarUsuario('Fabi Costa', 'fabi@teste.com')
  assert.equal((await estatisticas(u)).historicoParcial, false)
  tentativasEm(u.id, ['2025-02-01 12:00:00'], 'migracao')
  assert.equal((await estatisticas(u)).historicoParcial, true)
})

test('limpar respostas zera também calendário e sequência', async () => {
  const u = await s.criarUsuario('Gil Ramos', 'gil@teste.com')
  await responder(u, 1, 'B')
  assert.equal((await estatisticas(u)).geral.diasEstudados, 1)

  await s.api('DELETE', '/api/perfil/respostas', { token: u.token })
  const e = await estatisticas(u)
  assert.deepEqual([e.geral.resolvidas, e.geral.tentativas, e.geral.diasEstudados, e.geral.sequenciaAtual], [0, 0, 0, 0])
  assert.deepEqual(e.calendario.dias, [])
})
