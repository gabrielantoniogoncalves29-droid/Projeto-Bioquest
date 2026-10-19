import { config } from '../config.js'
export const cacheDeLeitura = segundos => (req, res, next) => {
  res.set(
    'Cache-Control',
    config.producao ? `public, max-age=${segundos}` : 'no-store'
  )
  next()
}
