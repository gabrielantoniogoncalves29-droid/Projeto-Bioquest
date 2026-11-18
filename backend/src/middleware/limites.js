import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { registrarAviso, resumirIdentificador, contextoDaRequisicao } from '../utils/log.js'

const mensagem = { erro: 'Muitas tentativas. Tente novamente em alguns minutos.' }

function chaveDe(tipo) {
  if (tipo === 'usuario') {
    return req => (req.usuarioId ? `u:${req.usuarioId}` : ipKeyGenerator(req.ip))
  }

  if (tipo === 'ip-email') {
    return req => `${ipKeyGenerator(req.ip)}|${resumirIdentificador(req.body?.email) ?? '-'}`
  }

  return req => ipKeyGenerator(req.ip)
}

export function criarLimite({ nome, janelaMs, max, tipo = 'ip' }) {
  return rateLimit({
    windowMs: janelaMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: chaveDe(tipo),
    handler(req, res) {
      registrarAviso('rate_limit', { limite: nome, ...contextoDaRequisicao(req) })
      res.status(429).json(mensagem)
    }
  })
}
