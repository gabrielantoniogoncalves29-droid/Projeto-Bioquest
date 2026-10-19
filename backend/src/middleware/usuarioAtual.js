import { config } from '../config.js'

export function usuarioAtual(req, res, next) {
  req.usuarioId = config.usuarioDemoId
  next()
}
