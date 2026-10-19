import { config } from '../config.js'

// Cache HTTP dos GETs públicos de leitura. Em desenvolvimento fica desligado
// para que edições feitas no /admin apareçam na hora; em produção usa max-age.
export const cacheDeLeitura = segundos => (req, res, next) => {
  res.set(
    'Cache-Control',
    config.producao ? `public, max-age=${segundos}` : 'no-store'
  )
  next()
}
