import { db } from '../db.js'
import { config } from '../config.js'
import { conflito, naoEncontrado, requisicaoInvalida } from '../utils/erros.js'
import { resumirTexto } from '../utils/texto.js'
import { filtrarEOrdenar } from '../utils/filtrarQuestoes.js'

const CARD_SQL = `
  SELECT q.serial, q.id, q.ano,
         q.nivel_id AS nivel, n.dificuldade,
         q.objeto_id AS objetoId, e.nome AS objetoNome,
         q.conteudo_id AS conteudoId, c.nome AS conteudoNome,
         q.subconteudo_id AS subconteudoId, s.codigo AS subconteudoCodigo,
         s.nome AS subconteudo,
         q.resumo, q.enunciado_texto AS enunciado,
         q.conteudo_livro_nome AS conteudoLivroNome, q.observacoes,
         EXISTS (SELECT 1 FROM alternativas a WHERE a.questao_id = q.id) AS temAlternativas
    FROM questoes q
    LEFT JOIN niveis n ON n.id = q.nivel_id
    LEFT JOIN eixos e ON e.id = q.objeto_id
    LEFT JOIN conteudos c ON c.id = q.conteudo_id
    LEFT JOIN subconteudos s ON s.id = q.subconteudo_id
`

// Texto padrão do card quando o resumo está vazio: enunciado, ou o conteúdo da
// planilha + observações, ou só o código da questão.
export function resumoDaQuestao({ id, resumo, enunciado, conteudoLivroNome, observacoes, subconteudo }) {
  if (resumo?.trim()) return resumo.trim()
  if (enunciado?.trim()) return resumirTexto(enunciado, 200)

  const partes = [conteudoLivroNome || subconteudo, observacoes].filter(parte => parte?.trim())

  return partes.length ? partes.join(' — ') : `Questão ${id}`
}

function palavrasPorQuestao(ids) {
  const linhas = ids
    ? db.prepare(`
        SELECT qp.questao_id AS questaoId, p.palavra
          FROM questao_palavras_chave qp
          JOIN palavras_chave p ON p.id = qp.palavra_id
         WHERE qp.questao_id IN (${ids.map(() => '?').join(',')})
         ORDER BY qp.questao_id, qp.ordem, p.palavra
      `).all(...ids)
    : db.prepare(`
        SELECT qp.questao_id AS questaoId, p.palavra
          FROM questao_palavras_chave qp
          JOIN palavras_chave p ON p.id = qp.palavra_id
         ORDER BY qp.questao_id, qp.ordem, p.palavra
      `).all()

  const mapa = new Map()

  for (const { questaoId, palavra } of linhas) {
    if (!mapa.has(questaoId)) mapa.set(questaoId, [])
    mapa.get(questaoId).push(palavra)
  }

  return mapa
}

function montarCards(linhas) {
  const palavras = palavrasPorQuestao(linhas.length ? linhas.map(linha => linha.id) : [])

  return linhas.map(linha => ({
    id: linha.id,
    serial: linha.serial,
    ano: linha.ano,
    nivel: linha.nivel,
    dificuldade: linha.dificuldade,
    objetoId: linha.objetoId,
    objetoNome: linha.objetoNome,
    conteudoId: linha.conteudoId,
    conteudoNome: linha.conteudoNome,
    subconteudoId: linha.subconteudoId,
    subconteudoCodigo: linha.subconteudoCodigo,
    subconteudo: linha.subconteudo,
    resumo: resumoDaQuestao(linha),
    palavrasChave: palavras.get(linha.id) ?? [],
    temAlternativas: linha.temAlternativas === 1
  }))
}

function idsMarcados(tabela, usuarioId) {
  return new Set(
    db.prepare(`SELECT questao_id AS id FROM ${tabela} WHERE usuario_id = ?`)
      .all(usuarioId)
      .map(linha => linha.id)
  )
}

// filtros: { anos, niveis, objetos, conteudos, subconteudos, estados, termo, ordem }
// (ver utils/filtrarQuestoes.js). Sem "ordem", ordena por serial.
export function listarCards(filtros = {}, usuarioId = config.usuarioDemoId) {
  const cards = montarCards(db.prepare(`${CARD_SQL} ORDER BY q.serial`).all())

  const contexto = filtros.estados?.length
    ? {
        respondidas: idsMarcados('respostas', usuarioId),
        salvas: idsMarcados('questoes_salvas', usuarioId),
        revisar: idsMarcados('questoes_revisar', usuarioId)
      }
    : {}

  return filtrarEOrdenar(cards, filtros, contexto)
}

export function cardsPorIds(ids) {
  if (ids.length === 0) return []

  const marcadores = ids.map(() => '?').join(',')
  const linhas = db.prepare(`${CARD_SQL} WHERE q.id IN (${marcadores})`).all(...ids)
  const porId = new Map(montarCards(linhas).map(card => [card.id, card]))

  return ids.map(id => porId.get(id)).filter(Boolean)
}

export function listarIds(filtros = {}, usuarioId = config.usuarioDemoId) {
  return listarCards(filtros, usuarioId).map(card => card.id)
}

// Ponto de extensão (login): o percentual de acertos só será exposto quando
// config.taxaAcertoAtiva for true. Até lá a API devolve null e a tela mostra "—".
// Usa o valor cadastrado até haver respostas suficientes; depois as respostas reais.
export function calcularTaxaAcerto(questaoId) {
  const { total, acertos } = db.prepare(`
    SELECT COUNT(*) AS total, COALESCE(SUM(correta), 0) AS acertos
      FROM respostas WHERE questao_id = ?
  `).get(questaoId)

  if (total >= config.minRespostasParaTaxa) return Math.round((100 * acertos) / total)

  return db.prepare('SELECT taxa_acerto AS taxa FROM questoes WHERE id = ?').get(questaoId)?.taxa ?? 0
}

export function obterQuestao(id) {
  const q = db.prepare(`
    SELECT q.id, q.ano, q.banca, q.prova, q.numero_questao AS numeroQuestao,
           q.resumo, q.enunciado_texto AS enunciado,
           q.conteudo_livro_nome AS conteudoLivroNome, q.observacoes,
           q.conteudo_id AS conteudoId, q.subconteudo_id AS subconteudoId,
           q.objeto_id AS objetoId, e.nome AS objetoNome,
           q.nivel_id AS nivelId, n.dificuldade AS nivel,
           c.nome AS conteudoNome, s.nome AS subconteudo, s.codigo AS subconteudoCodigo,
           q.enunciado_texto AS textoPrincipal,
           q.enunciado_complemento AS textoComplementar,
           q.imagem, q.imagem_alt AS alt,
           q.categorizacao, q.objeto_matriz_id AS objetoMatrizId,
           q.objeto_matriz_nome AS objetoMatrizNome,
           q.objeto_livro_id AS objetoLivroId, q.objeto_livro_nome AS objetoLivroNome,
           q.conteudo_livro_codigo AS conteudoLivroCodigo
      FROM questoes q
      LEFT JOIN niveis n ON n.id = q.nivel_id
      LEFT JOIN eixos e ON e.id = q.objeto_id
      LEFT JOIN conteudos c ON c.id = q.conteudo_id
      LEFT JOIN subconteudos s ON s.id = q.subconteudo_id
     WHERE q.id = ?
  `).get(id)

  if (!q) throw naoEncontrado('Questão não encontrada')

  // Sem gabarito: ele só sai em /explicacao e na correção (/resposta).
  const alternativas = db.prepare(`
    SELECT letra, texto FROM alternativas WHERE questao_id = ? ORDER BY letra
  `).all(id)

  return {
    id: q.id,
    ano: q.ano,
    banca: q.banca,
    prova: q.prova,
    numeroQuestao: q.numeroQuestao,
    rotulo: [q.banca, q.ano].filter(Boolean).join(' '),
    resumo: resumoDaQuestao(q),
    conteudoId: q.conteudoId,
    subconteudoId: q.subconteudoId,
    subconteudo: q.subconteudo,
    nivel: q.nivel,
    nivelId: q.nivelId,
    objetoId: q.objetoId,
    objeto: { id: q.objetoId, nome: q.objetoNome },
    conteudo: {
      area: { nome: q.conteudoNome, icone: q.conteudoId ? String(q.conteudoId) : '' },
      assunto: { nome: q.subconteudo, codigo: q.subconteudoCodigo }
    },
    // Dados originais da planilha (somente leitura).
    planilha: {
      objetoMatrizId: q.objetoMatrizId,
      objetoMatrizNome: q.objetoMatrizNome,
      objetoLivroId: q.objetoLivroId,
      objetoLivroNome: q.objetoLivroNome,
      conteudoCodigo: q.conteudoLivroCodigo,
      conteudoNome: q.conteudoLivroNome,
      categorizacao: q.categorizacao,
      observacoes: q.observacoes
    },
    taxaAcerto: config.taxaAcertoAtiva ? calcularTaxaAcerto(id) : null,
    palavrasChave: palavrasPorQuestao([id]).get(id) ?? [],
    temAlternativas: alternativas.length > 0,
    enunciado: {
      imagem: q.imagem,
      alt: q.alt,
      textoPrincipal: q.textoPrincipal,
      textoComplementar: q.textoComplementar
    },
    alternativas
  }
}

export function obterExplicacao(id) {
  const q = db.prepare(`
    SELECT resposta, comentario, teoria FROM questoes WHERE id = ?
  `).get(id)

  if (!q) throw naoEncontrado('Questão não encontrada')

  return {
    resposta: q.resposta,
    comentario: q.comentario,
    teoria: JSON.parse(q.teoria)
  }
}

export function garantirQuestao(id) {
  const existe = db.prepare('SELECT 1 FROM questoes WHERE id = ?').get(id)
  if (!existe) throw naoEncontrado('Questão não encontrada')
}

export function responder(usuarioId, questaoId, alternativa) {
  const q = db.prepare(`
    SELECT resposta, comentario FROM questoes WHERE id = ?
  `).get(questaoId)

  if (!q) throw naoEncontrado('Questão não encontrada')

  const totalAlternativas = db.prepare(`
    SELECT COUNT(*) AS total FROM alternativas WHERE questao_id = ?
  `).get(questaoId).total

  if (totalAlternativas === 0) {
    throw requisicaoInvalida('Esta questão ainda não tem alternativas cadastradas')
  }

  if (!q.resposta) {
    throw conflito('Esta questão ainda não tem gabarito cadastrado')
  }

  const existe = db.prepare(`
    SELECT 1 FROM alternativas WHERE questao_id = ? AND letra = ?
  `).get(questaoId, alternativa)

  if (!existe) throw requisicaoInvalida('Alternativa inexistente para esta questão')

  const correta = alternativa === q.resposta ? 1 : 0

  db.prepare(`
    INSERT INTO respostas (usuario_id, questao_id, alternativa, correta)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(usuario_id, questao_id) DO UPDATE SET
      alternativa = excluded.alternativa,
      correta = excluded.correta,
      atualizado_em = datetime('now')
  `).run(usuarioId, questaoId, alternativa, correta)

  const { acertos } = db.prepare(`
    SELECT COUNT(*) AS acertos FROM respostas WHERE usuario_id = ? AND correta = 1
  `).get(usuarioId)

  return {
    correta: correta === 1,
    resposta: q.resposta,
    comentario: q.comentario,
    acertos
  }
}

// Resposta que o usuário já deu a esta questão (para restaurar a tela), ou null.
export function respostaDoUsuario(usuarioId, questaoId) {
  garantirQuestao(questaoId)

  const linha = db.prepare(`
    SELECT r.alternativa, r.correta, q.resposta, q.comentario
      FROM respostas r JOIN questoes q ON q.id = r.questao_id
     WHERE r.usuario_id = ? AND r.questao_id = ?
  `).get(usuarioId, questaoId)

  if (!linha) return null

  return {
    alternativa: linha.alternativa,
    correta: linha.correta === 1,
    resposta: linha.resposta,
    comentario: linha.comentario
  }
}

function marcador(tabela) {
  return {
    adicionar(usuarioId, questaoId) {
      garantirQuestao(questaoId)
      db.prepare(`
        INSERT OR IGNORE INTO ${tabela} (usuario_id, questao_id) VALUES (?, ?)
      `).run(usuarioId, questaoId)
    },
    remover(usuarioId, questaoId) {
      db.prepare(`
        DELETE FROM ${tabela} WHERE usuario_id = ? AND questao_id = ?
      `).run(usuarioId, questaoId)
    }
  }
}

export const salvas = marcador('questoes_salvas')
export const revisar = marcador('questoes_revisar')
