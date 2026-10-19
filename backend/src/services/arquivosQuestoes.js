// Ponte entre o banco (local, fora do Git) e arquivos de texto versionáveis:
//
//   db/questoes/0165.json   uma questão por arquivo (o que se edita no painel)
//   db/imagens/0165.png     a imagem da questão (se houver)
//
// O painel exporta sozinho a cada "Salvar"; `npm run seed` importa tudo de volta.
// Os campos que pertencem à planilha (ano, classificação, gabarito...) NÃO vão nos
// arquivos das questões da planilha: eles continuam vindo de dados_enem.xlsx.
import fs from 'node:fs'
import path from 'node:path'
import { config } from '../config.js'
import { db } from '../db.js'
import {
  validar, obterAdmin, gravarAlternativas, removerArquivoDaImagem,
  COLUNAS_EDITAVEIS, valoresEditaveis
} from './adminQuestoes.js'
import { definirPalavrasDaQuestao } from './palavrasChave.js'
import { normalizar, termosDaPlanilha } from '../utils/texto.js'

const LETRAS = ['A', 'B', 'C', 'D', 'E']
const rotulo = id => String(id).padStart(4, '0')
const arquivoJson = id => path.join(config.pastaQuestoes, `${rotulo(id)}.json`)

const CAMPOS_DA_PLANILHA = ['ano', 'banca', 'prova', 'numeroQuestao', 'nivelId', 'conteudoId', 'subconteudoId', 'objetoId', 'resposta']

function removerImagensExportadas(id) {
  if (!fs.existsSync(config.pastaImagens)) return

  fs.readdirSync(config.pastaImagens)
    .filter(nome => nome.startsWith(`${rotulo(id)}.`))
    .forEach(nome => fs.rmSync(path.join(config.pastaImagens, nome), { force: true }))
}

export function exportarQuestao(id) {
  const q = obterAdmin(id)
  const daPlanilha = Boolean(q.planilha?.objetoMatrizId)
  const saida = { id: q.id, origem: daPlanilha ? 'planilha' : 'painel' }

  if (!daPlanilha) {
    CAMPOS_DA_PLANILHA.forEach(campo => { saida[campo] = q[campo] ?? null })
  }

  Object.assign(saida, {
    resumo: q.resumo,
    enunciadoTexto: q.enunciadoTexto,
    enunciadoComplemento: q.enunciadoComplemento,
    imagem: '',
    imagemAlt: q.imagemAlt,
    comentario: q.comentario,
    teoria: q.teoria,
    alternativas: q.alternativas,
    palavrasChave: q.palavrasChave
  })

  removerImagensExportadas(id)

  if (q.imagem?.startsWith('/uploads/questoes/')) {
    const origem = path.join(config.uploadsDir, 'questoes', path.basename(q.imagem))

    if (fs.existsSync(origem)) {
      const nome = `${rotulo(id)}${path.extname(origem).toLowerCase()}`
      fs.mkdirSync(config.pastaImagens, { recursive: true })
      fs.copyFileSync(origem, path.join(config.pastaImagens, nome))
      saida.imagem = nome
    }
  } else if (q.imagem) {
    saida.imagemUrl = q.imagem
  }

  fs.mkdirSync(config.pastaQuestoes, { recursive: true })
  fs.writeFileSync(arquivoJson(id), `${JSON.stringify(saida, null, 2)}\n`, 'utf8')

  return path.relative(config.raiz, arquivoJson(id)).split(path.sep).join('/')
}

export function removerArquivosDaQuestao(id) {
  fs.rmSync(arquivoJson(id), { force: true })
  removerImagensExportadas(id)
}

function temConteudoEditado(q) {
  if (!q.planilha?.objetoMatrizId) return true

  const padrao = [...new Set(
    termosDaPlanilha(q.planilha.conteudoNome, q.planilha.observacoes).map(normalizar).filter(Boolean)
  )]
  const atuais = q.palavrasChave.map(normalizar)

  return Boolean(
    q.resumo || q.enunciadoTexto || q.enunciadoComplemento || q.imagem || q.comentario ||
    q.teoria.length || Object.keys(q.alternativas).length ||
    JSON.stringify(padrao) !== JSON.stringify(atuais)
  )
}

export function exportarTodas() {
  const ids = db.prepare('SELECT id FROM questoes ORDER BY id').all().map(l => l.id)
  let exportadas = 0
  let ignoradas = 0

  for (const id of ids) {
    if (temConteudoEditado(obterAdmin(id))) {
      exportarQuestao(id)
      exportadas++
    } else {
      ignoradas++
    }
  }

  return { exportadas, ignoradas }
}

function corpoDoBanco(q) {
  const corpo = {
    ano: q.ano ?? '', banca: q.banca, prova: q.prova, numeroQuestao: q.numeroQuestao ?? '',
    nivelId: q.nivelId ?? '', conteudoId: q.conteudoId ?? '', subconteudoId: q.subconteudoId ?? '',
    objetoId: q.objetoId ?? '', resumo: q.resumo, enunciadoTexto: q.enunciadoTexto,
    enunciadoComplemento: q.enunciadoComplemento, imagemAlt: q.imagemAlt,
    resposta: q.resposta ?? '', comentario: q.comentario,
    teoria: q.teoria.join('\n'), palavrasChave: q.palavrasChave.join('; ')
  }

  LETRAS.forEach(letra => { corpo[`alternativa${letra}`] = q.alternativas[letra] ?? '' })

  return corpo
}

function sobrepor(corpo, arquivo) {
  const novo = { ...corpo }
  const simples = ['ano', 'banca', 'prova', 'numeroQuestao', 'nivelId', 'conteudoId', 'subconteudoId',
    'objetoId', 'resumo', 'enunciadoTexto', 'enunciadoComplemento', 'imagemAlt', 'resposta', 'comentario']

  simples.forEach(campo => {
    if (campo in arquivo) novo[campo] = arquivo[campo] ?? ''
  })

  if (Array.isArray(arquivo.teoria)) novo.teoria = arquivo.teoria.join('\n')
  if (Array.isArray(arquivo.palavrasChave)) novo.palavrasChave = arquivo.palavrasChave.join('; ')

  if (arquivo.alternativas && typeof arquivo.alternativas === 'object') {
    LETRAS.forEach(letra => { novo[`alternativa${letra}`] = arquivo.alternativas[letra] ?? '' })
  }

  return novo
}

// Importa db/questoes/*.json para o banco. Devolve { importadas, problemas, orfas }.
// Se houver qualquer problema nada é gravado (a transação é desfeita).
export function importarArquivos() {
  if (!fs.existsSync(config.pastaQuestoes)) return { importadas: 0, problemas: [], orfas: [] }

  const nomes = fs.readdirSync(config.pastaQuestoes).filter(n => /^\d+\.json$/.test(n)).sort()
  const problemas = []
  const idsDosArquivos = new Set()
  let importadas = 0

  const aplicar = db.transaction(() => {
    for (const nome of nomes) {
      let arquivo

      try {
        arquivo = JSON.parse(fs.readFileSync(path.join(config.pastaQuestoes, nome), 'utf8'))
      } catch (erro) {
        problemas.push(`${nome}: JSON inválido (${erro.message})`)
        continue
      }

      const id = Number(arquivo.id)

      if (!Number.isInteger(id) || id <= 0 || rotulo(id) !== nome.replace('.json', '')) {
        problemas.push(`${nome}: "id" ausente ou diferente do nome do arquivo`)
        continue
      }

      idsDosArquivos.add(id)

      try {
        if (!db.prepare('SELECT 1 FROM questoes WHERE id = ?').get(id)) {
          const serialLivre = !db.prepare('SELECT 1 FROM questoes WHERE serial = ?').get(id)
          const serial = serialLivre
            ? id
            : db.prepare('SELECT COALESCE(MAX(serial), 0) + 1 AS s FROM questoes').get().s

          db.prepare('INSERT INTO questoes (id, serial) VALUES (?, ?)').run(id, serial)
        }

        const atual = obterAdmin(id)
        const { dados } = validar(sobrepor(corpoDoBanco(atual), arquivo))

        let imagem = atual.imagem

        if ('imagemUrl' in arquivo) {
          imagem = arquivo.imagemUrl
        } else if (arquivo.imagem) {
          const origem = path.join(config.pastaImagens, path.basename(arquivo.imagem))

          if (!fs.existsSync(origem)) throw new Error(`imagem "${arquivo.imagem}" não encontrada em db/imagens`)

          fs.mkdirSync(path.join(config.uploadsDir, 'questoes'), { recursive: true })
          fs.copyFileSync(origem, path.join(config.uploadsDir, 'questoes', path.basename(origem)))
          imagem = `/uploads/questoes/${path.basename(origem)}`
        } else if ('imagem' in arquivo) {
          imagem = ''
        }

        db.prepare(`UPDATE questoes SET ${COLUNAS_EDITAVEIS}, atualizado_em = datetime('now') WHERE id = ?`)
          .run(...valoresEditaveis(dados, imagem), id)

        gravarAlternativas(id, dados.alternativas)
        definirPalavrasDaQuestao(id, dados.palavrasChave)

        if (imagem !== atual.imagem) removerArquivoDaImagem(atual.imagem)

        importadas++
      } catch (erro) {
        problemas.push(`${nome}: ${erro.message}`)
      }
    }

    if (problemas.length) throw new Error('arquivos inválidos')
  })

  try {
    aplicar()
  } catch (erro) {
    if (!problemas.length) throw erro
    importadas = 0
  }

  const orfas = problemas.length
    ? []
    : db.prepare('SELECT id FROM questoes WHERE objeto_matriz_id IS NULL ORDER BY id').all()
      .map(l => l.id)
      .filter(id => !idsDosArquivos.has(id))

  return { importadas, problemas, orfas }
}
