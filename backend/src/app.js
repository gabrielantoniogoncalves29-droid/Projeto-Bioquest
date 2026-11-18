import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config.js'
import { erroHandler, naoEncontradoHandler } from './middleware/erros.js'
import questoesRouter from './routes/questoes.js'
import palavrasChaveRouter from './routes/palavrasChave.js'
import perfilRouter from './routes/perfil.js'
import authRouter from './routes/auth.js'
import estatisticasRouter from './routes/estatisticas.js'
import catalogoRouter from './routes/catalogo.js'
import adminRouter from './routes/admin.js'
import { verificarSaude } from './services/saude.js'

export function criarApp() {
  const app = express()

  app.disable('x-powered-by')

  if (config.producao) app.set('trust proxy', config.proxyConfiavel)

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: { 'img-src': ["'self'", 'data:', 'https:'] }
    }
  }))

  app.use(cors({
    origin(origem, cb) {
      cb(null, !origem || config.frontendUrls.includes(origem))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['X-Total-Count', 'RateLimit', 'RateLimit-Policy', 'Retry-After'],
    maxAge: 600
  }))

  app.use(express.json({ limit: '100kb' }))

  app.get('/api/saude', (req, res) => {
    const saude = verificarSaude()
    const detalhado = config.saudeToken && req.headers['x-saude-token'] === config.saudeToken

    res.set('Cache-Control', 'no-store')
    res.status(saude.ok ? 200 : 503).json(detalhado ? saude : { ok: saude.ok })
  })

  app.use(
    '/uploads',
    express.static(config.uploadsDir, { maxAge: '30d', immutable: true, index: false })
  )

  app.use('/api', catalogoRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/questoes', questoesRouter)
  app.use('/api/palavras-chave', palavrasChaveRouter)
  app.use('/api/perfil', perfilRouter)
  app.use('/api/estatisticas', estatisticasRouter)

  app.use('/admin', adminRouter)

  app.use(naoEncontradoHandler)
  app.use(erroHandler)

  return app
}
