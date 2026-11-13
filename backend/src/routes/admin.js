import path from 'node:path'
import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { uploadImagensDaQuestao, conferirImagem } from '../middleware/upload.js'
import * as admin from '../services/adminQuestoes.js'
import { listarTodas } from '../services/palavrasChave.js'
import { exportarQuestao, exportarTodas, removerArquivosDaQuestao } from '../services/arquivosQuestoes.js'
import { idDaRota } from '../utils/params.js'
import { criarLimite } from '../middleware/limites.js'
import { registrarInfo, registrarAviso, contextoDaRequisicao } from '../utils/log.js'

const router = Router()

const limitarAdmin = criarLimite({ nome: 'admin', janelaMs: 15 * 60 * 1000, max: config.limiteAdmin })

const limitarFalhasAdmin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas. Tente novamente em alguns minutos.' }
})

router.use(limitarAdmin, limitarFalhasAdmin, adminAuth)

router.use((req, res, next) => {
  if (req.method !== 'GET') {
    res.on('finish', () => registrarInfo('admin_acao', { ...contextoDaRequisicao(req), status: res.statusCode }))
  }

  next()
})

router.use((req, res, next) => {
  const origem = req.headers.origin

  if (req.method !== 'GET' && origem && new URL(origem).host !== req.headers.host) {
    registrarAviso('admin_origem_negada', { ...contextoDaRequisicao(req), origem })
    return res.status(403).json({ erro: 'Origem não permitida' })
  }

  next()
})

router.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.get('/api/taxonomia', (req, res) => {
  res.json(admin.taxonomia())
})

router.get('/api/palavras-chave', (req, res) => {
  res.json(listarTodas())
})

router.get('/api/questoes', (req, res) => {
  res.json(admin.listarAdmin())
})

router.get('/api/questoes/:id', (req, res) => {
  res.json(admin.obterAdmin(idDaRota(req)))
})

function comExportacao(salva) {
  if (!config.exportarQuestoes) return salva

  try {
    return { ...salva, arquivo: exportarQuestao(salva.id) }
  } catch (erro) {
    return { ...salva, avisos: [...(salva.avisos ?? []), `Salva no banco, mas não foi possível exportar o arquivo: ${erro.message}`] }
  }
}

router.post('/api/questoes', uploadImagensDaQuestao, conferirImagem, (req, res) => {
  res.status(201).json(comExportacao(admin.criar(req.body, req.files ?? {})))
})

router.put('/api/questoes/:id', uploadImagensDaQuestao, conferirImagem, (req, res) => {
  res.json(comExportacao(admin.atualizar(idDaRota(req), req.body, req.files ?? {})))
})

router.delete('/api/questoes/:id', (req, res) => {
  const id = idDaRota(req)

  admin.excluir(id)
  if (config.exportarQuestoes) removerArquivosDaQuestao(id)
  res.status(204).end()
})

router.post('/api/exportar', (req, res) => {
  res.json(exportarTodas())
})

router.use(express.static(path.join(config.raiz, 'admin')))

export default router
