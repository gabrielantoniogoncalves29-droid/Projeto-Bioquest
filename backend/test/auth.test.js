import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { naoAutorizado } from '../src/utils/erros.js'
import { db, email, google, caixa, ultimoTokenPara, iniciar } from './helpers.js'

let s

before(async () => { s = await iniciar() })
after(() => s.parar())

const novo = (n, e, senha = 'senha-segura-1') => ({ nome: n, email: e, senha })

test('cadastro válido cria conta pendente e envia e-mail de confirmação', async () => {
  const r = await s.api('POST', '/api/auth/cadastro', { corpo: novo('Ana Souza', 'ana@teste.com') })
  assert.equal(r.status, 201)
  assert.equal(r.corpo.emailEnviado, true)
  assert.ok(ultimoTokenPara('ana@teste.com'))
  const u = db.prepare('SELECT senha_hash, email_confirmado FROM usuarios WHERE email = ?').get('ana@teste.com')
  assert.equal(u.email_confirmado, 0)
  assert.match(u.senha_hash, /^\$2[aby]\$/, 'senha guardada com bcrypt')
})

test('o banco guarda só o hash do token, nunca o token', () => {
  const token = ultimoTokenPara('ana@teste.com')
  const linhas = JSON.stringify(db.prepare('SELECT * FROM tokens_usuario').all())
  assert.ok(!linhas.includes(token))
})

test('cadastro inválido é recusado com 400', async () => {
  for (const corpo of [
    novo('A', 'a@teste.com'),
    novo('Bruno Lima', 'email-sem-arroba'),
    novo('Bruno Lima', 'bruno@teste.com', '1234567'),
    novo('Bruno Lima', 'bruno@teste.com', 'x'.repeat(73)),
    {}
  ]) {
    assert.equal((await s.api('POST', '/api/auth/cadastro', { corpo })).status, 400, JSON.stringify(corpo))
  }
})

test('e-mail duplicado (mesmo com maiúsculas) retorna 409', async () => {
  const r = await s.api('POST', '/api/auth/cadastro', { corpo: novo('Outra Ana', 'ANA@teste.com') })
  assert.equal(r.status, 409)
})

test('login antes de confirmar o e-mail é bloqueado com código próprio', async () => {
  const r = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })
  assert.equal(r.status, 403)
  assert.equal(r.corpo.codigo, 'email_nao_confirmado')
})

test('reenvio gera link novo e invalida o anterior', async () => {
  const antigo = ultimoTokenPara('ana@teste.com')
  const r = await s.api('POST', '/api/auth/reenviar-confirmacao', { corpo: { email: 'ana@teste.com' } })
  assert.equal(r.status, 202)
  const novoToken = ultimoTokenPara('ana@teste.com')
  assert.notEqual(novoToken, antigo)
  assert.equal((await s.api('POST', '/api/auth/confirmar-email', { corpo: { token: antigo } })).status, 400)
})

test('reenvio para e-mail inexistente responde igual (sem revelar contas)', async () => {
  const antes = caixa.length
  const r = await s.api('POST', '/api/auth/reenviar-confirmacao', { corpo: { email: 'ninguem@teste.com' } })
  assert.equal(r.status, 202)
  assert.equal(caixa.length, antes)
})

test('confirmação de e-mail é de uso único e depois permite login', async () => {
  const token = ultimoTokenPara('ana@teste.com')
  assert.equal((await s.api('POST', '/api/auth/confirmar-email', { corpo: { token } })).status, 200)
  assert.equal((await s.api('POST', '/api/auth/confirmar-email', { corpo: { token } })).status, 400)

  const r = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })
  assert.equal(r.status, 200)
  assert.ok(r.corpo.token)
  assert.equal(r.corpo.usuario.email, 'ana@teste.com')
  assert.equal(r.corpo.usuario.temSenha, true)
  assert.equal(r.corpo.usuario.senha_hash, undefined)
})

test('senha incorreta e e-mail inexistente dão a mesma resposta 401', async () => {
  const a = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'errada-errada' } })
  const b = await s.api('POST', '/api/auth/login', { corpo: { email: 'x@teste.com', senha: 'errada-errada' } })
  assert.equal(a.status, 401)
  assert.equal(b.status, 401)
  assert.deepEqual(a.corpo.erro, b.corpo.erro)
})

test('conta antiga sem senha (demonstrativa) não consegue entrar', async () => {
  const legado = db.prepare("SELECT 1 FROM usuarios WHERE email = 'gabriel@email.com'").get()
  assert.equal(legado, undefined, 'a conta demo não é mais criada automaticamente')
  db.prepare("INSERT INTO usuarios (id, nome, email) VALUES (900, 'Legado', 'legado@teste.com')").run()
  const r = await s.api('POST', '/api/auth/login', { corpo: { email: 'legado@teste.com', senha: 'qualquer-senha' } })
  assert.equal(r.status, 401)
})

test('/me: token ausente, inválido, adulterado, expirado e com algoritmo none', async () => {
  assert.equal((await s.api('GET', '/api/auth/me')).status, 401)
  assert.equal((await s.api('GET', '/api/auth/me', { token: 'lixo' })).status, 401)

  const login = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })
  const id = db.prepare("SELECT id FROM usuarios WHERE email = 'ana@teste.com'").get().id
  assert.equal((await s.api('GET', '/api/auth/me', { token: login.corpo.token })).status, 200)

  const adulterado = login.corpo.token.slice(0, -3) + 'abc'
  assert.equal((await s.api('GET', '/api/auth/me', { token: adulterado })).status, 401)

  const outroSegredo = jwt.sign({ sub: String(id) }, 'outro-segredo-qualquer-com-mais-de-32-chars')
  assert.equal((await s.api('GET', '/api/auth/me', { token: outroSegredo })).status, 401)

  const expirado = jwt.sign({ sub: String(id) }, process.env.JWT_SECRET, { expiresIn: -10 })
  const r = await s.api('GET', '/api/auth/me', { token: expirado })
  assert.equal(r.status, 401)
  assert.match(r.corpo.erro, /expirou/)

  const none = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: String(id) })).toString('base64url')}.`
  assert.equal((await s.api('GET', '/api/auth/me', { token: none })).status, 401)
})

test('rotas privadas exigem autenticação', async () => {
  const privadas = [
    ['GET', '/api/auth/me'], ['POST', '/api/auth/logout'], ['POST', '/api/auth/alterar-senha'],
    ['GET', '/api/perfil'], ['PATCH', '/api/perfil'], ['DELETE', '/api/perfil'], ['POST', '/api/perfil/email'],
    ['DELETE', '/api/perfil/respostas'], ['DELETE', '/api/perfil/salvas'], ['DELETE', '/api/perfil/revisar'],
    ['GET', '/api/estatisticas'], ['GET', '/api/questoes/1/minha-resposta'],
    ['POST', '/api/questoes/1/resposta'], ['PUT', '/api/questoes/1/salvar'], ['DELETE', '/api/questoes/1/salvar'],
    ['PUT', '/api/questoes/1/revisar'], ['DELETE', '/api/questoes/1/revisar'], ['POST', '/api/questoes/1/comentarios'],
    ['GET', '/api/questoes?estado=1']
  ]
  for (const [metodo, caminho] of privadas) {
    assert.equal((await s.api(metodo, caminho, { corpo: {} })).status, 401, `${metodo} ${caminho}`)
  }
})

test('rotas públicas continuam abertas', async () => {
  for (const caminho of ['/api/taxonomia', '/api/config', '/api/questoes', '/api/questoes/1', '/api/questoes/1/explicacao', '/api/questoes/1/comentarios', '/api/palavras-chave?q=ec']) {
    assert.equal((await s.api('GET', caminho)).status, 200, caminho)
  }
})

test('o corpo de uma requisição não define a identidade (usuarioId é ignorado)', async () => {
  const r = await s.api('POST', '/api/questoes/1/resposta', { corpo: { alternativa: 'A', usuarioId: 1 } })
  assert.equal(r.status, 401)
})

test('logout responde 204 (o token é descartado no cliente)', async () => {
  const { token } = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } }).then(r => r.corpo)
  assert.equal((await s.api('POST', '/api/auth/logout', { token })).status, 204)
})

test('recuperação de senha: resposta igual com e sem conta, token único, sessões antigas caem', async () => {
  const antes = caixa.length
  const existente = await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'ana@teste.com' } })
  const inexistente = await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'fantasma@teste.com' } })
  assert.equal(existente.status, 202)
  assert.deepEqual(existente.corpo, inexistente.corpo)
  assert.equal(caixa.length, antes + 1, 'só a conta existente recebe e-mail')

  const sessaoAntiga = (await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })).corpo.token
  const token = ultimoTokenPara('ana@teste.com')

  assert.equal((await s.api('POST', '/api/auth/redefinir-senha', { corpo: { token, senha: 'curta' } })).status, 400)
  assert.equal((await s.api('POST', '/api/auth/redefinir-senha', { corpo: { token: 'x'.repeat(43), senha: 'nova-senha-123' } })).status, 400)

  await new Promise(r => setTimeout(r, 1100))
  assert.equal((await s.api('POST', '/api/auth/redefinir-senha', { corpo: { token, senha: 'nova-senha-123' } })).status, 200)
  assert.equal((await s.api('POST', '/api/auth/redefinir-senha', { corpo: { token, senha: 'outra-senha-123' } })).status, 400, 'uso único')

  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'senha-segura-1' } })).status, 401)
  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'nova-senha-123' } })).status, 200)
  assert.equal((await s.api('GET', '/api/auth/me', { token: sessaoAntiga })).status, 401, 'sessão anterior invalidada')
})

test('token de recuperação expirado é recusado', async () => {
  await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'ana@teste.com' } })
  const token = ultimoTokenPara('ana@teste.com')
  db.prepare("UPDATE tokens_usuario SET expira_em = '2000-01-01T00:00:00.000Z' WHERE tipo = 'redefinir_senha' AND usado_em IS NULL").run()
  assert.equal((await s.api('POST', '/api/auth/redefinir-senha', { corpo: { token, senha: 'qualquer-senha-1' } })).status, 400)
})

test('alterar senha: exige a atual, devolve sessão nova e derruba a antiga', async () => {
  const login = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'nova-senha-123' } })
  const token = login.corpo.token

  const errada = await s.api('POST', '/api/auth/alterar-senha', { token, corpo: { senhaAtual: 'nao-e-essa', novaSenha: 'terceira-senha-1' } })
  assert.equal(errada.status, 403)
  assert.equal(errada.corpo.codigo, 'senha_incorreta')
  assert.equal((await s.api('POST', '/api/auth/alterar-senha', { token, corpo: { senhaAtual: 'nova-senha-123', novaSenha: 'curta' } })).status, 400)

  await new Promise(r => setTimeout(r, 1100))
  const ok = await s.api('POST', '/api/auth/alterar-senha', { token, corpo: { senhaAtual: 'nova-senha-123', novaSenha: 'terceira-senha-1' } })
  assert.equal(ok.status, 200)
  assert.equal((await s.api('GET', '/api/auth/me', { token })).status, 401)
  assert.equal((await s.api('GET', '/api/auth/me', { token: ok.corpo.token })).status, 200)
  assert.equal((await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'terceira-senha-1' } })).status, 200)
})

function simularGoogle(contas) {
  google.definirVerificadorGoogle(async credencial => {
    const conta = contas[credencial]
    if (!conta) throw naoAutorizado('Credencial do Google inválida ou expirada')
    return conta
  })
}

const CRED_VALIDA = 'credencial-google-valida-0123456789'
const CRED_OUTRA = 'credencial-google-outra-0123456789ab'
const CRED_MESMO_EMAIL = 'credencial-google-mesmo-email-0123456'

test('Google: primeiro acesso cria a conta; o segundo recupera a MESMA conta', async () => {
  simularGoogle({
    [CRED_VALIDA]: { sub: 'sub-123', email: 'gabi@gmail.com', nome: 'Gabi Google' },
    [CRED_MESMO_EMAIL]: { sub: 'sub-999', email: 'ana@teste.com', nome: 'Impostora' }
  })

  const primeiro = await s.api('POST', '/api/auth/google', { corpo: { credencial: CRED_VALIDA } })
  assert.equal(primeiro.status, 200)
  assert.equal(primeiro.corpo.usuario.nome, 'Gabi Google')
  assert.equal(primeiro.corpo.usuario.temSenha, false)

  const segundo = await s.api('POST', '/api/auth/google', { corpo: { credencial: CRED_VALIDA } })
  assert.equal(segundo.status, 200)

  const contas = db.prepare("SELECT id, email_confirmado FROM usuarios WHERE google_sub = 'sub-123'").all()
  assert.equal(contas.length, 1, 'sem usuários duplicados')
  assert.equal(contas[0].email_confirmado, 1)

  assert.equal((await s.api('PUT', '/api/questoes/1/salvar', { token: primeiro.corpo.token })).status, 204)
  const perfil = await s.api('GET', '/api/perfil', { token: segundo.corpo.token })
  assert.equal(perfil.corpo.questoesSalvas.length, 1)
})

test('Google: e-mail de conta existente NÃO é vinculado automaticamente', async () => {
  const r = await s.api('POST', '/api/auth/google', { corpo: { credencial: CRED_MESMO_EMAIL } })
  assert.equal(r.status, 409)
  assert.equal(db.prepare("SELECT google_sub FROM usuarios WHERE email = 'ana@teste.com'").get().google_sub, null)
})

test('Google: credencial inválida é rejeitada e formato errado dá 400', async () => {
  assert.equal((await s.api('POST', '/api/auth/google', { corpo: { credencial: 'credencial-que-nao-existe-123456789' } })).status, 401)
  assert.equal((await s.api('POST', '/api/auth/google', { corpo: { credencial: 'curta' } })).status, 400)
  assert.equal((await s.api('POST', '/api/auth/google', { corpo: {} })).status, 400)
})

test('Google: vincular exige estar logado e o sub não pode ser de outra conta', async () => {
  const login = await s.api('POST', '/api/auth/login', { corpo: { email: 'ana@teste.com', senha: 'terceira-senha-1' } })
  assert.equal((await s.api('POST', '/api/auth/google/vincular', { corpo: { credencial: CRED_OUTRA } })).status, 401)

  simularGoogle({ [CRED_OUTRA]: { sub: 'sub-777', email: 'ana.pessoal@gmail.com', nome: 'Ana' }, [CRED_VALIDA]: { sub: 'sub-123', email: 'gabi@gmail.com', nome: 'Gabi' } })

  assert.equal((await s.api('POST', '/api/auth/google/vincular', { token: login.corpo.token, corpo: { credencial: CRED_VALIDA } })).status, 409)

  const ok = await s.api('POST', '/api/auth/google/vincular', { token: login.corpo.token, corpo: { credencial: CRED_OUTRA } })
  assert.equal(ok.status, 200)
  assert.equal(ok.corpo.temGoogle, true)
})

test('Google real sem Client ID configurado responde 503 (não finge)', async () => {
  google.definirVerificadorGoogle(null)
  const r = await s.api('POST', '/api/auth/google', { corpo: { credencial: CRED_VALIDA } })
  assert.equal(r.status, 503)
})

test('sem SMTP o cadastro avisa que o e-mail não foi enviado e a recuperação responde 503', async () => {
  email.definirTransporteDeTeste(null)
  const cad = await s.api('POST', '/api/auth/cadastro', { corpo: novo('Sem Email', 'semsmtp@teste.com') })
  assert.equal(cad.status, 201)
  assert.equal(cad.corpo.emailEnviado, false)
  assert.equal((await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'ana@teste.com' } })).status, 503)
  assert.equal((await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'fantasma@teste.com' } })).status, 503)
  email.definirTransporteDeTeste(async m => { caixa.push(m) })
})
