import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import Database from 'better-sqlite3'

const raiz = path.resolve(import.meta.dirname, '..')

function criarBancoLegado(arquivo, versao) {
  const d = new Database(arquivo)
  d.pragma('foreign_keys = ON')
  d.exec(fs.readFileSync(path.join(import.meta.dirname, 'fixtures', 'schema-v1-original.sql'), 'utf8'))
  d.exec(`
    INSERT INTO usuarios (id, nome, email) VALUES (1, 'Gabriel Antônio', 'gabriel@email.com'), (2, 'Outra Pessoa', 'outra@email.com');
    INSERT INTO questoes (id, serial, ano, resposta, resumo) VALUES (7, 7, 2020, 'B', 'q7'), (9, 9, 2021, 'C', 'q9');
    INSERT INTO alternativas VALUES (7, 'A', 'x'), (7, 'B', 'y');
    INSERT INTO respostas (usuario_id, questao_id, alternativa, correta, atualizado_em)
      VALUES (1, 7, 'B', 1, '2025-03-02 10:00:00'), (1, 9, 'A', 0, '2025-03-03 12:00:00'), (2, 7, 'A', 0, '2025-04-01 08:00:00');
    INSERT INTO questoes_salvas (usuario_id, questao_id) VALUES (1, 7);
    INSERT INTO questoes_revisar (usuario_id, questao_id) VALUES (1, 9);
    INSERT INTO comentarios (questao_id, usuario_id, autor, texto) VALUES (7, 1, 'Gabriel Antônio', 'oi');
  `)
  d.pragma(`user_version = ${versao}`)
  d.close()
}

const ultimaLinha = texto => texto.trim().split('\n').at(-1)

function migrar(arquivo) {
  return JSON.parse(ultimaLinha(execFileSync(process.execPath, ['--input-type=module', '-e', `
    const { inicializarBanco, db } = await import('./src/db.js')
    inicializarBanco(); inicializarBanco()
    const n = t => db.prepare('SELECT COUNT(*) n FROM ' + t).get().n
    console.log(JSON.stringify({
      versao: db.pragma('user_version', { simple: true }),
      usuarios: n('usuarios'), questoesLegado: db.prepare('SELECT COUNT(*) n FROM questoes WHERE id IN (7, 9)').get().n,
      respostas: n('respostas'), salvas: n('questoes_salvas'), revisar: n('questoes_revisar'), comentarios: n('comentarios'),
      tentativas: n('tentativas'),
      origens: db.prepare('SELECT DISTINCT origem FROM tentativas').all().map(l => l.origem),
      datas: db.prepare('SELECT respondida_em FROM tentativas WHERE usuario_id = 1 ORDER BY respondida_em').all().map(l => l.respondida_em),
      gabriel: db.prepare("SELECT id, nome, senha_hash, email_confirmado, google_sub FROM usuarios WHERE email = 'gabriel@email.com'").get(),
      demoRecriado: n('usuarios'),
      fk: db.pragma('foreign_key_check').length
    }))
  `], { env: { PATH: process.env.PATH, DB_PATH: arquivo, JWT_SECRET: 'x'.repeat(40) }, cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })))
}

for (const versao of [0, 1]) {
  test(`banco legado com user_version=${versao}: migra sem perder nada e faz backup`, () => {
    const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'bioquest-migracao-'))
    const arquivo = path.join(pasta, 'bioquest.db')
    criarBancoLegado(arquivo, versao)

    const r = migrar(arquivo)

    assert.equal(r.versao, 3)
    assert.deepEqual([r.usuarios, r.questoesLegado, r.respostas, r.salvas, r.revisar, r.comentarios], [2, 2, 3, 1, 1, 1], 'nenhum registro perdido')
    assert.deepEqual(r.gabriel, { id: 1, nome: 'Gabriel Antônio', senha_hash: null, email_confirmado: 0, google_sub: null }, 'o ID e os dados do usuário antigo foram preservados, sem senha atribuída')
    assert.equal(r.fk, 0, 'integridade referencial')

    assert.equal(r.tentativas, 3)
    assert.deepEqual(r.origens, ['migracao'])
    assert.deepEqual(r.datas, ['2025-03-02 10:00:00', '2025-03-03 12:00:00'])

    const backups = fs.readdirSync(path.join(pasta, 'backups'))
    assert.equal(backups.length, 1, 'um backup, e só na primeira migração (o reinício não cria outro)')
    const copia = new Database(path.join(pasta, 'backups', backups[0]), { readonly: true })
    assert.equal(copia.prepare('SELECT COUNT(*) n FROM respostas').get().n, 3)
    assert.equal(copia.pragma('user_version', { simple: true }), versao, 'o backup guarda o estado ANTERIOR à migração')
    copia.close()
  })
}

test('banco novo não cria usuário demonstrativo nem backup', () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'bioquest-novo-'))
  const arquivo = path.join(pasta, 'bioquest.db')
  const saida = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `
    const { inicializarBanco, db } = await import('./src/db.js')
    inicializarBanco()
    console.log(JSON.stringify({ usuarios: db.prepare('SELECT COUNT(*) n FROM usuarios').get().n, versao: db.pragma('user_version', { simple: true }) }))
  `], { env: { PATH: process.env.PATH, DB_PATH: arquivo, JWT_SECRET: 'x'.repeat(40) }, cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))

  assert.deepEqual(saida, { usuarios: 0, versao: 3 })
  assert.equal(fs.existsSync(path.join(pasta, 'backups')), false)
})

test('o código não contém DROP TABLE', () => {
  for (const arquivo of ['src/db.js', 'db/schema.sql']) {
    assert.doesNotMatch(fs.readFileSync(path.join(raiz, arquivo), 'utf8'), /DROP\s+TABLE/i, arquivo)
  }
})
