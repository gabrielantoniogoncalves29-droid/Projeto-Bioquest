import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { config } from '../config.js'
import { db } from '../db.js'

const PREFIXO = 'bioquest-auto-'

export function criarBackup() {
  const chaveHex = process.env.BACKUP_CHAVE || ''
  const manter = Number(process.env.BACKUP_MANTER) || 14

  if (chaveHex && !/^[0-9a-f]{64}$/i.test(chaveHex)) {
    throw new Error('BACKUP_CHAVE deve ter 64 caracteres hexadecimais (32 bytes).')
  }

  fs.mkdirSync(config.backupsDir, { recursive: true })

  const copia = path.join(config.backupsDir, `${PREFIXO}${new Date().toISOString().replace(/[:.]/g, '-')}.db`)

  db.exec(`VACUUM INTO '${copia.replace(/'/g, "''")}'`)

  let final = copia

  if (chaveHex) {
    const iv = crypto.randomBytes(12)
    const cifra = crypto.createCipheriv('aes-256-gcm', Buffer.from(chaveHex, 'hex'), iv)
    const conteudo = Buffer.concat([cifra.update(fs.readFileSync(copia)), cifra.final()])

    final = `${copia}.enc`
    fs.writeFileSync(final, Buffer.concat([iv, cifra.getAuthTag(), conteudo]), { mode: 0o600 })
    fs.rmSync(copia, { force: true })
  }

  fs.readdirSync(config.backupsDir)
    .filter(nome => nome.startsWith(PREFIXO))
    .map(nome => ({ nome, quando: fs.statSync(path.join(config.backupsDir, nome)).mtimeMs }))
    .sort((a, b) => b.quando - a.quando)
    .slice(manter)
    .forEach(({ nome }) => fs.rmSync(path.join(config.backupsDir, nome), { force: true }))

  return { arquivo: final, criptografado: Boolean(chaveHex) }
}
