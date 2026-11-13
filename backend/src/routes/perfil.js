import { Router } from 'express'
import * as perfil from '../services/perfil.js'
import { exigirLogin } from '../middleware/auth.js'
import { semCache } from '../middleware/cache.js'
import { uploadFotoPerfil, conferirImagem } from '../middleware/upload.js'
import { requisicaoInvalida } from '../utils/erros.js'
import { config } from '../config.js'
import { criarLimite } from '../middleware/limites.js'
import { registrarInfo } from '../utils/log.js'

const router = Router()

const limitarConta = criarLimite({ nome: 'conta', janelaMs: 60 * 60 * 1000, max: config.limiteConta, tipo: 'usuario' })
const limitarUpload = criarLimite({ nome: 'upload', janelaMs: 60 * 60 * 1000, max: config.limiteUpload, tipo: 'usuario' })

router.use(semCache, exigirLogin)

router.use((req, res, next) => (req.method === 'GET' ? next() : limitarConta(req, res, next)))

router.get('/', (req, res) => {
  res.json(perfil.obterPerfil(req.usuarioId))
})

router.patch('/', (req, res) => {
  res.json(perfil.atualizarNome(req.usuarioId, req.body))
})

router.post('/email', async (req, res) => {
  await perfil.solicitarNovoEmail(req.usuarioId, req.tokenEmitidoEm, req.body)
  registrarInfo('troca_email_solicitada', { usuarioId: req.usuarioId, ip: req.ip })
  res.status(202).json({ mensagem: 'Enviamos um link de confirmação para o novo e-mail. Ele só passa a valer depois de confirmado.' })
})

router.post('/foto', limitarUpload, uploadFotoPerfil.single('foto'), conferirImagem, (req, res) => {
  if (!req.file) throw requisicaoInvalida('Envie uma imagem JPG, PNG ou WebP')

  res.json(perfil.salvarFoto(req.usuarioId, req.file.filename))
})

router.delete('/respostas', (req, res) => {
  perfil.limparRespostas(req.usuarioId)
  res.status(204).end()
})

router.delete('/salvas', (req, res) => {
  perfil.limparSalvas(req.usuarioId)
  res.status(204).end()
})

router.delete('/revisar', (req, res) => {
  perfil.limparRevisar(req.usuarioId)
  res.status(204).end()
})

router.delete('/', async (req, res) => {
  await perfil.excluirConta(req.usuarioId, req.tokenEmitidoEm, req.body)
  registrarInfo('conta_excluida', { usuarioId: req.usuarioId, ip: req.ip })
  res.status(204).end()
})

export default router
