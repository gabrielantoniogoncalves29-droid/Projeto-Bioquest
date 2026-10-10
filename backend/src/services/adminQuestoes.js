import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { db } from '../db.js'
import { config } from '../config.js'
import { definirPalavrasDaQuestao, palavrasDaQuestao } from './palavrasChave.js'
import { conflito, naoEncontrado, requisicaoInvalida } from '../utils/erros.js'
import { listaDeTexto, resumirTexto } from '../utils/texto.js'

const LETRAS = ['A', 'B', 'C', 'D', 'E']
const PRIMEIRO_CODIGO = 202591

const inteiro = (min, max) => z.coerce.number().int().min(min).max(max)

const esquema = z.object({
  id: inteiro(1, 999999999).optional(),
  ano: inteiro(1990, 2100),
  banca: z.string().trim().min(1).max(40).default('Enem'),
  prova: z.string().trim().max(60).default(''),
  numeroQuestao: inteiro(1, 999).optional(),
  nivelId: inteiro(1, 3),
  conteudoId: inteiro(1, 9999),
  subconteudoId: inteiro(1, 999999),
  objetoId: inteiro(1, 6).optional(),
  resumo: z.string().trim().max(600).default(''),
  enunciadoTexto: z.string().trim().min(1, 'Informe o enunciado da questão'),
  enunciadoComplemento: z.string().trim().default(''),
  imagemAlt: z.string().trim().max(300).default(''),
  imagemUrl: z.string().trim().regex(/^https?:\/\//i, 'A URL da imagem deve começar com http:// ou https://').optional(),
  resposta: z.enum(LETRAS, 'Escolha a alternativa correta'),
  comentario: z.string().trim().default(''),
  teoria: z.string().default(''),
  palavrasChave: z.string().default(''),
  taxaAcerto: inteiro(0, 100).default(0)
})

function validar(corpo) {
  const limpo = {}

  for (const [chave, valor] of Object.entries(corpo ?? {})) {
    if (valor !== '' && valor !== undefined && valor !== null) limpo[chave] = valor
  }

  const resultado = esquema.safeParse(limpo)

  if (!resultado.success) {
    throw requisicaoInvalida(
      resultado.error.issues[0].message,
      resultado.error.issues.map(i => ({ campo: i.path.join('.'), mensagem: i.message }))
    )
  }

  const dados = resultado.data

  const alternativas = LETRAS
    .map(letra => ({ letra, texto: String(corpo[`alternativa${letra}`] ?? '').trim() }))
    .filter(alt => alt.texto)

  if (alternativas.length < 2) {
    throw requisicaoInvalida('Preencha pelo menos duas alternativas')
  }

  if (!alternativas.some(alt => alt.letra === dados.resposta)) {
    throw requisicaoInvalida('A alternativa correta precisa estar preenchida')
  }

  const sub = db.prepare(`
    SELECT s.conteudo_id AS conteudoId, c.eixo_id AS eixoId
      FROM subconteudos s JOIN conteudos c ON c.id = s.conteudo_id
     WHERE s.id = ?
  `).get(dados.subconteudoId)

  if (!sub || sub.conteudoId !== dados.conteudoId) {
    throw requisicaoInvalida('O subconteúdo não pertence ao conteúdo escolhido')
  }

  return {
    ...dados,
    objetoId: dados.objetoId ?? sub.eixoId,
    resumo: dados.resumo || resumirTexto(dados.enunciadoTexto),
    alternativas,
    teoria: listaDeTexto(dados.teoria, /\r?\n/),
    palavrasChave: listaDeTexto(dados.palavrasChave, /[,\n;]/)
  }
}

function removerArquivoDaImagem(imagem) {
  if (!imagem || !imagem.startsWith('/uploads/questoes/')) return

  fs.rmSync(
    path.join(config.uploadsDir, 'questoes', path.basename(imagem)),
    { force: true }
  )
}

function gravarAlternativas(questaoId, alternativas) {
  db.prepare('DELETE FROM alternativas WHERE questao_id = ?').run(questaoId)

  const inserir = db.prepare(`
    INSERT INTO alternativas (questao_id, letra, texto) VALUES (?, ?, ?)
  `)

  alternativas.forEach(alt => inserir.run(questaoId, alt.letra, alt.texto))
}

export function taxonomia() {
  const niveis = db.prepare('SELECT id, nome, dificuldade FROM niveis ORDER BY id').all()
  const eixos = db.prepare('SELECT id, nome FROM eixos ORDER BY id').all()

  const conteudos = db.prepare(`
    SELECT id, eixo_id AS eixoId, nome FROM conteudos ORDER BY id
  `).all()

  const subs = db.prepare(`
    SELECT id, conteudo_id AS conteudoId, nome FROM subconteudos ORDER BY conteudo_id, ordem
  `).all()

  return {
    niveis,
    eixos,
    conteudos: conteudos.map(c => ({
      ...c,
      subconteudos: subs
        .filter(s => s.conteudoId === c.id)
        .map(s => ({ id: s.id, nome: s.nome }))
    }))
  }
}

export function listarAdmin() {
  return db.prepare(`
    SELECT q.id, q.serial, q.ano, q.numero_questao AS numeroQuestao,
           c.nome AS conteudo, s.nome AS subconteudo, q.resumo
      FROM questoes q
      JOIN conteudos c ON c.id = q.conteudo_id
      JOIN subconteudos s ON s.id = q.subconteudo_id
     ORDER BY q.serial DESC
  `).all()
}

export function obterAdmin(id) {
  const q = db.prepare(`
    SELECT id, ano, banca, prova, numero_questao AS numeroQuestao,
           nivel_id AS nivelId, conteudo_id AS conteudoId,
           subconteudo_id AS subconteudoId, objeto_id AS objetoId,
           resumo, enunciado_texto AS enunciadoTexto,
           enunciado_complemento AS enunciadoComplemento,
           imagem, imagem_alt AS imagemAlt, resposta, comentario, teoria,
           taxa_acerto AS taxaAcerto
      FROM questoes WHERE id = ?
  `).get(id)

  if (!q) throw naoEncontrado('Questão não encontrada')

  const alternativas = {}
  db.prepare('SELECT letra, texto FROM alternativas WHERE questao_id = ?')
    .all(id)
    .forEach(alt => { alternativas[alt.letra] = alt.texto })

  return {
    ...q,
    teoria: JSON.parse(q.teoria),
    alternativas,
    palavrasChave: palavrasDaQuestao(id)
  }
}

export function criar(corpo, arquivo) {
  let dados

  try {
    dados = validar(corpo)
  } catch (erro) {
    if (arquivo) removerArquivoDaImagem(`/uploads/questoes/${arquivo.filename}`)
    throw erro
  }

  const imagem = arquivo ? `/uploads/questoes/${arquivo.filename}` : (dados.imagemUrl ?? '')

  try {
    return db.transaction(() => {
      const id = dados.id
        ?? db.prepare('SELECT COALESCE(MAX(id), ?) + 1 AS id FROM questoes').get(PRIMEIRO_CODIGO).id

      if (db.prepare('SELECT 1 FROM questoes WHERE id = ?').get(id)) {
        throw conflito(`Já existe uma questão com o código ${id}`)
      }

      const serial = db.prepare('SELECT COALESCE(MAX(serial), 0) + 1 AS serial FROM questoes').get().serial

      db.prepare(`
        INSERT INTO questoes (
          id, serial, ano, banca, prova, numero_questao, nivel_id, conteudo_id,
          subconteudo_id, objeto_id, resumo, enunciado_texto, enunciado_complemento,
          imagem, imagem_alt, resposta, comentario, teoria, taxa_acerto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, serial, dados.ano, dados.banca, dados.prova, dados.numeroQuestao ?? null,
        dados.nivelId, dados.conteudoId, dados.subconteudoId, dados.objetoId,
        dados.resumo, dados.enunciadoTexto, dados.enunciadoComplemento,
        imagem, dados.imagemAlt, dados.resposta, dados.comentario,
        JSON.stringify(dados.teoria), dados.taxaAcerto
      )

      gravarAlternativas(id, dados.alternativas)
      definirPalavrasDaQuestao(id, dados.palavrasChave)

      return obterAdmin(id)
    })()
  } catch (erro) {
    if (arquivo) removerArquivoDaImagem(imagem)
    throw erro
  }
}

export function atualizar(id, corpo, arquivo) {
  const atual = db.prepare('SELECT imagem FROM questoes WHERE id = ?').get(id)

  if (!atual) {
    if (arquivo) removerArquivoDaImagem(`/uploads/questoes/${arquivo.filename}`)
    throw naoEncontrado('Questão não encontrada')
  }

  let dados

  try {
    dados = validar(corpo)
  } catch (erro) {
    if (arquivo) removerArquivoDaImagem(`/uploads/questoes/${arquivo.filename}`)
    throw erro
  }

  let imagem = atual.imagem

  if (arquivo) imagem = `/uploads/questoes/${arquivo.filename}`
  else if (corpo.removerImagem === '1') imagem = ''
  else if (dados.imagemUrl) imagem = dados.imagemUrl

  const resultado = db.transaction(() => {
    db.prepare(`
      UPDATE questoes SET
        ano = ?, banca = ?, prova = ?, numero_questao = ?, nivel_id = ?,
        conteudo_id = ?, subconteudo_id = ?, objeto_id = ?, resumo = ?,
        enunciado_texto = ?, enunciado_complemento = ?, imagem = ?, imagem_alt = ?,
        resposta = ?, comentario = ?, teoria = ?, taxa_acerto = ?,
        atualizado_em = datetime('now')
      WHERE id = ?
    `).run(
      dados.ano, dados.banca, dados.prova, dados.numeroQuestao ?? null, dados.nivelId,
      dados.conteudoId, dados.subconteudoId, dados.objetoId, dados.resumo,
      dados.enunciadoTexto, dados.enunciadoComplemento, imagem, dados.imagemAlt,
      dados.resposta, dados.comentario, JSON.stringify(dados.teoria), dados.taxaAcerto,
      id
    )

    gravarAlternativas(id, dados.alternativas)
    definirPalavrasDaQuestao(id, dados.palavrasChave)

    return obterAdmin(id)
  })()

  if (imagem !== atual.imagem) removerArquivoDaImagem(atual.imagem)

  return resultado
}

export function excluir(id) {
  const atual = db.prepare('SELECT imagem FROM questoes WHERE id = ?').get(id)
  if (!atual) throw naoEncontrado('Questão não encontrada')

  db.transaction(() => {
    db.prepare('DELETE FROM questoes WHERE id = ?').run(id)
    db.prepare(`
      DELETE FROM palavras_chave
       WHERE id NOT IN (SELECT palavra_id FROM questao_palavras_chave)
    `).run()
  })()

  removerArquivoDaImagem(atual.imagem)
}
