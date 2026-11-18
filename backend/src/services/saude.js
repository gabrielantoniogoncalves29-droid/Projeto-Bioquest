import fs from 'node:fs'
import path from 'node:path'
import { db } from '../db.js'
import { config } from '../config.js'
import { smtpConfigurado } from './email.js'
import { googleConfigurado } from './google.js'

const MINIMO_LIVRE_BYTES = 100 * 1024 * 1024
const AVISO_LIVRE_PERCENTUAL = 10
const BACKUP_ANTIGO_DIAS = 3

function verificarBanco() {
  try {
    db.prepare('SELECT 1').get()
    return { ok: true, versaoSchema: db.pragma('user_version', { simple: true }) }
  } catch {
    return { ok: false }
  }
}

function verificarArmazenamento() {
  const resultado = { ok: true }

  for (const pasta of [path.dirname(config.dbPath), config.uploadsDir]) {
    try {
      fs.mkdirSync(pasta, { recursive: true })
      fs.accessSync(pasta, fs.constants.W_OK)
    } catch {
      resultado.ok = false
    }
  }

  try {
    const estado = fs.statfsSync(path.dirname(config.dbPath))
    resultado.livreBytes = Number(estado.bavail) * Number(estado.bsize)
    resultado.livrePercentual = Math.round((100 * Number(estado.bavail)) / Number(estado.blocks))
    if (resultado.livreBytes < MINIMO_LIVRE_BYTES) resultado.ok = false
  } catch {
    resultado.livreBytes = null
    resultado.livrePercentual = null
  }

  return resultado
}

function verificarBackups() {
  try {
    const arquivos = fs.readdirSync(config.backupsDir)
      .filter(nome => nome.endsWith('.db') || nome.endsWith('.db.enc'))
      .map(nome => fs.statSync(path.join(config.backupsDir, nome)).mtimeMs)

    if (!arquivos.length) return { existe: false, ultimoEm: null, antigo: true }

    const ultimo = Math.max(...arquivos)

    return {
      existe: true,
      ultimoEm: new Date(ultimo).toISOString(),
      antigo: Date.now() - ultimo > BACKUP_ANTIGO_DIAS * 86400000
    }
  } catch {
    return { existe: false, ultimoEm: null, antigo: true }
  }
}

export function verificarSaude() {
  const banco = verificarBanco()
  const armazenamento = verificarArmazenamento()
  const backups = verificarBackups()
  const avisos = []

  if (armazenamento.livrePercentual !== null && armazenamento.livrePercentual < AVISO_LIVRE_PERCENTUAL) avisos.push('pouco_espaco_em_disco')
  if (backups.antigo) avisos.push('backup_ausente_ou_antigo')
  if (!smtpConfigurado()) avisos.push('email_nao_configurado')
  if (!googleConfigurado()) avisos.push('google_nao_configurado')

  return {
    ok: banco.ok && armazenamento.ok,
    banco,
    armazenamento,
    backups,
    avisos,
    uptimeSegundos: Math.round(process.uptime())
  }
}
