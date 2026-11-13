import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { db } from '../db.js'
import { config } from '../config.js'
import { definirPalavrasDaQuestao, palavrasDaQuestao } from './palavrasChave.js'
import { resumoDaQuestao } from './questoes.js'
import { obterTaxonomia } from './taxonomia.js'
import { conflito, naoEncontrado, requisicaoInvalida } from '../utils/erros.js'
import { listaDeTexto } from '../utils/texto.js'

const LETRAS = ['A', 'B', 'C', 'D', 'E']

const inteiro = (min, max) => z.coerce.number().int().min(min).max(max)

const enderecoDaImagem = z.string().trim().regex(/^https?:\/\//i, 'A URL da imagem deve começar com http:// ou https://').optional()

const PASTA_PUBLICA = '/uploads/questoes/'

const esquema = z.object({
  id: inteiro(1, 999999999).optional(),
  ano: inteiro(1990, 2100).optional(),
  banca: z.string().trim().max(40).default('Enem'),
  prova: z.string().trim().max(60).default(''),
  numeroQuestao: inteiro(1, 999).optional(),
  nivelId: inteiro(1, 3).optional(),
  conteudoId: inteiro(1, 9999).optional(),
  subconteudoId: inteiro(1, 999999).optional(),
  objetoId: inteiro(1, 6).optional(),
  resumo: z.string().trim().max(600).default(''),
  enunciadoTexto: z.string().trim().default(''),
  enunciadoComplemento: z.string().trim().default(''),
  imagemAlt: z.string().trim().max(300).default(''),
  imagemUrl: enderecoDaImagem,
  ...Object.fromEntries(LETRAS.map(letra => [`imagemUrlAlternativa${letra}`, enderecoDaImagem])),
  resposta: z.enum(LETRAS).optional(),
  comentario: z.string().trim().default(''),
  teoria: z.string().default(''),
  palavrasChave: z.string().default('')
})

const NOMES_DOS_CAMPOS = {
  id: 'Código', ano: 'Ano', banca: 'Banca', prova: 'Prova', numeroQuestao: 'Nº da questão',
  nivelId: 'Nível', conteudoId: 'Conteúdo', subconteudoId: 'Subconteúdo', objetoId: 'Objeto de conhecimento',
  imagemUrl: 'Endereço da imagem', resposta: 'Alternativa correta'
}

function mensagemDoErro(issue) {
  const campo = issue.path[0]
  const nome = NOMES_DOS_CAMPOS[campo] ?? campo

  if (String(campo).startsWith('imagemUrl')) return issue.message

  return `${nome}: valor inválido`
}

export function imagensDasAlternativas(corpo, dados, atuais = {}, arquivos = {}) {
  const imagens = {}

  for (const letra of LETRAS) {
    const arquivo = arquivos[`imagemAlternativa${letra}`]?.[0]

    if (arquivo) imagens[letra] = `${PASTA_PUBLICA}${arquivo.filename}`
    else if (corpo?.[`removerImagemAlternativa${letra}`] === '1') imagens[letra] = ''
    else if (dados[`imagemUrlAlternativa${letra}`]) imagens[letra] = dados[`imagemUrlAlternativa${letra}`]
    else imagens[letra] = atuais[letra] ?? ''
  }

  return imagens
}

export function validar(corpo, { atuais = {}, arquivos = {} } = {}) {
  const limpo = {}

  for (const [chave, valor] of Object.entries(corpo ?? {})) {
    if (valor !== '' && valor !== undefined && valor !== null) limpo[chave] = valor
  }

  const resultado = esquema.safeParse(limpo)

  if (!resultado.success) {
    throw requisicaoInvalida(
      mensagemDoErro(resultado.error.issues[0]),
      resultado.error.issues.map(i => ({ campo: i.path.join('.'), mensagem: mensagemDoErro(i) }))
    )
  }

  const dados = resultado.data
  const avisos = []

  const imagens = imagensDasAlternativas(corpo, dados, atuais, arquivos)

  const alternativas = LETRAS
    .map(letra => ({ letra, texto: String(corpo?.[`alternativa${letra}`] ?? '').trim(), imagem: imagens[letra] }))
    .filter(alt => alt.texto || alt.imagem)

  if (dados.subconteudoId !== undefined) {
    const sub = db.prepare('SELECT conteudo_id AS conteudoId FROM subconteudos WHERE id = ?').get(dados.subconteudoId)

    if (!sub) {
      avisos.push('O subconteúdo escolhido não existe e foi ignorado.')
      dados.subconteudoId = undefined
    } else if (dados.conteudoId === undefined) {
      dados.conteudoId = sub.conteudoId
    } else if (sub.conteudoId !== dados.conteudoId) {
      avisos.push('O subconteúdo não pertence ao conteúdo escolhido.')
    }
  }

  if (alternativas.length === 1) {
    avisos.push('Há só uma alternativa preenchida; o resolver precisa de pelo menos duas para fazer sentido.')
  }

  return {
    avisos,
    dados: {
      ...dados,
      alternativas,
      teoria: listaDeTexto(dados.teoria, /\r?\n/),
      palavrasChave: listaDeTexto(dados.palavrasChave, ';')
    }
  }
}

export function removerArquivoDaImagem(imagem) {
  if (!imagem || !imagem.startsWith(PASTA_PUBLICA)) return

  fs.rmSync(
    path.join(config.uploadsDir, 'questoes', path.basename(imagem)),
    { force: true }
  )
}

export function gravarAlternativas(questaoId, alternativas) {
  db.prepare('DELETE FROM alternativas WHERE questao_id = ?').run(questaoId)

  const inserir = db.prepare(`
    INSERT INTO alternativas (questao_id, letra, texto, imagem) VALUES (?, ?, ?, ?)
  `)

  alternativas.forEach(alt => inserir.run(questaoId, alt.letra, alt.texto, alt.imagem ?? ''))
}

export function imagensDasAlternativasNoBanco(questaoId) {
  const imagens = {}

  db.prepare("SELECT letra, imagem FROM alternativas WHERE questao_id = ? AND imagem <> ''")
    .all(questaoId)
    .forEach(alt => { imagens[alt.letra] = alt.imagem })

  return imagens
}

export function removerImagensSubstituidas(antigas, novas) {
  const mantidas = new Set(Object.values(novas))

  Object.values(antigas).forEach(imagem => {
    if (imagem && !mantidas.has(imagem)) removerArquivoDaImagem(imagem)
  })
}

function descartarEnvios(arquivos) {
  Object.values(arquivos ?? {}).flat().forEach(arquivo => removerArquivoDaImagem(`${PASTA_PUBLICA}${arquivo.filename}`))
}

export function taxonomia() {
  return obterTaxonomia()
}

const LISTA_SQL = `
  SELECT q.id, q.serial, q.ano, q.numero_questao AS numeroQuestao,
         q.objeto_id AS objetoId, e.nome AS objeto,
         c.nome AS conteudo, s.nome AS subconteudo,
         q.resumo, q.enunciado_texto AS enunciado,
         q.objeto_matriz_id AS objetoMatrizId, q.objeto_matriz_nome AS objetoMatrizNome,
         q.objeto_livro_id AS objetoLivroId, q.objeto_livro_nome AS objetoLivroNome,
         q.conteudo_livro_codigo AS conteudoLivroCodigo,
         q.conteudo_livro_nome AS conteudoLivroNome,
         q.categorizacao, q.observacoes, q.resposta AS gabarito,
         (q.enunciado_texto <> '') AS temEnunciado,
         EXISTS (SELECT 1 FROM alternativas a WHERE a.questao_id = q.id) AS temAlternativas,
         (q.resposta IS NOT NULL) AS temGabarito
    FROM questoes q
    LEFT JOIN eixos e ON e.id = q.objeto_id
    LEFT JOIN conteudos c ON c.id = q.conteudo_id
    LEFT JOIN subconteudos s ON s.id = q.subconteudo_id
`

export function listarAdmin() {
  return db.prepare(`${LISTA_SQL} ORDER BY q.serial`).all().map(linha => ({
    id: linha.id,
    serial: linha.serial,
    ano: linha.ano,
    numeroQuestao: linha.numeroQuestao,
    objetoId: linha.objetoId,
    objeto: linha.objeto,
    conteudo: linha.conteudo,
    subconteudo: linha.subconteudo,
    resumo: resumoDaQuestao(linha),
    objetoMatrizId: linha.objetoMatrizId,
    objetoMatrizNome: linha.objetoMatrizNome,
    objetoLivroId: linha.objetoLivroId,
    objetoLivroNome: linha.objetoLivroNome,
    conteudoLivroCodigo: linha.conteudoLivroCodigo,
    conteudoLivroNome: linha.conteudoLivroNome,
    categorizacao: linha.categorizacao,
    observacoes: linha.observacoes,
    gabarito: linha.gabarito,
    temEnunciado: linha.temEnunciado === 1,
    temAlternativas: linha.temAlternativas === 1,
    temGabarito: linha.temGabarito === 1
  }))
}

export function obterAdmin(id) {
  const q = db.prepare(`
    SELECT id, ano, banca, prova, numero_questao AS numeroQuestao,
           nivel_id AS nivelId, conteudo_id AS conteudoId,
           subconteudo_id AS subconteudoId, objeto_id AS objetoId,
           resumo, enunciado_texto AS enunciadoTexto,
           enunciado_complemento AS enunciadoComplemento,
           imagem, imagem_alt AS imagemAlt, resposta, comentario, teoria,
           objeto_matriz_id AS objetoMatrizId, objeto_matriz_nome AS objetoMatrizNome,
           objeto_livro_id AS objetoLivroId, objeto_livro_nome AS objetoLivroNome,
           conteudo_livro_codigo AS conteudoLivroCodigo,
           conteudo_livro_nome AS conteudoLivroNome,
           categorizacao, observacoes
      FROM questoes WHERE id = ?
  `).get(id)

  if (!q) throw naoEncontrado('Questão não encontrada')

  const alternativas = {}
  const alternativasImagens = {}
  db.prepare('SELECT letra, texto, imagem FROM alternativas WHERE questao_id = ?')
    .all(id)
    .forEach(alt => {
      alternativas[alt.letra] = alt.texto
      if (alt.imagem) alternativasImagens[alt.letra] = alt.imagem
    })

  const { objetoMatrizId, objetoMatrizNome, objetoLivroId, objetoLivroNome,
    conteudoLivroCodigo, conteudoLivroNome, categorizacao, observacoes, ...resto } = q

  return {
    ...resto,
    teoria: JSON.parse(q.teoria),
    alternativas,
    alternativasImagens,
    palavrasChave: palavrasDaQuestao(id),
    planilha: {
      objetoMatrizId, objetoMatrizNome, objetoLivroId, objetoLivroNome,
      conteudoCodigo: conteudoLivroCodigo, conteudoNome: conteudoLivroNome,
      categorizacao, observacoes
    }
  }
}

export const COLUNAS_EDITAVEIS = `
  ano = ?, banca = ?, prova = ?, numero_questao = ?, nivel_id = ?,
  conteudo_id = ?, subconteudo_id = ?, objeto_id = ?, resumo = ?,
  enunciado_texto = ?, enunciado_complemento = ?, imagem = ?, imagem_alt = ?,
  resposta = ?, comentario = ?, teoria = ?
`

export const valoresEditaveis = (dados, imagem) => [
  dados.ano ?? null, dados.banca, dados.prova, dados.numeroQuestao ?? null, dados.nivelId ?? null,
  dados.conteudoId ?? null, dados.subconteudoId ?? null, dados.objetoId ?? null, dados.resumo,
  dados.enunciadoTexto, dados.enunciadoComplemento, imagem, dados.imagemAlt,
  dados.resposta ?? null, dados.comentario, JSON.stringify(dados.teoria)
]

export function criar(corpo, arquivos = {}) {
  let validado

  try {
    validado = validar(corpo, { arquivos })
  } catch (erro) {
    descartarEnvios(arquivos)
    throw erro
  }

  const { dados, avisos } = validado
  const arquivo = arquivos.imagem?.[0]
  const imagem = arquivo ? `${PASTA_PUBLICA}${arquivo.filename}` : (dados.imagemUrl ?? '')

  try {
    const salva = db.transaction(() => {
      const id = dados.id
        ?? db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM questoes').get().id

      if (db.prepare('SELECT 1 FROM questoes WHERE id = ?').get(id)) {
        throw conflito(`Já existe uma questão com o código ${id}`)
      }

      const serial = db.prepare('SELECT COALESCE(MAX(serial), 0) + 1 AS serial FROM questoes').get().serial

      db.prepare('INSERT INTO questoes (id, serial) VALUES (?, ?)').run(id, serial)
      db.prepare(`UPDATE questoes SET ${COLUNAS_EDITAVEIS} WHERE id = ?`)
        .run(...valoresEditaveis(dados, imagem), id)

      gravarAlternativas(id, dados.alternativas)
      definirPalavrasDaQuestao(id, dados.palavrasChave)

      return obterAdmin(id)
    })()

    return { ...salva, avisos }
  } catch (erro) {
    descartarEnvios(arquivos)
    throw erro
  }
}

export function atualizar(id, corpo, arquivos = {}) {
  const atual = db.prepare('SELECT imagem FROM questoes WHERE id = ?').get(id)

  if (!atual) {
    descartarEnvios(arquivos)
    throw naoEncontrado('Questão não encontrada')
  }

  const imagensAnteriores = imagensDasAlternativasNoBanco(id)

  let validado

  try {
    validado = validar(corpo, { atuais: imagensAnteriores, arquivos })
  } catch (erro) {
    descartarEnvios(arquivos)
    throw erro
  }

  const { dados, avisos } = validado

  const arquivo = arquivos.imagem?.[0]

  let imagem = atual.imagem

  if (arquivo) imagem = `${PASTA_PUBLICA}${arquivo.filename}`
  else if (corpo.removerImagem === '1') imagem = ''
  else if (dados.imagemUrl) imagem = dados.imagemUrl

  let resultado

  try {
    resultado = db.transaction(() => {
      db.prepare(`UPDATE questoes SET ${COLUNAS_EDITAVEIS}, atualizado_em = datetime('now') WHERE id = ?`)
        .run(...valoresEditaveis(dados, imagem), id)

      gravarAlternativas(id, dados.alternativas)
      definirPalavrasDaQuestao(id, dados.palavrasChave)

      return obterAdmin(id)
    })()
  } catch (erro) {
    descartarEnvios(arquivos)
    throw erro
  }

  if (imagem !== atual.imagem) removerArquivoDaImagem(atual.imagem)

  removerImagensSubstituidas(imagensAnteriores, resultado.alternativasImagens)

  return { ...resultado, avisos }
}

export function excluir(id) {
  const atual = db.prepare('SELECT imagem FROM questoes WHERE id = ?').get(id)
  if (!atual) throw naoEncontrado('Questão não encontrada')

  const imagensAlternativas = imagensDasAlternativasNoBanco(id)

  db.transaction(() => {
    db.prepare('DELETE FROM questoes WHERE id = ?').run(id)
    db.prepare(`
      DELETE FROM palavras_chave
       WHERE id NOT IN (SELECT palavra_id FROM questao_palavras_chave)
    `).run()
  })()

  removerArquivoDaImagem(atual.imagem)
  Object.values(imagensAlternativas).forEach(imagem => removerArquivoDaImagem(imagem))
}
