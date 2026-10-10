import { Router } from 'express'
import { z } from 'zod'
import * as questoes from '../services/questoes.js'
import * as comentarios from '../services/comentarios.js'
import { idDaRota } from '../utils/params.js'
import { requisicaoInvalida } from '../utils/erros.js'

const router = Router()

const cachePublico = segundos => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${segundos}`)
  next()
}

const esquemaResposta = z.object({
  alternativa: z.enum(['A', 'B', 'C', 'D', 'E'])
})

router.get('/', cachePublico(30), (req, res) => {
  res.json(questoes.listarCards())
})

router.get('/ids', cachePublico(30), (req, res) => {
  res.json(questoes.listarIds())
})

router.get('/:id', cachePublico(60), (req, res) => {
  res.json(questoes.obterQuestao(idDaRota(req)))
})

router.get('/:id/explicacao', cachePublico(60), (req, res) => {
  res.json(questoes.obterExplicacao(idDaRota(req)))
})

router.post('/:id/resposta', (req, res) => {
  const resultado = esquemaResposta.safeParse(req.body ?? {})

  if (!resultado.success) throw requisicaoInvalida('Alternativa inválida')

  res.json(
    questoes.responder(req.usuarioId, idDaRota(req), resultado.data.alternativa)
  )
})

router.put('/:id/salvar', (req, res) => {
  questoes.salvas.adicionar(req.usuarioId, idDaRota(req))
  res.status(204).end()
})

router.delete('/:id/salvar', (req, res) => {
  questoes.salvas.remover(req.usuarioId, idDaRota(req))
  res.status(204).end()
})

router.put('/:id/revisar', (req, res) => {
  questoes.revisar.adicionar(req.usuarioId, idDaRota(req))
  res.status(204).end()
})

router.delete('/:id/revisar', (req, res) => {
  questoes.revisar.remover(req.usuarioId, idDaRota(req))
  res.status(204).end()
})

router.get('/:id/comentarios', (req, res) => {
  res.json(comentarios.listar(idDaRota(req)))
})

router.post('/:id/comentarios', (req, res) => {
  const criado = comentarios.criar(req.usuarioId, idDaRota(req), req.body?.texto)
  res.status(201).json(criado)
})

export default router
