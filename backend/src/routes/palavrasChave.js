import { Router } from 'express'
import { sugerir } from '../services/palavrasChave.js'
import { cacheDeLeitura } from '../middleware/cache.js'

const router = Router()

router.get('/', cacheDeLeitura(60), (req, res) => {
  const limite = Math.min(Math.max(Number(req.query.limite) || 8, 1), 8)
  const termo = typeof req.query.q === 'string' ? req.query.q.slice(0, 80) : ''

  res.json(sugerir(termo, limite))
})

export default router
