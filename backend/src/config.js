import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

dotenv.config({ path: path.join(raiz, '.env'), quiet: true })

const ambiente = process.env.NODE_ENV || 'development'
const producao = ambiente === 'production'

function lista(valor) {
  return (valor || '')
    .split(',')
    .map(item => item.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

function origemDe(url) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

function segredoJwt() {
  const segredo = process.env.JWT_SECRET || ''

  if (producao && segredo.length < 32) {
    throw new Error('Defina JWT_SECRET com pelo menos 32 caracteres em produção.')
  }

  if (!segredo) {
    console.warn('JWT_SECRET não definido: usando um segredo temporário (os logins caem ao reiniciar).')
    return crypto.randomBytes(48).toString('hex')
  }

  return segredo
}

function adminHabilitado() {
  const quer = process.env.ADMIN_ATIVO ? process.env.ADMIN_ATIVO === 'true' : !producao
  const senha = process.env.ADMIN_SENHA || ''

  if (!quer) return false

  if (!senha) {
    console.warn('ADMIN_SENHA não definida: o painel administrativo ficará desligado.')
    return false
  }

  if (producao && senha.length < 12) {
    console.warn('ADMIN_SENHA tem menos de 12 caracteres: o painel ficará desligado em produção.')
    return false
  }

  return true
}

const dbPath = path.resolve(raiz, process.env.DB_PATH || 'data/bioquest.db')

const frontendUrls = lista(process.env.FRONTEND_URL || 'http://localhost:5173')

function exigirHttpsEmProducao(frontendUrls, appUrl) {
  if (!producao) return

  const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
  const inseguras = [...frontendUrls.map(origemDe), origemDe(appUrl)].filter(url => !url.startsWith('https://') && !local.test(url))

  if (inseguras.length) {
    throw new Error(`Em produção, FRONTEND_URL e APP_URL devem usar HTTPS. Endereços recusados: ${inseguras.join(', ')}`)
  }
}

const appUrl = (process.env.APP_URL || 'http://localhost:5173/Projeto-Bioquest').replace(/\/+$/, '')

exigirHttpsEmProducao(frontendUrls, appUrl)

export const config = {
  raiz,
  ambiente,
  producao,
  porta: Number(process.env.PORT) || 3000,
  dbPath,
  uploadsDir: path.resolve(raiz, process.env.UPLOADS_DIR || 'uploads'),
  logsDir: path.resolve(raiz, process.env.LOGS_DIR || path.join(path.dirname(dbPath), 'logs')),
  backupsDir: path.resolve(raiz, process.env.BACKUPS_DIR || path.join(path.dirname(dbPath), 'backups')),
  proxyConfiavel: Number(process.env.TRUST_PROXY ?? 1),
  saudeToken: process.env.SAUDE_TOKEN || '',
  alertaWebhookUrl: process.env.ALERTA_WEBHOOK_URL || '',

  frontendUrls: frontendUrls.map(origemDe),
  appUrl,

  adminAtivo: adminHabilitado(),
  adminSenha: process.env.ADMIN_SENHA || '',
  exportarQuestoes: process.env.EXPORTAR_QUESTOES
    ? process.env.EXPORTAR_QUESTOES === 'true'
    : !producao,
  pastaQuestoes: path.resolve(raiz, process.env.PASTA_QUESTOES || path.join('db', 'questoes')),
  pastaImagens: path.resolve(raiz, process.env.PASTA_IMAGENS || path.join('db', 'imagens')),
  forumAberto: process.env.FORUM_ABERTO === 'true',
  taxaAcertoAtiva: false,
  minRespostasParaTaxa: 20,

  jwtSecret: segredoJwt(),
  jwtExpiraEm: process.env.JWT_EXPIRA_EM || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  reautenticacaoSegundos: 5 * 60,
  limiteAuth: Number(process.env.RATE_LIMIT_AUTH_MAX) || 30,
  limiteEmail: Number(process.env.RATE_LIMIT_EMAIL_MAX) || 5,
  limiteLogin: Number(process.env.RATE_LIMIT_LOGIN_MAX) || 10,
  limiteConta: Number(process.env.RATE_LIMIT_CONTA_MAX) || 20,
  limiteForum: Number(process.env.RATE_LIMIT_FORUM_MAX) || 10,
  limiteCorrecao: Number(process.env.RATE_LIMIT_CORRECAO_MAX) || 120,
  limiteUpload: Number(process.env.RATE_LIMIT_UPLOAD_MAX) || 20,
  limiteAdmin: Number(process.env.RATE_LIMIT_ADMIN_MAX) || 300,

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || ''
  },

  fusoEstatisticas: 'America/Sao_Paulo'
}
