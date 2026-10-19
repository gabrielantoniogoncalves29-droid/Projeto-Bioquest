import { db } from '../db.js'
import { garantirQuestao } from './questoes.js'
import { requisicaoInvalida } from '../utils/erros.js'

const COMENTARIO_SQL = `
  SELECT c.id,
         COALESCE(u.nome, c.autor) AS autor,
         c.texto,
         substr(c.criado_em, 1, 10) AS data,
         c.curtidas
    FROM comentarios c
    LEFT JOIN usuarios u ON u.id = c.usuario_id
`

export function listar(questaoId) {
  garantirQuestao(questaoId)

  return db.prepare(`
    ${COMENTARIO_SQL}
     WHERE c.questao_id = ?
     ORDER BY c.criado_em DESC, c.id DESC
  `).all(questaoId)
}

export function criar(usuarioId, questaoId, texto) {
  garantirQuestao(questaoId)

  const limpo = String(texto ?? '').trim()

  if (!limpo) throw requisicaoInvalida('O comentário não pode ficar vazio')
  if (limpo.length > 2000) throw requisicaoInvalida('O comentário passou de 2000 caracteres')

  const usuario = db.prepare('SELECT nome FROM usuarios WHERE id = ?').get(usuarioId)

  const { lastInsertRowid } = db.prepare(`
    INSERT INTO comentarios (questao_id, usuario_id, autor, texto)
    VALUES (?, ?, ?, ?)
  `).run(questaoId, usuarioId, usuario?.nome ?? 'Anônimo', limpo)

  return db.prepare(`${COMENTARIO_SQL} WHERE c.id = ?`).get(Number(lastInsertRowid))
}
