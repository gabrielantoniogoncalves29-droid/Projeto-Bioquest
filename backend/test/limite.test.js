import './fixtures/limites-pequenos.js'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { iniciar } from './helpers.js'

let s

before(async () => { s = await iniciar({ semear: false }) })
after(() => s.parar())

test('muitas tentativas de login seguidas recebem 429', async () => {
  const status = []
  for (let i = 0; i < 7; i++) {
    status.push((await s.api('POST', '/api/auth/login', { corpo: { email: 'a@a.com', senha: 'errada-errada' } })).status)
  }
  assert.deepEqual(status.slice(0, 5), [401, 401, 401, 401, 401])
  assert.deepEqual(status.slice(5), [429, 429])
})

test('a resposta 429 é JSON e não vaza detalhes', async () => {
  const r = await s.api('POST', '/api/auth/login', { corpo: { email: 'a@a.com', senha: 'x' } })
  assert.equal(r.status, 429)
  assert.match(r.corpo.erro, /Muitas tentativas/)
})
