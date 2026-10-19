import { Router } from 'express'
import { config } from '../config.js'
import { obterTaxonomia } from '../services/taxonomia.js'
import { cacheDeLeitura } from '../middleware/cache.js'

const router = Router()

router.get('/taxonomia', cacheDeLeitura(60), (req, res) => {
  res.json(obterTaxonomia())
})

router.get('/config', (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json({ forumAberto: config.forumAberto, taxaAcertoAtiva: config.taxaAcertoAtiva })
})

export default router
