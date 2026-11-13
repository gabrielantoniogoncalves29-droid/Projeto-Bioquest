import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { exigirLogin } from '../middleware/auth.js'
import { semCache } from '../middleware/cache.js'
import * as auth from '../services/auth.js'
import { criarLimite } from '../middleware/limites.js'
import { registrarInfo, registrarAviso, resumirIdentificador } from '../utils/log.js'

const router = Router()

const mensagemLimite = { erro: 'Muitas tentativas. Tente novamente em alguns minutos.' }

const limitarAuth = rateLimit({
  windowMs: 15 * 60 * 1000, limit: config.limiteAuth, standardHeaders: 'draft-7', legacyHeaders: false, message: mensagemLimite
})

const limitarEmail = rateLimit({
  windowMs: 60 * 60 * 1000, limit: config.limiteEmail, standardHeaders: 'draft-7', legacyHeaders: false, message: mensagemLimite
})

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.limiteLogin,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: mensagemLimite
})

const limitarConta = criarLimite({ nome: 'conta', janelaMs: 60 * 60 * 1000, max: config.limiteConta, tipo: 'usuario' })

router.use(semCache, limitarAuth)

router.post('/cadastro', limitarEmail, async (req, res) => {
  res.status(201).json(await auth.cadastrar(req.body))
})

router.post('/login', limitarLogin, async (req, res) => {
  try {
    res.json(await auth.entrar(req.body))
    registrarInfo('login_ok', { ip: req.ip, referencia: resumirIdentificador(req.body?.email) })
  } catch (erro) {
    registrarAviso('login_falha', { ip: req.ip, referencia: resumirIdentificador(req.body?.email), status: erro.status, codigo: erro.codigo })
    throw erro
  }
})

router.post('/google', async (req, res) => {
  try {
    res.json(await auth.entrarComGoogle(req.body))
    registrarInfo('login_google_ok', { ip: req.ip })
  } catch (erro) {
    registrarAviso('login_google_falha', { ip: req.ip, status: erro.status })
    throw erro
  }
})

router.post('/confirmar-email', async (req, res) => {
  res.json(auth.confirmarEmail(req.body))
})

router.post('/reenviar-confirmacao', limitarEmail, async (req, res) => {
  await auth.reenviarConfirmacao(req.body)
  res.status(202).json({ mensagem: 'Se houver uma conta pendente com este e-mail, enviamos um novo link.' })
})

router.post('/recuperar-senha', limitarEmail, async (req, res) => {
  await auth.solicitarRecuperacao(req.body)
  res.status(202).json({ mensagem: 'Se existir uma conta com este e-mail, enviamos o link de redefinição.' })
})

router.post('/redefinir-senha', async (req, res) => {
  await auth.redefinirSenha(req.body)
  registrarInfo('senha_redefinida', { ip: req.ip })
  res.json({ mensagem: 'Senha redefinida. Entre com a nova senha.' })
})

router.get('/me', exigirLogin, (req, res) => {
  res.json(auth.usuarioPublico(req.usuarioId))
})

router.post('/renovar', exigirLogin, (req, res) => {
  res.json(auth.renovarSessao(req.usuarioId))
})

router.post('/alterar-senha', exigirLogin, limitarConta, async (req, res) => {
  res.json(await auth.alterarSenha(req.usuarioId, req.body))
  registrarInfo('senha_alterada', { usuarioId: req.usuarioId, ip: req.ip })
})

router.post('/google/vincular', exigirLogin, limitarConta, async (req, res) => {
  res.json(await auth.vincularGoogle(req.usuarioId, req.body))
})

router.post('/logout', exigirLogin, (req, res) => {
  res.status(204).end()
})

export default router
