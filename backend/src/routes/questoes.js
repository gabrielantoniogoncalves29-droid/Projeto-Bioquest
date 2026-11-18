import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import * as questoes from '../services/questoes.js'
import * as comentarios from '../services/comentarios.js'
import { cacheDeLeitura, semCache } from '../middleware/cache.js'
import { exigirLogin, exigirLoginSe, loginOpcional } from '../middleware/auth.js'
import { idDaRota } from '../utils/params.js'
import { paginacaoDaQuery, paginar } from '../utils/paginacao.js'
import { criarLimite } from '../middleware/limites.js'
import { proibido, requisicaoInvalida } from '../utils/erros.js'

const router = Router()

const limitarForum = criarLimite({ nome: 'forum', janelaMs: 10 * 60 * 1000, max: config.limiteForum, tipo: 'usuario' })

const limitarCorrecao = criarLimite({ nome: 'correcao', janelaMs: 10 * 60 * 1000, max: config.limiteCorrecao })

const esquemaResposta = z.object({
  alternativa: z.enum(['A', 'B', 'C', 'D', 'E'])
})

const ESTADOS = [1, 2, 3, 4]

function listaDeInteiros(valor, nome) {
  if (valor === undefined || valor === '') return []

  if (typeof valor !== 'string') throw requisicaoInvalida(`Valor inválido em "${nome}"`)

  const itens = valor.split(',')

  if (itens.length > 60) throw requisicaoInvalida(`Valores demais em "${nome}"`)

  return itens.map(item => {
    const numero = Number(item.trim())

    if (item.trim() === '' || !Number.isInteger(numero)) throw requisicaoInvalida(`Valor inválido em "${nome}"`)

    return numero
  })
}

function filtrosDaQuery(query) {
  const estados = listaDeInteiros(query.estado, 'estado')

  if (estados.some(estado => !ESTADOS.includes(estado))) {
    throw requisicaoInvalida('Valor inválido em "estado". Use 1, 2, 3 ou 4')
  }

  if (query.q !== undefined && typeof query.q !== 'string') throw requisicaoInvalida('Valor inválido em "q"')

  return {
    anos: listaDeInteiros(query.ano, 'ano'),
    niveis: listaDeInteiros(query.nivel, 'nivel'),
    objetos: listaDeInteiros(query.objeto, 'objeto'),
    conteudos: listaDeInteiros(query.conteudo, 'conteudo'),
    subconteudos: listaDeInteiros(query.subconteudo, 'subconteudo'),
    estados,
    termo: (query.q ?? '').slice(0, 120)
  }
}

router.get('/', cacheDeLeitura(30), exigirLoginSe(req => req.query.estado), (req, res) => {
  const filtros = filtrosDaQuery(req.query)
  const paginacao = paginacaoDaQuery(req.query)
  const cards = questoes.listarCards(filtros, req.usuarioId)

  if (!paginacao) return res.json(cards)

  res.set('X-Total-Count', String(cards.length))
  res.json(paginar(cards, paginacao))
})

router.get('/ids', cacheDeLeitura(60), (req, res) => {
  res.json(questoes.listarIds())
})

router.get('/:id', cacheDeLeitura(60), (req, res) => {
  res.json(questoes.obterQuestao(idDaRota(req)))
})

router.get('/:id/explicacao', semCache, loginOpcional, (req, res) => {
  res.json(questoes.obterExplicacao(idDaRota(req), req.usuarioId ?? null))
})

router.post('/:id/corrigir', semCache, limitarCorrecao, (req, res) => {
  const resultado = esquemaResposta.safeParse(req.body ?? {})

  if (!resultado.success) throw requisicaoInvalida('Alternativa inválida')

  res.json(questoes.corrigirSemConta(idDaRota(req), resultado.data.alternativa))
})

router.get('/:id/comentarios', semCache, (req, res) => {
  res.json(comentarios.listar(idDaRota(req)))
})

router.use(semCache, exigirLogin)

router.get('/:id/minha-resposta', (req, res) => {
  res.json(questoes.respostaDoUsuario(req.usuarioId, idDaRota(req)))
})

router.post('/:id/resposta', (req, res) => {
  const resultado = esquemaResposta.safeParse(req.body ?? {})

  if (!resultado.success) throw requisicaoInvalida('Alternativa inválida')

  res.json(questoes.responder(req.usuarioId, idDaRota(req), resultado.data.alternativa))
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

router.post('/:id/comentarios', limitarForum, (req, res) => {
  if (!config.forumAberto) throw proibido('O fórum está fechado no momento')

  res.status(201).json(comentarios.criar(req.usuarioId, idDaRota(req), req.body?.texto))
})

export default router
