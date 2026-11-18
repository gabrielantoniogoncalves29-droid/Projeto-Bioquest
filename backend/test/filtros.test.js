import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { iniciar } from './helpers.js'

let s, ana, bia

before(async () => {
  s = await iniciar()
  ana = await s.criarUsuario('Ana Souza', 'ana@teste.com')
  bia = await s.criarUsuario('Bia Lima', 'bia@teste.com')
})
after(() => s.parar())

async function ids(consulta, token) {
  const r = await s.api('GET', `/api/questoes${consulta}`, { token })
  assert.equal(r.status, 200, `${consulta} -> ${JSON.stringify(r.corpo)}`)
  return r.corpo.map(card => card.id)
}

test('sem filtros devolve todas, em ordem estável (serial)', async () => {
  assert.deepEqual(await ids(''), [1, 2, 3, 4, 5, 6])
  assert.deepEqual(await ids('?ano=&nivel='), [1, 2, 3, 4, 5, 6], 'filtros vazios não restringem')
})

test('cada filtro isolado', async () => {
  assert.deepEqual(await ids('?ano=2023'), [2, 3])
  assert.deepEqual(await ids('?nivel=1'), [1, 4])
  assert.deepEqual(await ids('?objeto=4'), [3, 4])
  assert.deepEqual(await ids('?conteudo=2'), [1, 6])
  assert.deepEqual(await ids('?subconteudo=1705'), [3, 4])
})

test('várias opções do mesmo filtro formam união (OR)', async () => {
  assert.deepEqual(await ids('?ano=2022,2024'), [1, 4, 5, 6])
  assert.deepEqual(await ids('?nivel=1,3'), [1, 3, 4])
  assert.deepEqual(await ids('?conteudo=3,17'), [2, 3, 4])
})

test('filtros diferentes se combinam por interseção (AND)', async () => {
  assert.deepEqual(await ids('?ano=2024&nivel=2'), [5, 6])
  assert.deepEqual(await ids('?ano=2023,2024&objeto=4&nivel=1'), [4])
  assert.deepEqual(await ids('?conteudo=2&subconteudo=204'), [1])
  assert.deepEqual(await ids('?ano=2022&objeto=4'), [], 'resultado vazio é uma lista vazia, não erro')
})

test('pesquisa por texto ignora acento e maiúsculas, e usa palavras-chave', async () => {
  assert.deepEqual(await ids('?q=ecologia'), [3, 4], 'palavra-chave')
  assert.deepEqual(await ids('?q=ECOLOGIA'), [3, 4])
  assert.deepEqual(await ids('?q=proteina'), [1], 'sem acento acha "Proteínas"')
  assert.deepEqual(await ids('?q=PROTEÍNAS'), [1])
  assert.deepEqual(await ids('?q=nutricao'), [1], 'palavra-chave "nutrição"')
  assert.deepEqual(await ids('?q=competicao'), [3])
  assert.deepEqual(await ids('?q=ecologia%20competi%C3%A7%C3%A3o'), [3], 'todas as palavras precisam casar')
  assert.deepEqual(await ids('?q=zzzinexistente'), [])
})

test('pesquisa por ID e por ano', async () => {
  assert.deepEqual(await ids('?q=3'), [3])
  assert.deepEqual(await ids('?q=%233'), [3], '#3')
  assert.deepEqual(await ids('?q=2022'), [1])
})

test('pesquisa combinada com filtros', async () => {
  assert.deepEqual(await ids('?q=ecologia&ano=2024'), [4])
  assert.deepEqual(await ids('?q=ecologia&ano=2022'), [])
})

test('parâmetros inválidos retornam 400', async () => {
  for (const consulta of ['?ano=abc', '?nivel=1,,2', '?estado=9', '?estado=0', '?objeto=1.5', '?ano=1&ano=2', '?q=a&q=b', `?ano=${Array(70).fill(1).join(',')}`]) {
    const r = await s.api('GET', `/api/questoes${consulta}`, { token: ana.token })
    assert.equal(r.status, 400, consulta)
  }
})

test('o parâmetro "ordem" não existe mais: a ordenação é do frontend', async () => {
  assert.deepEqual(await ids('?ordem=maiorDificuldade'), [1, 2, 3, 4, 5, 6])
})

test('filtro de estado exige login (e nunca usa uma conta demonstrativa)', async () => {
  for (const consulta of ['?estado=1', '?estado=2', '?estado=3', '?estado=4', '?estado=1,2&ano=2022']) {
    assert.equal((await s.api('GET', `/api/questoes${consulta}`)).status, 401, consulta)
  }
})

test('estados: respondidas, salvas, revisão e não respondidas', async () => {
  await s.api('POST', '/api/questoes/1/resposta', { token: ana.token, corpo: { alternativa: 'B' } })
  await s.api('PUT', '/api/questoes/2/salvar', { token: ana.token })
  await s.api('PUT', '/api/questoes/3/revisar', { token: ana.token })

  assert.deepEqual(await ids('?estado=1', ana.token), [1])
  assert.deepEqual(await ids('?estado=2', ana.token), [2])
  assert.deepEqual(await ids('?estado=3', ana.token), [3])
  assert.deepEqual(await ids('?estado=4', ana.token), [2, 3, 4, 5, 6])
  assert.deepEqual(await ids('?estado=1,2', ana.token), [1, 2], 'estados simultâneos = união')
  assert.deepEqual(await ids('?estado=2,3,4', ana.token), [2, 3, 4, 5, 6])
  assert.deepEqual(await ids('?estado=1&ano=2022', ana.token), [1], 'estado combinado com outro filtro')
  assert.deepEqual(await ids('?estado=2&ano=2022', ana.token), [])
  assert.deepEqual(await ids('?estado=1&q=proteina', ana.token), [1])
})

test('sem vazamento: o estado de uma conta nunca aparece para outra', async () => {
  assert.deepEqual(await ids('?estado=1', bia.token), [])
  assert.deepEqual(await ids('?estado=2', bia.token), [])
  assert.deepEqual(await ids('?estado=3', bia.token), [])
  assert.deepEqual(await ids('?estado=4', bia.token), [1, 2, 3, 4, 5, 6])
  assert.deepEqual(await ids('?estado=1', ana.token), [1], 'Ana continua vendo o dela')
})

test('listas e respostas com credencial nunca ficam em cache compartilhado', async () => {
  const r = await s.api('GET', '/api/questoes?estado=1', { token: ana.token })
  assert.match(r.cabecalhos.get('cache-control'), /no-store/)
  const erro = await s.api('GET', '/api/questoes?estado=1')
  assert.match(erro.cabecalhos.get('cache-control'), /no-store/, 'nem os erros 401')
})

test('cards trazem o necessário para a biblioteca', async () => {
  const [card] = (await s.api('GET', '/api/questoes?q=proteina')).corpo
  for (const campo of ['id', 'serial', 'ano', 'nivel', 'conteudoId', 'conteudoNome', 'resumo', 'palavrasChave']) {
    assert.ok(campo in card, campo)
  }
  assert.equal('resposta' in card, false, 'o gabarito nunca vai na listagem')
})
