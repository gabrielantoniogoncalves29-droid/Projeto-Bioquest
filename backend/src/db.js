import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { config } from './config.js'

const pastaDb = path.join(config.raiz, 'db')

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })

export const db = new Database(config.dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function sincronizarTaxonomia() {
  const taxonomia = JSON.parse(
    fs.readFileSync(path.join(pastaDb, 'taxonomia.json'), 'utf8')
  )

  const inserirNivel = db.prepare(`
    INSERT INTO niveis (id, nome, dificuldade) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET nome = excluded.nome, dificuldade = excluded.dificuldade
  `)
  const inserirEixo = db.prepare(`
    INSERT INTO eixos (id, nome) VALUES (?, ?)
    ON CONFLICT(id) DO UPDATE SET nome = excluded.nome
  `)
  const inserirConteudo = db.prepare(`
    INSERT INTO conteudos (id, eixo_id, nome) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET eixo_id = excluded.eixo_id, nome = excluded.nome
  `)
  const inserirSub = db.prepare(`
    INSERT INTO subconteudos (conteudo_id, nome, ordem) VALUES (?, ?, ?)
    ON CONFLICT(conteudo_id, ordem) DO UPDATE SET nome = excluded.nome
  `)

  db.transaction(() => {
    taxonomia.niveis.forEach(n => inserirNivel.run(n.id, n.nome, n.dificuldade))
    taxonomia.eixos.forEach(e => inserirEixo.run(e.id, e.nome))
    taxonomia.conteudos.forEach(c => {
      inserirConteudo.run(c.id, c.eixoId, c.nome)
      c.subconteudos.forEach((nome, ordem) => inserirSub.run(c.id, nome, ordem))
    })
  })()
}

function garantirUsuarioDemo() {
  db.prepare(`
    INSERT OR IGNORE INTO usuarios (id, nome, email) VALUES (?, ?, ?)
  `).run(config.usuarioDemoId, 'Gabriel Antônio', 'gabriel@email.com')
}

export function inicializarBanco() {
  db.exec(fs.readFileSync(path.join(pastaDb, 'schema.sql'), 'utf8'))
  sincronizarTaxonomia()
  garantirUsuarioDemo()
}
