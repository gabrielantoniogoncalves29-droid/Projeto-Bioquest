import { db } from '../db.js'
import { normalizar, escaparLike } from '../utils/texto.js'

export function sugerir(termo, limite = 6) {
  const consulta = normalizar(termo)
  if (!consulta) return []

  const seguro = escaparLike(consulta)

  return db.prepare(`
    SELECT p.palavra
      FROM palavras_chave p
      JOIN questao_palavras_chave qp ON qp.palavra_id = p.id
     WHERE p.normalizada LIKE ? ESCAPE '\\'
       AND p.normalizada <> ?
     GROUP BY p.id
     ORDER BY (p.normalizada LIKE ? ESCAPE '\\') DESC, COUNT(*) DESC, p.palavra
     LIMIT ?
  `).all(`%${seguro}%`, consulta, `${seguro}%`, limite).map(linha => linha.palavra)
}

export function listarTodas() {
  return db.prepare(`
    SELECT p.palavra
      FROM palavras_chave p
     WHERE EXISTS (SELECT 1 FROM questao_palavras_chave qp WHERE qp.palavra_id = p.id)
     ORDER BY p.palavra
  `).all().map(linha => linha.palavra)
}

export function definirPalavrasDaQuestao(questaoId, palavras) {
  const vistas = new Set()
  const unicas = []

  for (const palavra of palavras) {
    const normalizada = normalizar(palavra)
    if (!normalizada || vistas.has(normalizada)) continue
    vistas.add(normalizada)
    unicas.push({ palavra: palavra.trim(), normalizada })
  }

  db.prepare('DELETE FROM questao_palavras_chave WHERE questao_id = ?').run(questaoId)

  const inserirPalavra = db.prepare(`
    INSERT INTO palavras_chave (palavra, normalizada) VALUES (?, ?)
    ON CONFLICT(normalizada) DO NOTHING
  `)
  const buscarId = db.prepare('SELECT id FROM palavras_chave WHERE normalizada = ?')
  const ligar = db.prepare(`
    INSERT OR IGNORE INTO questao_palavras_chave (questao_id, palavra_id) VALUES (?, ?)
  `)

  for (const { palavra, normalizada } of unicas) {
    inserirPalavra.run(palavra, normalizada)
    ligar.run(questaoId, buscarId.get(normalizada).id)
  }

  limparPalavrasSemUso()
}

export function limparPalavrasSemUso() {
  db.prepare(`
    DELETE FROM palavras_chave
     WHERE id NOT IN (SELECT palavra_id FROM questao_palavras_chave)
  `).run()
}

export function palavrasDaQuestao(questaoId) {
  return db.prepare(`
    SELECT p.palavra
      FROM questao_palavras_chave qp
      JOIN palavras_chave p ON p.id = qp.palavra_id
     WHERE qp.questao_id = ?
     ORDER BY p.palavra
  `).all(questaoId).map(linha => linha.palavra)
}
