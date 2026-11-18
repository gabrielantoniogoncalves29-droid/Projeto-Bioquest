import { criarBackup } from '../src/services/backup.js'

const { arquivo, criptografado } = criarBackup()

console.log(`Backup criado em ${arquivo}${criptografado ? ' (criptografado com AES-256-GCM)' : ''}`)
