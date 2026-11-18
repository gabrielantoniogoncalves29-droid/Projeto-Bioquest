import { Router } from 'express'
import { calcularEstatisticas } from '../services/estatisticas.js'
import { exigirLogin } from '../middleware/auth.js'
import { semCache } from '../middleware/cache.js'
import { requisicaoInvalida } from '../utils/erros.js'

const router = Router()

router.use(semCache, exigirLogin)

router.get('/', (req, res) => {
  const { mes } = req.query

  if (mes !== undefined && !(typeof mes === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(mes))) {
    throw requisicaoInvalida('Mês inválido. Use o formato AAAA-MM')
  }

  res.json(calcularEstatisticas(req.usuarioId, { mes }))
})

export default router
