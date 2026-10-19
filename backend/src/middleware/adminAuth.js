import crypto from 'node:crypto'
import { config } from '../config.js'

function iguais(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function adminAuth(req, res, next) {
  if (!config.adminAtivo) {
    return res.status(404).json({ erro: 'Rota não encontrada' })
  }

  if (!config.adminSenha) return next()

  const cabecalho = req.headers.authorization || ''
  const [tipo, credencial] = cabecalho.split(' ')

  if (tipo === 'Basic' && credencial) {
    const texto = Buffer.from(credencial, 'base64').toString('utf8')
    const senha = texto.slice(texto.indexOf(':') + 1)
    if (iguais(senha, config.adminSenha)) return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="BioQuest Admin", charset="UTF-8"')
  res.status(401).send('Autenticação necessária')
}
