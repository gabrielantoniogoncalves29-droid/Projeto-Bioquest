import { Router } from 'express'
import { sugerir } from '../services/palavrasChave.js'

const router = Router()

router.get('/', (req, res) => {
  const limite = Math.min(Math.max(Number(req.query.limite) || 6, 1), 20)
  const termo = typeof req.query.q === 'string' ? req.query.q.slice(0, 80) : ''

  res.set('Cache-Control', 'public, max-age=60')
  res.json(sugerir(termo, limite))
})

export default router
