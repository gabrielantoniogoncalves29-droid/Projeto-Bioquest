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
  imagemUrl: z.string().trim().regex(/^https?:\/\//i, 'A URL da imagem deve começar com http:// ou https://').optional(),
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

  if (campo === 'imagemUrl') return issue.message

  return `${nome}: valor inválido`
}

// Retorna { dados, avisos }. Avisos não impedem salvar.
export function validar(corpo) {
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

  const alternativas = LETRAS
    .map(letra => ({ letra, texto: String(corpo[`alternativa${letra}`] ?? '').trim() }))
    .filter(alt => alt.texto)

  // Consistência de classificação: só avisa (não bloqueia).
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
      // Palavras-chave: separadas SOMENTE por ";" (vírgula faz parte do termo).
      palavrasChave: listaDeTexto(dados.palavrasChave, ';')
    }
  }
}

export function removerArquivoDaImagem(imagem) {
  if (!imagem || !imagem.startsWith('/uploads/questoes/')) return

  fs.rmSync(
    path.join(config.uploadsDir, 'questoes', path.basename(imagem)),
    { force: true }
  )
}

export function gravarAlternativas(questaoId, alternativas) {
  db.prepare('DELETE FROM alternativas WHERE questao_id = ?').run(questaoId)

  const inserir = db.prepare(`
    INSERT INTO alternativas (questao_id, letra, texto) VALUES (?, ?, ?)
  `)

  alternativas.forEach(alt => inserir.run(questaoId, alt.letra, alt.texto))
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
  db.prepare('SELECT letra, texto FROM alternativas WHERE questao_id = ?')
    .all(id)
    .forEach(alt => { alternativas[alt.letra] = alt.texto })

  const { objetoMatrizId, objetoMatrizNome, objetoLivroId, objetoLivroNome,
    conteudoLivroCodigo, conteudoLivroNome, categorizacao, observacoes, ...resto } = q

  return {
    ...resto,
    teoria: JSON.parse(q.teoria),
    alternativas,
    palavrasChave: palavrasDaQuestao(id),
    // Dados originais da planilha, somente leitura (null em questões criadas no painel).
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

export function criar(corpo, arquivo) {
  let validado

  try {
    validado = validar(corpo)
  } catch (erro) {
    if (arquivo) removerArquivoDaImagem(`/uploads/questoes/${arquivo.filename}`)
    throw erro
  }

  const { dados, avisos } = validado
  const imagem = arquivo ? `/uploads/questoes/${arquivo.filename}` : (dados.imagemUrl ?? '')

  try {
    const salva = db.transaction(() => {
      // Novas questões recebem MAX(id)+1 (a planilha ocupa 1-183).
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

  let validado

  try {
    validado = validar(corpo)
  } catch (erro) {
    if (arquivo) removerArquivoDaImagem(`/uploads/questoes/${arquivo.filename}`)
    throw erro
  }

  const { dados, avisos } = validado

  let imagem = atual.imagem

  if (arquivo) imagem = `/uploads/questoes/${arquivo.filename}`
  else if (corpo.removerImagem === '1') imagem = ''
  else if (dados.imagemUrl) imagem = dados.imagemUrl

  const resultado = db.transaction(() => {
    db.prepare(`UPDATE questoes SET ${COLUNAS_EDITAVEIS}, atualizado_em = datetime('now') WHERE id = ?`)
      .run(...valoresEditaveis(dados, imagem), id)

    gravarAlternativas(id, dados.alternativas)
    definirPalavrasDaQuestao(id, dados.palavrasChave)

    return obterAdmin(id)
  })()

  // Troca ou remoção: apaga o arquivo antigo do disco (só os enviados pelo painel).
  if (imagem !== atual.imagem) removerArquivoDaImagem(atual.imagem)

  return { ...resultado, avisos }
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
