import './fixtures/limites-pequenos.js'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { iniciar } from './helpers.js'

let s

before(async () => { s = await iniciar({ semear: false }) })
after(() => s.parar())

test('recuperação de senha: a 3ª solicitação seguida recebe 429', async () => {
  const status = []
  for (let i = 0; i < 4; i++) {
    status.push((await s.api('POST', '/api/auth/recuperar-senha', { corpo: { email: 'a@a.com' } })).status)
  }
  assert.deepEqual(status, [202, 202, 429, 429])
})
