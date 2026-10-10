import path from 'node:path'
import express, { Router } from 'express'
import { config } from '../config.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { uploadImagemQuestao } from '../middleware/upload.js'
import * as admin from '../services/adminQuestoes.js'
import { listarTodas } from '../services/palavrasChave.js'
import { idDaRota } from '../utils/params.js'

const router = Router()

router.use(adminAuth)

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

router.post('/api/questoes', uploadImagemQuestao.single('imagem'), (req, res) => {
  res.status(201).json(admin.criar(req.body, req.file))
})

router.put('/api/questoes/:id', uploadImagemQuestao.single('imagem'), (req, res) => {
  res.json(admin.atualizar(idDaRota(req), req.body, req.file))
})

router.delete('/api/questoes/:id', (req, res) => {
  admin.excluir(idDaRota(req))
  res.status(204).end()
})

router.use(express.static(path.join(config.raiz, 'admin')))

export default router
