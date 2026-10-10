import { db } from '../db.js'
import { config } from '../config.js'
import { naoEncontrado, requisicaoInvalida } from '../utils/erros.js'

const TAXA_ACERTO_SQL = `
  COALESCE(
    CASE WHEN (SELECT COUNT(*) FROM respostas r WHERE r.questao_id = q.id) >= ${config.minRespostasParaTaxa}
      THEN (SELECT CAST(ROUND(100.0 * SUM(r.correta) / COUNT(*)) AS INTEGER)
              FROM respostas r WHERE r.questao_id = q.id)
    END,
    q.taxa_acerto
  )
`

const CARD_SQL = `
  SELECT q.serial, q.id, q.ano,
         q.nivel_id AS nivel, n.dificuldade,
         q.conteudo_id AS conteudoId,
         s.nome AS subconteudo, s.ordem AS subconteudoIndice,
         q.resumo
    FROM questoes q
    JOIN niveis n ON n.id = q.nivel_id
    JOIN subconteudos s ON s.id = q.subconteudo_id
`

export function listarCards() {
  const cards = db.prepare(`${CARD_SQL} ORDER BY q.serial`).all()

  const palavras = db.prepare(`
    SELECT qp.questao_id AS questaoId, p.palavra
      FROM questao_palavras_chave qp
      JOIN palavras_chave p ON p.id = qp.palavra_id
     ORDER BY p.palavra
  `).all()

  const porQuestao = new Map()
  for (const { questaoId, palavra } of palavras) {
    if (!porQuestao.has(questaoId)) porQuestao.set(questaoId, [])
    porQuestao.get(questaoId).push(palavra)
  }

  return cards.map(card => ({
    ...card,
    palavrasChave: porQuestao.get(card.id) ?? []
  }))
}

export function cardsPorIds(ids) {
  if (ids.length === 0) return []

  const marcadores = ids.map(() => '?').join(',')
  const linhas = db.prepare(`${CARD_SQL} WHERE q.id IN (${marcadores})`).all(...ids)
  const porId = new Map(linhas.map(linha => [linha.id, linha]))

  return ids.map(id => porId.get(id)).filter(Boolean)
}

export function listarIds() {
  return db.prepare('SELECT id FROM questoes ORDER BY serial').all().map(l => l.id)
}

export function obterQuestao(id) {
  const q = db.prepare(`
    SELECT q.id, q.ano, q.banca, q.prova, q.numero_questao AS numeroQuestao,
           q.resumo, q.conteudo_id AS conteudoId, q.objeto_id AS objetoId,
           q.nivel_id AS nivelId, n.dificuldade AS nivel,
           c.nome AS conteudoNome, s.nome AS subconteudo,
           q.enunciado_texto AS textoPrincipal,
           q.enunciado_complemento AS textoComplementar,
           q.imagem, q.imagem_alt AS alt,
           ${TAXA_ACERTO_SQL} AS taxaAcerto
      FROM questoes q
      JOIN niveis n ON n.id = q.nivel_id
      JOIN conteudos c ON c.id = q.conteudo_id
      JOIN subconteudos s ON s.id = q.subconteudo_id
     WHERE q.id = ?
  `).get(id)

  if (!q) throw naoEncontrado('Questão não encontrada')

  const alternativas = db.prepare(`
    SELECT letra, texto FROM alternativas WHERE questao_id = ? ORDER BY letra
  `).all(id)

  return {
    id: q.id,
    ano: q.ano,
    banca: q.banca,
    prova: q.prova,
    numeroQuestao: q.numeroQuestao,
    rotulo: `${q.banca} ${q.ano}`,
    resumo: q.resumo,
    conteudoId: q.conteudoId,
    subconteudo: q.subconteudo,
    nivel: q.nivel,
    nivelId: q.nivelId,
    objeto: { id: q.objetoId },
    conteudo: {
      area: { nome: q.conteudoNome, icone: String(q.conteudoId) },
      assunto: { nome: q.subconteudo }
    },
    taxaAcerto: q.taxaAcerto,
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
