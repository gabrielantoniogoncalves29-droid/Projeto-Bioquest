import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { config } from './config.js'

const pastaDb = path.join(config.raiz, 'db')

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })

export const db = new Database(config.dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')


export const idDoSubconteudo = (conteudoId, numero) => conteudoId * 100 + numero

const VERSAO_SCHEMA = 1

function migrar(versaoAtual) {
  if (versaoAtual < 1) {
    db.pragma('foreign_keys = OFF')
    db.exec(`
      DROP TABLE IF EXISTS comentarios;
      DROP TABLE IF EXISTS respostas;
      DROP TABLE IF EXISTS questoes_salvas;
      DROP TABLE IF EXISTS questoes_revisar;
      DROP TABLE IF EXISTS questao_palavras_chave;
      DROP TABLE IF EXISTS palavras_chave;
      DROP TABLE IF EXISTS alternativas;
      DROP TABLE IF EXISTS questoes;
      DROP TABLE IF EXISTS subconteudos;
    `)
    db.pragma('foreign_keys = ON')
  }

  db.pragma(`user_version = ${VERSAO_SCHEMA}`)
}

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
    INSERT INTO subconteudos (id, conteudo_id, numero, codigo, nome) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET nome = excluded.nome, codigo = excluded.codigo
  `)

  db.transaction(() => {
    taxonomia.niveis.forEach(n => inserirNivel.run(n.id, n.nome, n.dificuldade))
    taxonomia.eixos.forEach(e => inserirEixo.run(e.id, e.nome.trim()))
    taxonomia.conteudos.forEach(c => {
      inserirConteudo.run(c.id, c.eixoId, c.nome.trim())
      c.subconteudos.forEach((nome, indice) => {
        const numero = indice + 1
        inserirSub.run(idDoSubconteudo(c.id, numero), c.id, numero, `C${numero}`, nome.trim())
      })
    })
  })()
}

function garantirUsuarioDemo() {
  db.prepare(`
    INSERT OR IGNORE INTO usuarios (id, nome, email) VALUES (?, ?, ?)
  `).run(config.usuarioDemoId, 'Gabriel Antônio', 'gabriel@email.com')
}

export function inicializarBanco() {
  const versao = db.pragma('user_version', { simple: true })

  if (versao < VERSAO_SCHEMA) migrar(versao)

  db.exec(fs.readFileSync(path.join(pastaDb, 'schema.sql'), 'utf8'))
  sincronizarTaxonomia()
  garantirUsuarioDemo()
}
