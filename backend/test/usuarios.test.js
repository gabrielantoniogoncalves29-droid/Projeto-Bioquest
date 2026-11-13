import fs from 'node:fs'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { db, google, ultimoTokenPara, iniciar, pastaTemp } from './helpers.js'
import { config } from '../src/config.js'

let s, ana, bia

before(async () => {
  s = await iniciar()
  ana = await s.criarUsuario('Ana Souza', 'ana@teste.com')
  bia = await s.criarUsuario('Bia Lima', 'bia@teste.com')
})
after(() => s.parar())

const resposta = (u, id, alternativa) => s.api('POST', `/api/questoes/${id}/resposta`, { token: u.token, corpo: { alternativa } })
const perfil = async u => (await s.api('GET', '/api/perfil', { token: u.token })).corpo
const contar = (tabela, usuarioId) => db.prepare(`SELECT COUNT(*) n FROM ${tabela} WHERE usuario_id = ?`).get(usuarioId).n

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
const formFoto = (tipo = 'image/png', bytes = PNG) => {
  const form = new FormData()
  form.append('foto', new Blob([bytes], { type: tipo }), 'foto.png')
  return form
}

test('resposta correta: o servidor decide e devolve gabarito, comentário e acertos', async () => {
  const r = await resposta(ana, 1, 'B')
  assert.equal(r.status, 200)
  assert.deepEqual({ correta: r.corpo.correta, resposta: r.corpo.resposta, acertos: r.corpo.acertos }, { correta: true, resposta: 'B', acertos: 1 })
  assert.equal(r.corpo.comentario, 'Comentário da 1')
})

test('resposta incorreta, resposta repetida e recuperação da última resposta', async () => {
  const errada = await resposta(ana, 2, 'B')
  assert.equal(errada.corpo.correta, false)
  assert.equal(errada.corpo.resposta, 'A')
  assert.equal(errada.corpo.acertos, 1)

  const repetida = await resposta(ana, 2, 'A')
  assert.equal(repetida.corpo.correta, true)
  assert.equal(repetida.corpo.acertos, 2)

  const ultima = await s.api('GET', '/api/questoes/2/minha-resposta', { token: ana.token })
  assert.deepEqual({ a: ultima.corpo.alternativa, c: ultima.corpo.correta }, { a: 'A', c: true })

  const linhasRespostas = db.prepare('SELECT COUNT(*) n FROM respostas WHERE usuario_id = ? AND questao_id = 2').get(ana.id).n
  const linhasTentativas = db.prepare('SELECT COUNT(*) n FROM tentativas WHERE usuario_id = ? AND questao_id = 2').get(ana.id).n
  assert.equal(linhasRespostas, 1, 'respostas guarda só a última')
  assert.equal(linhasTentativas, 2, 'tentativas guarda todas')
})

test('minha-resposta é null quando ainda não respondeu', async () => {
  const r = await s.api('GET', '/api/questoes/5/minha-resposta', { token: ana.token })
  assert.equal(r.status, 200)
  assert.equal(r.corpo, null)
})

test('respostas inválidas: alternativa fora de A-E, questão sem alternativas, questão inexistente', async () => {
  assert.equal((await resposta(ana, 1, 'Z')).status, 400)
  assert.equal((await s.api('POST', '/api/questoes/1/resposta', { token: ana.token, corpo: {} })).status, 400)
  assert.equal((await resposta(ana, 6, 'A')).status, 400)
  assert.equal((await resposta(ana, 999, 'A')).status, 404)
  assert.equal((await s.api('POST', '/api/questoes/abc/resposta', { token: ana.token, corpo: { alternativa: 'A' } })).status, 400)
})

test('a questão pública não vaza o gabarito; ele sai na explicação e na correção', async () => {
  const q = (await s.api('GET', '/api/questoes/1')).corpo
  assert.equal(JSON.stringify(q).includes('"resposta"'), false)
  assert.equal(q.alternativas.length, 5)
  const anonima = (await s.api('GET', '/api/questoes/1/explicacao')).corpo
  assert.equal(anonima.resposta, null)
  assert.equal(anonima.comentario, '')
  const e = (await s.api('GET', '/api/questoes/1/explicacao', { token: ana.token })).corpo
  assert.equal(e.resposta, 'B')
})

test('salvar e remover; marcar e desmarcar revisão (idempotentes)', async () => {
  assert.equal((await s.api('PUT', '/api/questoes/3/salvar', { token: ana.token })).status, 204)
  assert.equal((await s.api('PUT', '/api/questoes/3/salvar', { token: ana.token })).status, 204)
  assert.deepEqual((await perfil(ana)).questoesSalvas.map(q => q.id), [3])

  assert.equal((await s.api('DELETE', '/api/questoes/3/salvar', { token: ana.token })).status, 204)
  assert.deepEqual((await perfil(ana)).questoesSalvas, [])

  assert.equal((await s.api('PUT', '/api/questoes/4/revisar', { token: ana.token })).status, 204)
  assert.deepEqual((await perfil(ana)).questoesRevisar.map(q => q.id), [4])
  assert.equal((await s.api('DELETE', '/api/questoes/4/revisar', { token: ana.token })).status, 204)
  assert.deepEqual((await perfil(ana)).questoesRevisar, [])

  assert.equal((await s.api('PUT', '/api/questoes/999/salvar', { token: ana.token })).status, 404)
  assert.equal((await s.api('PUT', '/api/questoes/999/revisar', { token: ana.token })).status, 404)
})

test('isolamento: a Bia não vê nem altera nada da Ana', async () => {
  await s.api('PUT', '/api/questoes/3/salvar', { token: ana.token })
  await s.api('PUT', '/api/questoes/4/revisar', { token: ana.token })

  assert.equal((await s.api('GET', '/api/questoes/1/minha-resposta', { token: bia.token })).corpo, null)
  const p = await perfil(bia)
  assert.deepEqual([p.questoesResolvidas, p.questoesSalvas, p.questoesRevisar, p.acertos], [[], [], [], 0])

  const est = (await s.api('GET', '/api/estatisticas', { token: bia.token })).corpo.geral
  assert.deepEqual([est.resolvidas, est.salvas, est.revisar, est.tentativas], [0, 0, 0, 0])

  await s.api('DELETE', '/api/perfil/respostas', { token: bia.token })
  await s.api('DELETE', '/api/perfil/salvas', { token: bia.token })
  await s.api('DELETE', '/api/perfil/revisar', { token: bia.token })
  const a = await perfil(ana)
  assert.equal(a.questoesResolvidas.length, 2)
  assert.equal(a.questoesSalvas.length, 1)
  assert.equal(a.questoesRevisar.length, 1)

  await resposta(bia, 1, 'A')
  assert.equal((await s.api('GET', '/api/questoes/1/minha-resposta', { token: ana.token })).corpo.alternativa, 'B')
  assert.equal((await s.api('GET', '/api/questoes/1/minha-resposta', { token: bia.token })).corpo.alternativa, 'A')
  await s.api('DELETE', '/api/perfil/respostas', { token: bia.token })
})

test('perfil traz os dados e as listas da conta', async () => {
  const p = await perfil(ana)
  assert.equal(p.nome, 'Ana Souza')
  assert.equal(p.email, 'ana@teste.com')
  assert.equal(p.acertos, 2)
  assert.equal(p.temSenha, true)
  assert.deepEqual(p.questoesResolvidas.map(q => q.id).sort(), [1, 2])
})

test('editar nome funciona; o e-mail enviado junto é ignorado (exige verificação)', async () => {
  const r = await s.api('PATCH', '/api/perfil', { token: ana.token, corpo: { nome: 'Ana Maria', email: 'invasor@teste.com' } })
  assert.equal(r.status, 200)
  const p = await perfil(ana)
  assert.equal(p.nome, 'Ana Maria')
  assert.equal(p.email, 'ana@teste.com')
  assert.equal((await s.api('PATCH', '/api/perfil', { token: ana.token, corpo: { nome: 'A' } })).status, 400)
})

test('alterar e-mail: exige senha, só vale depois de confirmar o NOVO endereço', async () => {
  const pedir = (token, corpo) => s.api('POST', '/api/perfil/email', { token, corpo })

  assert.equal((await pedir(ana.token, { novoEmail: 'ana.nova@teste.com' })).status, 403, 'sem senha')
  const errada = await pedir(ana.token, { novoEmail: 'ana.nova@teste.com', senha: 'errada-errada' })
  assert.equal(errada.status, 403)
  assert.equal(errada.corpo.codigo, 'senha_incorreta')
  assert.equal((await pedir(ana.token, { novoEmail: 'bia@teste.com', senha: ana.senha })).status, 409, 'já em uso')
  assert.equal((await pedir(ana.token, { novoEmail: 'ana@teste.com', senha: ana.senha })).status, 400, 'mesmo e-mail')
  assert.equal((await pedir(ana.token, { novoEmail: 'invalido', senha: ana.senha })).status, 400)

  const ok = await pedir(ana.token, { novoEmail: 'ana.nova@teste.com', senha: ana.senha })
  assert.equal(ok.status, 202)
  assert.equal((await perfil(ana)).email, 'ana@teste.com', 'ainda não mudou')

  const token = ultimoTokenPara('ana.nova@teste.com')
  assert.ok(token, 'o link foi para o endereço NOVO')
  const confirmar = await s.api('POST', '/api/auth/confirmar-email', { corpo: { token } })
  assert.equal(confirmar.status, 200)
  assert.equal(confirmar.corpo.email, 'ana.nova@teste.com')

  assert.equal((await perfil(ana)).email, 'ana.nova@teste.com')
  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: ana.senha } })).status, 401)
  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'ana.nova@teste.com', senha: ana.senha } })).status, 200)
})

test('alterar e-mail em conta Google exige login recente', async () => {
  google.definirVerificadorGoogle(async () => ({ sub: 'sub-g1', email: 'goo@gmail.com', nome: 'Goo' }))
  const login = await s.api('POST', '/api/auth/google', { corpo: { credencial: 'credencial-google-valida-0123456789' } })
  const fresco = login.corpo.token
  const id = db.prepare("SELECT id FROM usuarios WHERE email = 'goo@gmail.com'").get().id

  const velho = jwt.sign({ sub: String(id), iat: Math.floor(Date.now() / 1000) - 3600 }, config.jwtSecret)
  const bloqueado = await s.api('POST', '/api/perfil/email', { token: velho, corpo: { novoEmail: 'goo2@gmail.com' } })
  assert.equal(bloqueado.status, 403)
  assert.equal(bloqueado.corpo.codigo, 'reautenticacao_necessaria')

  assert.equal((await s.api('POST', '/api/perfil/email', { token: fresco, corpo: { novoEmail: 'goo2@gmail.com' } })).status, 202)
  google.definirVerificadorGoogle(null)
})

test('foto: envia, troca (apaga a antiga) e recusa tipos inválidos', async () => {
  assert.equal((await s.api('POST', '/api/perfil/foto', { form: formFoto() })).status, 401)

  const primeira = await s.api('POST', '/api/perfil/foto', { token: ana.token, form: formFoto() })
  assert.equal(primeira.status, 200)
  const arquivo1 = path.join(config.uploadsDir, 'fotos', path.basename(primeira.corpo.foto))
  assert.ok(fs.existsSync(arquivo1))
  assert.equal((await perfil(ana)).foto, primeira.corpo.foto)

  const imagem = await fetch(s.url + primeira.corpo.foto)
  assert.equal(imagem.status, 200)
  assert.match(imagem.headers.get('content-type'), /image\/png/)

  const segunda = await s.api('POST', '/api/perfil/foto', { token: ana.token, form: formFoto() })
  assert.equal(segunda.status, 200)
  assert.equal(fs.existsSync(arquivo1), false, 'foto antiga removida do disco')

  assert.equal((await s.api('POST', '/api/perfil/foto', { token: ana.token, form: formFoto('text/plain', Buffer.from('oi')) })).status, 400)
  assert.equal((await s.api('POST', '/api/perfil/foto', { token: ana.token })).status, 400)
})

test('limpar respostas apaga resolvidas, acertos e histórico, e nada mais', async () => {
  assert.ok(contar('tentativas', ana.id) > 0)
  assert.equal((await s.api('DELETE', '/api/perfil/respostas', { token: ana.token })).status, 204)
  const p = await perfil(ana)
  assert.deepEqual([p.questoesResolvidas.length, p.acertos], [0, 0])
  assert.equal(contar('tentativas', ana.id), 0, 'estatísticas não contradizem a limpeza')
  assert.equal(p.questoesSalvas.length, 1)
  assert.equal(p.questoesRevisar.length, 1)
  const est = (await s.api('GET', '/api/estatisticas', { token: ana.token })).corpo
  assert.deepEqual([est.geral.resolvidas, est.geral.tentativas, est.geral.diasEstudados, est.geral.sequenciaAtual], [0, 0, 0, 0])
})

test('limpar salvas e limpar revisões são independentes', async () => {
  assert.equal((await s.api('DELETE', '/api/perfil/salvas', { token: ana.token })).status, 204)
  let p = await perfil(ana)
  assert.deepEqual([p.questoesSalvas.length, p.questoesRevisar.length], [0, 1])
  assert.equal((await s.api('DELETE', '/api/perfil/revisar', { token: ana.token })).status, 204)
  p = await perfil(ana)
  assert.equal(p.questoesRevisar.length, 0)
})

test('comentários: exigem login, validam o texto e respeitam FORUM_ABERTO', async () => {
  assert.equal((await s.api('POST', '/api/questoes/1/comentarios', { corpo: { texto: 'oi' } })).status, 401)
  assert.equal((await s.api('POST', '/api/questoes/1/comentarios', { token: ana.token, corpo: { texto: '   ' } })).status, 400)
  assert.equal((await s.api('POST', '/api/questoes/1/comentarios', { token: ana.token, corpo: { texto: 'x'.repeat(2001) } })).status, 400)

  const ok = await s.api('POST', '/api/questoes/1/comentarios', { token: ana.token, corpo: { texto: 'Boa questão!' } })
  assert.equal(ok.status, 201)
  assert.equal(ok.corpo.autor, 'Ana Maria', 'o autor vem da conta, não do corpo')

  config.forumAberto = false
  assert.equal((await s.api('POST', '/api/questoes/1/comentarios', { token: ana.token, corpo: { texto: 'fechado' } })).status, 403)
  config.forumAberto = true

  const lista = await s.api('GET', '/api/questoes/1/comentarios')
  assert.equal(lista.corpo.length, 1)
})

test('excluir conta: exige confirmação e senha; remove tudo da pessoa e preserva o resto', async () => {
  const zeca = await s.criarUsuario('Zeca Prado', 'zeca@teste.com')
  await resposta(zeca, 1, 'B')
  await s.api('PUT', '/api/questoes/2/salvar', { token: zeca.token })
  await s.api('PUT', '/api/questoes/3/revisar', { token: zeca.token })
  await s.api('POST', '/api/questoes/1/comentarios', { token: zeca.token, corpo: { texto: 'comentário do Zeca' } })
  const foto = await s.api('POST', '/api/perfil/foto', { token: zeca.token, form: formFoto() })
  const arquivoFoto = path.join(config.uploadsDir, 'fotos', path.basename(foto.corpo.foto))
  assert.ok(fs.existsSync(arquivoFoto))

  await resposta(bia, 1, 'B')
  const questoesAntes = db.prepare('SELECT COUNT(*) n FROM questoes').get().n

  const apagar = (corpo, token = zeca.token) => s.api('DELETE', '/api/perfil', { token, corpo })

  assert.equal((await apagar({})).status, 400, 'sem confirmação')
  assert.equal((await apagar({ confirmacao: 'outro@teste.com', senha: zeca.senha })).status, 400, 'e-mail de confirmação errado')
  const semSenha = await apagar({ confirmacao: 'zeca@teste.com' })
  assert.equal(semSenha.status, 403)
  assert.equal((await apagar({ confirmacao: 'zeca@teste.com', senha: 'senha-errada-1' })).status, 403)
  assert.ok(db.prepare('SELECT 1 FROM usuarios WHERE id = ?').get(zeca.id), 'nada foi apagado nas tentativas inválidas')

  assert.equal((await apagar({ confirmacao: 'ZECA@teste.com', senha: zeca.senha })).status, 204)

  assert.equal(db.prepare('SELECT 1 FROM usuarios WHERE id = ?').get(zeca.id), undefined, 'registro do usuário removido')
  for (const tabela of ['respostas', 'questoes_salvas', 'questoes_revisar', 'tentativas', 'tokens_usuario']) {
    assert.equal(contar(tabela, zeca.id), 0, tabela)
  }
  const comentario = db.prepare("SELECT usuario_id, autor FROM comentarios WHERE texto = 'comentário do Zeca'").get()
  assert.deepEqual(comentario, { usuario_id: null, autor: 'Usuário removido' }, 'comentário anonimizado, sem o nome')
  assert.equal(fs.existsSync(arquivoFoto), false, 'foto removida do disco')
  assert.equal(db.pragma('foreign_key_check').length, 0)

  assert.equal((await s.api('GET', '/api/auth/me', { token: zeca.token })).status, 401)
  assert.equal((await s.api('GET', '/api/perfil', { token: zeca.token })).status, 401)
  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'zeca@teste.com', senha: zeca.senha } })).status, 401)

  assert.equal(db.prepare('SELECT COUNT(*) n FROM questoes').get().n, questoesAntes)
  assert.equal((await s.api('GET', '/api/questoes/1/minha-resposta', { token: bia.token })).corpo.alternativa, 'B')
  assert.equal(contar('respostas', ana.id) + contar('respostas', bia.id), 1)
})
