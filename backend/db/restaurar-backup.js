import fs from 'node:fs'
import crypto from 'node:crypto'

const [origem, destino] = process.argv.slice(2)
const chaveHex = process.env.BACKUP_CHAVE || ''

if (!origem || !destino) {
  console.error('Uso: BACKUP_CHAVE=<hex> node db/restaurar-backup.js <backup.db.enc> <destino.db>')
  process.exit(1)
}

if (fs.existsSync(destino)) {
  console.error(`O destino já existe e não será sobrescrito: ${destino}`)
  process.exit(1)
}

const bruto = fs.readFileSync(origem)

if (!origem.endsWith('.enc')) {
  fs.writeFileSync(destino, bruto)
  console.log(`Backup copiado para ${destino}`)
  process.exit(0)
}

if (!/^[0-9a-f]{64}$/i.test(chaveHex)) {
  console.error('Defina BACKUP_CHAVE com 64 caracteres hexadecimais.')
  process.exit(1)
}

const decifra = crypto.createDecipheriv('aes-256-gcm', Buffer.from(chaveHex, 'hex'), bruto.subarray(0, 12))
decifra.setAuthTag(bruto.subarray(12, 28))

fs.writeFileSync(destino, Buffer.concat([decifra.update(bruto.subarray(28)), decifra.final()]), { mode: 0o600 })
console.log(`Backup restaurado em ${destino}`)
