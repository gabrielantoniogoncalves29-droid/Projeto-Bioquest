import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config.js'
import { usuarioAtual } from './middleware/usuarioAtual.js'
import { erroHandler, naoEncontradoHandler } from './middleware/erros.js'
import questoesRouter from './routes/questoes.js'
import palavrasChaveRouter from './routes/palavrasChave.js'
import perfilRouter from './routes/perfil.js'
import adminRouter from './routes/admin.js'

export function criarApp() {
  const app = express()

  app.disable('x-powered-by')

  if (config.producao) app.set('trust proxy', 1)

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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }))

  app.use(express.json({ limit: '100kb' }))

  app.get('/api/saude', (req, res) => {
    res.json({ ok: true })
  })

  app.use(
    '/uploads',
    express.static(config.uploadsDir, { maxAge: '30d', immutable: true, index: false })
  )

  app.use('/api', usuarioAtual)
  app.use('/api/questoes', questoesRouter)
  app.use('/api/palavras-chave', palavrasChaveRouter)
  app.use('/api/perfil', perfilRouter)

  app.use('/admin', adminRouter)

  app.use(naoEncontradoHandler)
  app.use(erroHandler)

  return app
}
