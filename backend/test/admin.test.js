import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { db, iniciar } from './helpers.js'
import { config } from '../src/config.js'
import { importarArquivos } from '../src/services/arquivosQuestoes.js'

let s, ana

const basic = senha => ({ Authorization: `Basic ${Buffer.from(`admin:${senha}`).toString('base64')}` })
const ADMIN = basic('senha-admin-de-teste')
const admin = (metodo, caminho, opcoes = {}) => s.api(metodo, `/admin/api${caminho}`, { ...opcoes, cabecalhos: { ...ADMIN, ...opcoes.cabecalhos } })

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
const formComImagem = campos => {
  const form = new FormData()
  Object.entries(campos).forEach(([k, v]) => form.append(k, v))
  form.append('imagem', new Blob([PNG], { type: 'image/png' }), 'figura.png')
  return form
}

const QUESTAO = {
  ano: 2025, nivelId: 2, conteudoId: 3, subconteudoId: 301, objetoId: 1,
  resumo: 'Osmose em hemácias zebrinha',
  enunciadoTexto: 'Texto do enunciado da questão criada pelo painel.',
  alternativaA: 'Opção A', alternativaB: 'Opção B', alternativaC: 'Opção C', alternativaD: 'Opção D', alternativaE: 'Opção E',
  resposta: 'C', comentario: 'Explicação da questão', teoria: 'Primeira linha de teoria\nSegunda linha',
  palavrasChave: 'osmose; hemácia; zebrinha'
}

before(async () => {
  s = await iniciar()
  ana = await s.criarUsuario('Ana Souza', 'ana@teste.com')
})
after(() => s.parar())

test('acesso administrativo não autorizado é negado', async () => {
  assert.equal((await s.api('GET', '/admin/api/questoes')).status, 401)
  assert.equal((await s.api('GET', '/admin/api/questoes', { cabecalhos: basic('senha-errada') })).status, 401)
  assert.equal((await s.api('GET', '/admin/api/questoes', { token: ana.token })).status, 401, 'o login de usuário não abre o painel')
  assert.equal((await s.api('POST', '/admin/api/questoes', { corpo: QUESTAO })).status, 401)
  assert.equal((await s.api('POST', '/admin/api/exportar')).status, 401)
  assert.equal((await s.api('DELETE', '/admin/api/questoes/1')).status, 401)
  assert.equal((await admin('GET', '/questoes')).status, 200)
})

test('pedidos que alteram dados vindos de outro site são recusados (CSRF)', async () => {
  const r = await admin('POST', '/questoes', { corpo: QUESTAO, cabecalhos: { Origin: 'https://site-malicioso.example' } })
  assert.equal(r.status, 403)
  assert.equal(db.prepare('SELECT COUNT(*) n FROM questoes').get().n, 6)
})

test('painel sem senha, ou com senha fraca em produção, fica desligado', () => {
  const rodar = env => execFileSync(process.execPath, ['--input-type=module', '-e',
    "const { config } = await import('./src/config.js'); console.log(JSON.stringify({ ativo: config.adminAtivo }))"],
  { env: { PATH: process.env.PATH, ...env }, cwd: path.resolve(import.meta.dirname, '..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })

  const base = { DB_PATH: ':memory:', JWT_SECRET: 'x'.repeat(40) }
  assert.deepEqual(JSON.parse(rodar({ ...base, ADMIN_ATIVO: 'true', ADMIN_SENHA: '' })), { ativo: false })
  assert.deepEqual(JSON.parse(rodar({ ...base })), { ativo: false }, 'sem nada configurado')
  assert.deepEqual(JSON.parse(rodar({ ...base, NODE_ENV: 'production', ADMIN_ATIVO: 'true', ADMIN_SENHA: 'curta' })), { ativo: false })
  assert.deepEqual(JSON.parse(rodar({ ...base, NODE_ENV: 'production', ADMIN_ATIVO: 'true', ADMIN_SENHA: 'senha-forte-com-mais-de-12' })), { ativo: true })
})

test('produção exige JWT_SECRET forte (o servidor nem sobe sem ele)', () => {
  assert.throws(() => execFileSync(process.execPath, ['--input-type=module', '-e', "await import('./src/config.js')"],
    { env: { PATH: process.env.PATH, NODE_ENV: 'production', JWT_SECRET: 'curto' }, cwd: path.resolve(import.meta.dirname, '..'), stdio: 'ignore' }))
})

let criada

test('criar questão: salva tudo e exporta o arquivo JSON', async () => {
  const r = await admin('POST', '/questoes', { corpo: QUESTAO })
  assert.equal(r.status, 201, JSON.stringify(r.corpo))
  criada = r.corpo
  assert.equal(criada.id, 7)
  assert.equal(criada.resposta, 'C')
  assert.deepEqual(criada.teoria, ['Primeira linha de teoria', 'Segunda linha'])
  assert.deepEqual(criada.palavrasChave, ['osmose', 'hemácia', 'zebrinha'])
  assert.equal(Object.keys(criada.alternativas).length, 5)
  assert.ok(fs.existsSync(path.join(config.pastaQuestoes, '0007.json')), 'arquivo exportado para versionamento')
})

test('a questão criada aparece na biblioteca, na pesquisa, nos detalhes e nas sugestões', async () => {
  const lista = (await s.api('GET', '/api/questoes')).corpo
  assert.ok(lista.some(q => q.id === 7))
  assert.deepEqual((await s.api('GET', '/api/questoes?q=zebrinha')).corpo.map(q => q.id), [7])
  assert.deepEqual((await s.api('GET', '/api/questoes?q=hemacia')).corpo.map(q => q.id), [7], 'palavra-chave sem acento')
  assert.deepEqual((await s.api('GET', '/api/questoes?ano=2025&conteudo=3')).corpo.map(q => q.id), [7])

  const q = (await s.api('GET', '/api/questoes/7')).corpo
  assert.equal(q.alternativas.length, 5)
  assert.equal(q.enunciado.textoPrincipal, QUESTAO.enunciadoTexto)
  assert.equal(JSON.stringify(q).includes('"resposta"'), false)

  const e = (await s.api('GET', '/api/questoes/7/explicacao')).corpo
  assert.equal(e.liberada, false)
  assert.equal(e.resposta, null)
  assert.equal(e.comentario, '')
  assert.equal(e.teoria.length, 2)

  assert.ok((await s.api('GET', '/api/palavras-chave?q=zebr')).corpo.includes('zebrinha'))

  const certa = await s.api('POST', '/api/questoes/7/resposta', { token: ana.token, corpo: { alternativa: 'C' } })
  assert.equal(certa.corpo.correta, true, 'dá para resolver a questão cadastrada pelo painel')

  const liberada = (await s.api('GET', '/api/questoes/7/explicacao', { token: ana.token })).corpo
  assert.equal(liberada.resposta, 'C')
  assert.equal(liberada.comentario, 'Explicação da questão')
})

test('validação de campos do painel', async () => {
  for (const alteracao of [{ ano: 1800 }, { resposta: 'Z' }, { nivelId: 9 }, { imagemUrl: 'javascript:alert(1)' }, { ano: 'abc' }, { id: 7 }]) {
    const r = await admin('POST', '/questoes', { corpo: { ...QUESTAO, ...alteracao } })
    assert.ok([400, 409].includes(r.status), `${JSON.stringify(alteracao)} -> ${r.status}`)
  }
  assert.equal(db.prepare('SELECT COUNT(*) n FROM questoes').get().n, 7, 'nada inválido foi gravado')
  assert.equal((await admin('GET', '/questoes/999')).status, 404)
  assert.equal((await admin('PUT', '/questoes/999', { corpo: QUESTAO })).status, 404)
  assert.equal((await admin('DELETE', '/questoes/999')).status, 404)
})

test('editar: enunciado, alternativas, gabarito, teoria e palavras-chave', async () => {
  const r = await admin('PUT', '/questoes/7', { corpo: {
    ...QUESTAO, resumo: 'Resumo editado', alternativaB: 'B editada', alternativaE: '', resposta: 'B',
    teoria: 'Só uma linha', palavrasChave: 'osmose; nova-palavra'
  } })
  assert.equal(r.status, 200, JSON.stringify(r.corpo))
  assert.equal(r.corpo.resposta, 'B')
  assert.equal(Object.keys(r.corpo.alternativas).length, 4)

  const q = (await s.api('GET', '/api/questoes/7')).corpo
  assert.deepEqual(q.alternativas.map(a => a.letra), ['A', 'B', 'C', 'D'])
  assert.equal(q.alternativas.find(a => a.letra === 'B').texto, 'B editada')
  assert.equal((await s.api('GET', '/api/questoes/7/explicacao', { token: ana.token })).corpo.resposta, 'B')
  assert.deepEqual((await s.api('GET', '/api/questoes?q=zebrinha')).corpo, [], 'palavra removida some da busca')
  assert.deepEqual((await s.api('GET', '/api/questoes?q=nova-palavra')).corpo.map(c => c.id), [7])
  assert.equal(db.prepare("SELECT COUNT(*) n FROM palavras_chave WHERE normalizada = 'zebrinha'").get().n, 0, 'palavra sem uso é limpa')
})

test('upload de imagem: grava, serve, troca (apaga a anterior) e remove', async () => {
  const enviar = campos => admin('PUT', '/questoes/7', { form: formComImagem(campos) })
  const base = { ...QUESTAO, resumo: 'Com imagem' }

  const primeira = await enviar(base)
  assert.equal(primeira.status, 200, JSON.stringify(primeira.corpo))
  const caminho1 = primeira.corpo.imagem
  assert.match(caminho1, /^\/uploads\/questoes\//)
  const arquivo1 = path.join(config.uploadsDir, 'questoes', path.basename(caminho1))
  assert.ok(fs.existsSync(arquivo1))

  const servida = await fetch(s.url + caminho1)
  assert.equal(servida.status, 200)
  assert.match(servida.headers.get('content-type'), /image\/png/)
  assert.equal((await s.api('GET', '/api/questoes/7')).corpo.enunciado.imagem, caminho1)

  const segunda = await enviar(base)
  assert.notEqual(segunda.corpo.imagem, caminho1)
  assert.equal(fs.existsSync(arquivo1), false, 'imagem anterior apagada')

  const arquivo2 = path.join(config.uploadsDir, 'questoes', path.basename(segunda.corpo.imagem))
  const remover = await admin('PUT', '/questoes/7', { corpo: { ...base, removerImagem: '1' } })
  assert.equal(remover.corpo.imagem, '')
  assert.equal(fs.existsSync(arquivo2), false)

  const naoImagem = new FormData()
  Object.entries(base).forEach(([k, v]) => naoImagem.append(k, v))
  naoImagem.append('imagem', new Blob(['texto'], { type: 'text/plain' }), 'x.txt')
  const recusada = await admin('PUT', '/questoes/7', { form: naoImagem })
  assert.equal(recusada.status, 200)
  assert.equal(recusada.corpo.imagem, '', 'arquivo que não é imagem é ignorado')
})

test('exportar e importar: os arquivos JSON voltam para o banco; arquivo inválido não aplica nada', async () => {
  const exportacao = await admin('POST', '/exportar')
  assert.equal(exportacao.status, 200)
  assert.ok(exportacao.corpo.exportadas >= 1)

  const arquivo = path.join(config.pastaQuestoes, '0007.json')
  const json = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
  assert.equal(json.id, 7)
  assert.equal(json.resumo, 'Com imagem')

  json.resumo = 'Resumo vindo do arquivo'
  json.alternativas.A = 'A vinda do arquivo'
  fs.writeFileSync(arquivo, JSON.stringify(json))

  const importado = importarArquivos()
  assert.deepEqual(importado.problemas, [])
  assert.equal(db.prepare('SELECT resumo FROM questoes WHERE id = 7').get().resumo, 'Resumo vindo do arquivo')
  assert.equal(db.prepare("SELECT texto FROM alternativas WHERE questao_id = 7 AND letra = 'A'").get().texto, 'A vinda do arquivo')

  json.resumo = 'NÃO DEVE ENTRAR'
  fs.writeFileSync(arquivo, JSON.stringify(json))
  fs.writeFileSync(path.join(config.pastaQuestoes, '0099.json'), '{ json quebrado')
  const falha = importarArquivos()
  assert.ok(falha.problemas.length >= 1)
  assert.equal(db.prepare('SELECT resumo FROM questoes WHERE id = 7').get().resumo, 'Resumo vindo do arquivo')
  fs.rmSync(path.join(config.pastaQuestoes, '0099.json'))
})

test('reiniciar o servidor não altera nem apaga dados', () => {
  const contar = () => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `
    const { inicializarBanco, db } = await import('./src/db.js')
    inicializarBanco(); inicializarBanco()
    const n = t => db.prepare('SELECT COUNT(*) n FROM ' + t).get().n
    console.log(JSON.stringify({ versao: db.pragma('user_version', { simple: true }), usuarios: n('usuarios'), questoes: n('questoes'),
      alternativas: n('alternativas'), respostas: n('respostas'), tentativas: n('tentativas'), palavras: n('palavras_chave') }))
  `], { env: { ...process.env }, cwd: path.resolve(import.meta.dirname, '..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))

  const n = t => db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n
  const antes = { versao: 3, usuarios: n('usuarios'), questoes: n('questoes'), alternativas: n('alternativas'), respostas: n('respostas'), tentativas: n('tentativas'), palavras: n('palavras_chave') }
  assert.deepEqual(contar(), antes)
  assert.deepEqual(contar(), antes, 'segundo reinício igual ao primeiro')
  assert.equal(db.prepare('SELECT resumo FROM questoes WHERE id = 7').get().resumo, 'Resumo vindo do arquivo')
})

test('excluir questão: some da biblioteca, apaga arquivos e dados dependentes, e preserva as outras', async () => {
  const antes = db.prepare('SELECT COUNT(*) n FROM questoes').get().n
  assert.equal((await admin('DELETE', '/questoes/7')).status, 204)

  assert.equal((await s.api('GET', '/api/questoes/7')).status, 404)
  assert.equal(db.prepare('SELECT COUNT(*) n FROM questoes').get().n, antes - 1)
  assert.equal(db.prepare('SELECT COUNT(*) n FROM alternativas WHERE questao_id = 7').get().n, 0)
  assert.equal(db.prepare('SELECT COUNT(*) n FROM respostas WHERE questao_id = 7').get().n, 0, 'resposta da Ana à 7 saiu junto')
  assert.equal(db.prepare('SELECT COUNT(*) n FROM tentativas WHERE questao_id = 7').get().n, 0)
  assert.equal(fs.existsSync(path.join(config.pastaQuestoes, '0007.json')), false)
  assert.equal(db.pragma('foreign_key_check').length, 0)
  assert.deepEqual((await s.api('GET', '/api/questoes')).corpo.map(q => q.id), [1, 2, 3, 4, 5, 6])
  assert.equal((await admin('GET', '/questoes')).corpo.length, 6)
})

test('o HTML do painel é servido só com autenticação', async () => {
  assert.equal((await s.api('GET', '/admin/')).status, 401)
  const r = await fetch(`${s.url}/admin/`, { headers: ADMIN })
  assert.equal(r.status, 200)
  assert.match(await r.text(), /<html/i)
})
