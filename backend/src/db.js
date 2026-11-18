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

const VERSAO_SCHEMA = 3

function colunaExiste(tabela, coluna) {
  return db.prepare(`PRAGMA table_info(${tabela})`).all().some(c => c.name === coluna)
}

function adicionarColuna(tabela, coluna, definicao) {
  if (!colunaExiste(tabela, coluna)) {
    db.exec(`ALTER TABLE ${tabela} ADD COLUMN ${coluna} ${definicao}`)
  }
}

const migracoes = {
  1() {},

  2() {
    adicionarColuna('usuarios', 'senha_hash', 'TEXT')
    adicionarColuna('usuarios', 'email_confirmado', 'INTEGER NOT NULL DEFAULT 0')
    adicionarColuna('usuarios', 'google_sub', 'TEXT')
    adicionarColuna('usuarios', 'tokens_validos_desde', 'INTEGER NOT NULL DEFAULT 0')

    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_google_sub
        ON usuarios(google_sub) WHERE google_sub IS NOT NULL
    `)

    db.exec(`
      INSERT INTO tentativas (usuario_id, questao_id, alternativa, correta, respondida_em, origem)
      SELECT r.usuario_id, r.questao_id, r.alternativa, r.correta, r.atualizado_em, 'migracao'
        FROM respostas r
       WHERE NOT EXISTS (
         SELECT 1 FROM tentativas t
          WHERE t.usuario_id = r.usuario_id AND t.questao_id = r.questao_id
       )
    `)
  },

  3() {
    adicionarColuna('alternativas', 'imagem', "TEXT NOT NULL DEFAULT ''")
  }
}

function bancoJaTemDados() {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'usuarios'").get()
  )
}

function fazerBackup(versaoAtual) {
  const pasta = config.backupsDir
  fs.mkdirSync(pasta, { recursive: true })

  const carimbo = new Date().toISOString().replace(/[:.]/g, '-')
  const destino = path.join(pasta, `bioquest-v${versaoAtual}-antes-da-v${VERSAO_SCHEMA}-${carimbo}.db`)

  db.exec(`VACUUM INTO '${destino.replace(/'/g, "''")}'`)
  console.log(`Backup do banco criado em ${destino}`)
}

function migrar(versaoAtual) {
  for (let versao = versaoAtual + 1; versao <= VERSAO_SCHEMA; versao++) {
    db.transaction(() => {
      migracoes[versao]()
      db.pragma(`user_version = ${versao}`)
    })()
  }
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

export function inicializarBanco() {
  const versao = db.pragma('user_version', { simple: true })

  if (versao < VERSAO_SCHEMA && bancoJaTemDados()) fazerBackup(versao)

  db.exec(fs.readFileSync(path.join(pastaDb, 'schema.sql'), 'utf8'))

  if (versao < VERSAO_SCHEMA) migrar(versao)

  sincronizarTaxonomia()
}
