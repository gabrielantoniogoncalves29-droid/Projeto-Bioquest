import { config } from '../config.js'

export const cacheDeLeitura = segundos => (req, res, next) => {
  const semCache = !config.producao || req.headers.authorization

  res.set('Cache-Control', semCache ? 'private, no-store' : `public, max-age=${segundos}`)
  next()
}

export function semCache(req, res, next) {
  res.set('Cache-Control', 'private, no-store')
  next()
}
