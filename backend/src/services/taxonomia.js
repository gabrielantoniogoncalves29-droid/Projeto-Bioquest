import { db } from '../db.js'

// Taxonomia pública (somente leitura): níveis, eixos (objetos da matriz),
// conteúdos (objetos do livro) com seus subconteúdos e os anos que existem no banco.
export function obterTaxonomia() {
  const niveis = db.prepare('SELECT id, nome, dificuldade FROM niveis ORDER BY id').all()
  const eixos = db.prepare('SELECT id, nome FROM eixos ORDER BY id').all()

  const conteudos = db.prepare(`
    SELECT id, eixo_id AS eixoId, nome FROM conteudos ORDER BY id
  `).all()

  const subs = db.prepare(`
    SELECT id, conteudo_id AS conteudoId, codigo, numero, nome
      FROM subconteudos ORDER BY conteudo_id, numero
  `).all()

  const anos = db.prepare(`
    SELECT DISTINCT ano FROM questoes WHERE ano IS NOT NULL ORDER BY ano DESC
  `).all().map(linha => linha.ano)

  return {
    niveis,
    eixos,
    conteudos: conteudos.map(c => ({
      ...c,
      subconteudos: subs
        .filter(s => s.conteudoId === c.id)
        .map(({ id, codigo, numero, nome }) => ({ id, codigo, numero, nome }))
    })),
    anos
  }
}
