import jwt from 'jsonwebtoken'
import { db } from '../db.js'
import { config } from '../config.js'
import { naoAutorizado } from '../utils/erros.js'

export function emitirToken(usuarioId) {
  return jwt.sign({ sub: String(usuarioId) }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiraEm
  })
}

function lerToken(req) {
  const [tipo, token] = (req.headers.authorization || '').split(' ')
  return tipo === 'Bearer' && token ? token : null
}

export function exigirLogin(req, res, next) {
  const token = lerToken(req)

  if (!token) return next(naoAutorizado('Faça login para continuar'))

  let dados

  try {
    dados = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] })
  } catch (erro) {
    const expirou = erro?.name === 'TokenExpiredError'
    return next(naoAutorizado(expirou ? 'Sua sessão expirou. Entre novamente.' : 'Sessão inválida', 'sessao_invalida'))
  }

  const usuario = db.prepare('SELECT id, tokens_validos_desde AS desde FROM usuarios WHERE id = ?').get(Number(dados.sub))

  if (!usuario || dados.iat < usuario.desde) {
    return next(naoAutorizado('Sessão inválida', 'sessao_invalida'))
  }

  req.usuarioId = usuario.id
  req.tokenEmitidoEm = dados.iat
  next()
}

export function loginOpcional(req, res, next) {
  if (!lerToken(req)) return next()

  exigirLogin(req, res, () => next())
}

export function exigirLoginSe(condicao) {
  return (req, res, next) => (condicao(req) ? exigirLogin(req, res, next) : next())
}
