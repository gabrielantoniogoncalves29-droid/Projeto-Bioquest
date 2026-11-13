import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { iniciar } from './helpers.js'

let s
let ana

before(async () => {
  s = await iniciar()
  ana = await s.criarUsuario('Ana', 'ana-nav@exemplo.com')
})

after(() => s.parar())

test('GET /api/questoes/ids devolve todos os ids na ordem do catálogo, sem login', async () => {
  const r = await s.api('GET', '/api/questoes/ids')
  assert.equal(r.status, 200)
  assert.deepEqual(r.corpo, [1, 2, 3, 4, 5, 6])
})

test('GET /api/questoes aceita paginação e informa o total no cabeçalho', async () => {
  const r = await s.api('GET', '/api/questoes?limite=2&pagina=2')
  assert.equal(r.status, 200)
  assert.deepEqual(r.corpo.map(q => q.id), [3, 4])
  assert.equal(r.cabecalhos.get('x-total-count'), '6')
})

test('paginação com valores inválidos recebe 400', async () => {
  for (const consulta of ['limite=0', 'limite=abc', 'pagina=-1', 'limite=101']) {
    assert.equal((await s.api('GET', `/api/questoes?${consulta}`)).status, 400, consulta)
  }
})

test('POST /api/auth/renovar devolve um token novo e exige login', async () => {
  assert.equal((await s.api('POST', '/api/auth/renovar')).status, 401)

  const r = await s.api('POST', '/api/auth/renovar', { token: ana.token })
  assert.equal(r.status, 200)
  assert.ok(r.corpo.token)
  assert.equal(r.corpo.usuario.email, 'ana-nav@exemplo.com')
  assert.equal((await s.api('GET', '/api/auth/me', { token: r.corpo.token })).status, 200)
})

test('/api/saude responde 200 e só expõe detalhes com o token de monitoramento', async () => {
  const r = await s.api('GET', '/api/saude')
  assert.equal(r.status, 200)
  assert.deepEqual(r.corpo, { ok: true })
})

test('upload com extensão de imagem mas conteúdo falso é recusado', async () => {
  const form = new FormData()
  form.append('foto', new Blob(['isto nao e um png'], { type: 'image/png' }), 'foto.png')

  const r = await s.api('POST', '/api/perfil/foto', { token: ana.token, form })
  assert.equal(r.status, 400)
})

test('nome com caracteres de marcação é recusado no cadastro', async () => {
  const r = await s.api('POST', '/api/auth/cadastro', { corpo: { nome: '<script>x</script>', email: 'xss@exemplo.com', senha: 'senha-segura-1' } })
  assert.equal(r.status, 400)
})
