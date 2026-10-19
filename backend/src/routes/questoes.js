import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import * as questoes from '../services/questoes.js'
import * as comentarios from '../services/comentarios.js'
import { cacheDeLeitura } from '../middleware/cache.js'
import { idDaRota } from '../utils/params.js'
import { naoAutorizado, requisicaoInvalida } from '../utils/erros.js'
import { ORDENS } from '../utils/filtrarQuestoes.js'

const router = Router()

const esquemaResposta = z.object({
  alternativa: z.enum(['A', 'B', 'C', 'D', 'E'])
})

// "2014,2015" -> [2014, 2015]. Vários valores separados por vírgula; vazio = sem filtro.
function listaDeInteiros(valor, nome) {
  if (valor === undefined || valor === '') return []

  return String(valor).split(',').map(item => {
    const numero = Number(item.trim())

    if (!Number.isInteger(numero)) throw requisicaoInvalida(`Valor inválido em "${nome}"`)

    return numero
  })
}

// Query: ?ano=&nivel=&objeto=&conteudo=&subconteudo=&estado=&q=&ordem=
// (ids separados por vírgula; mesma regra do filtro do front).
function filtrosDaQuery(query) {
  const ordem = query.ordem === undefined || query.ordem === '' ? undefined : String(query.ordem)

  if (ordem !== undefined && !ORDENS.includes(ordem)) {
    throw requisicaoInvalida(`Ordenação inválida. Use: ${ORDENS.join(', ')}`)
  }

  return {
    anos: listaDeInteiros(query.ano, 'ano'),
    niveis: listaDeInteiros(query.nivel, 'nivel'),
    objetos: listaDeInteiros(query.objeto, 'objeto'),
    conteudos: listaDeInteiros(query.conteudo, 'conteudo'),
    subconteudos: listaDeInteiros(query.subconteudo, 'subconteudo'),
    estados: listaDeInteiros(query.estado, 'estado'),
    termo: typeof query.q === 'string' ? query.q.slice(0, 120) : '',
    ordem
  }
}

router.get('/', cacheDeLeitura(30), (req, res) => {
  res.json(questoes.listarCards(filtrosDaQuery(req.query), req.usuarioId))
})

// O resultado depende do usuário quando há "estado"; sem cache compartilhado.
router.get('/ids', (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json(questoes.listarIds(filtrosDaQuery(req.query), req.usuarioId))
})

router.get('/:id', cacheDeLeitura(60), (req, res) => {
  res.json(questoes.obterQuestao(idDaRota(req)))
})

router.get('/:id/explicacao', cacheDeLeitura(60), (req, res) => {
  res.json(questoes.obterExplicacao(idDaRota(req)))
})

router.get('/:id/minha-resposta', (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json(questoes.respostaDoUsuario(req.usuarioId, idDaRota(req)))
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
  res.set('Cache-Control', 'no-store')
  res.json(comentarios.listar(idDaRota(req)))
})

// Comentar exige login (ainda não existe). O login futuro liga config.forumAberto
// (FORUM_ABERTO=true) e troca usuarioAtual por um middleware que autentica de verdade.
router.post('/:id/comentarios', (req, res) => {
  if (!config.forumAberto) throw naoAutorizado('Faça login para comentar')

  const criado = comentarios.criar(req.usuarioId, idDaRota(req), req.body?.texto)
  res.status(201).json(criado)
})

export default router
