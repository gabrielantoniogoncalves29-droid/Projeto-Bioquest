import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { db } from '../db.js'
import { config } from '../config.js'
import { cardsPorIds } from './questoes.js'
import { conflito, naoEncontrado, requisicaoInvalida } from '../utils/erros.js'

const esquemaPerfil = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(80),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(120)
})

function idsDe(tabela, usuarioId) {
  const coluna = tabela === 'respostas' ? 'atualizado_em' : 'criado_em'

  return db.prepare(`
    SELECT questao_id AS id FROM ${tabela}
     WHERE usuario_id = ?
     ORDER BY ${coluna} DESC, questao_id DESC
  `).all(usuarioId).map(linha => linha.id)
}

function obterUsuario(usuarioId) {
  const usuario = db.prepare(`
    SELECT id, nome, email, foto FROM usuarios WHERE id = ?
  `).get(usuarioId)

  if (!usuario) throw naoEncontrado('Usuário não encontrado')
  return usuario
}

function removerArquivoDaFoto(foto) {
  if (!foto || !foto.startsWith('/uploads/fotos/')) return

  const caminho = path.join(config.uploadsDir, 'fotos', path.basename(foto))
  fs.rmSync(caminho, { force: true })
}

export function obterPerfil(usuarioId) {
  const usuario = obterUsuario(usuarioId)

  const acertos = db.prepare(`
    SELECT COUNT(*) AS total FROM respostas WHERE usuario_id = ? AND correta = 1
  `).get(usuarioId).total

  return {
    nome: usuario.nome,
    email: usuario.email,
    foto: usuario.foto,
    acertos,
    questoesSalvas: cardsPorIds(idsDe('questoes_salvas', usuarioId)),
    questoesResolvidas: cardsPorIds(idsDe('respostas', usuarioId)),
    questoesRevisar: cardsPorIds(idsDe('questoes_revisar', usuarioId))
  }
}

export function atualizarPerfil(usuarioId, dados) {
  const resultado = esquemaPerfil.safeParse(dados)

  if (!resultado.success) {
    throw requisicaoInvalida(
      resultado.error.issues[0].message,
      resultado.error.issues.map(i => ({ campo: i.path.join('.'), mensagem: i.message }))
    )
  }

  const { nome, email } = resultado.data

  const emUso = db.prepare(`
    SELECT 1 FROM usuarios WHERE email = ? AND id <> ?
  `).get(email, usuarioId)

  if (emUso) throw conflito('Este e-mail já está em uso')

  obterUsuario(usuarioId)

  db.prepare('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?')
    .run(nome, email, usuarioId)

  return { nome, email }
}

export function salvarFoto(usuarioId, nomeArquivo) {
  const usuario = obterUsuario(usuarioId)
  const caminho = `/uploads/fotos/${nomeArquivo}`

  db.prepare('UPDATE usuarios SET foto = ? WHERE id = ?').run(caminho, usuarioId)
  removerArquivoDaFoto(usuario.foto)

  return { foto: caminho }
}

export function excluirDados(usuarioId) {
  const usuario = obterUsuario(usuarioId)

  db.transaction(() => {
    db.prepare('DELETE FROM respostas WHERE usuario_id = ?').run(usuarioId)
    db.prepare('DELETE FROM questoes_salvas WHERE usuario_id = ?').run(usuarioId)
    db.prepare('DELETE FROM questoes_revisar WHERE usuario_id = ?').run(usuarioId)
    db.prepare('UPDATE usuarios SET foto = NULL WHERE id = ?').run(usuarioId)
  })()

  removerArquivoDaFoto(usuario.foto)
}
