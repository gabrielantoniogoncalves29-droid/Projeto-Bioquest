import { Router } from 'express'
import * as perfil from '../services/perfil.js'
import { uploadFotoPerfil } from '../middleware/upload.js'
import { requisicaoInvalida } from '../utils/erros.js'

const router = Router()

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.get('/', (req, res) => {
  res.json(perfil.obterPerfil(req.usuarioId))
})

router.patch('/', (req, res) => {
  res.json(perfil.atualizarPerfil(req.usuarioId, req.body ?? {}))
})

router.post('/foto', uploadFotoPerfil.single('foto'), (req, res) => {
  if (!req.file) throw requisicaoInvalida('Envie uma imagem JPG, PNG ou WebP')

  res.json(perfil.salvarFoto(req.usuarioId, req.file.filename))
})

router.delete('/', (req, res) => {
  perfil.excluirDados(req.usuarioId)
  res.status(204).end()
})

export default router
