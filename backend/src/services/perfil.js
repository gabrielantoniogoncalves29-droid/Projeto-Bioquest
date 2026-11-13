import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { db } from '../db.js'
import { config } from '../config.js'
import { cardsPorIds } from './questoes.js'
import { confirmarIdentidade, criarTokenDeEmail, enviarLinkDeNovoEmail, esquemas } from './auth.js'
import { emailDisponivel } from './email.js'
import { validar } from '../utils/params.js'
import { conflito, indisponivel, naoEncontrado, requisicaoInvalida } from '../utils/erros.js'

const esquemaNome = z.object({ nome: esquemas.nome })

const esquemaNovoEmail = z.object({
  novoEmail: esquemas.email.shape.email,
  senha: z.string().max(200).optional()
})

const esquemaExclusao = z.object({
  senha: z.string().max(200).optional(),
  confirmacao: z.string()
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
    SELECT id, nome, email, foto, senha_hash FROM usuarios WHERE id = ?
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
    temSenha: Boolean(usuario.senha_hash),
    acertos,
    questoesSalvas: cardsPorIds(idsDe('questoes_salvas', usuarioId)),
    questoesResolvidas: cardsPorIds(idsDe('respostas', usuarioId)),
    questoesRevisar: cardsPorIds(idsDe('questoes_revisar', usuarioId))
  }
}

export function atualizarNome(usuarioId, dados) {
  const { nome } = validar(esquemaNome, dados)

  obterUsuario(usuarioId)
  db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome, usuarioId)

  return { nome }
}

export async function solicitarNovoEmail(usuarioId, tokenEmitidoEm, dados) {
  const { novoEmail, senha } = validar(esquemaNovoEmail, dados)
  const usuario = obterUsuario(usuarioId)

  if (!emailDisponivel()) throw indisponivel('O envio de e-mails não está configurado neste servidor')

  await confirmarIdentidade(usuarioId, tokenEmitidoEm, senha)

  if (novoEmail === usuario.email) throw requisicaoInvalida('Este já é o seu e-mail')

  if (db.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(novoEmail)) throw conflito('Este e-mail já está em uso')

  await enviarLinkDeNovoEmail(novoEmail, criarTokenDeEmail(usuarioId, 'alterar_email', { novoEmail }))
}

export function salvarFoto(usuarioId, nomeArquivo) {
  const usuario = obterUsuario(usuarioId)
  const caminho = `/uploads/fotos/${nomeArquivo}`

  db.prepare('UPDATE usuarios SET foto = ? WHERE id = ?').run(caminho, usuarioId)
  removerArquivoDaFoto(usuario.foto)

  return { foto: caminho }
}

export function limparRespostas(usuarioId) {
  db.transaction(() => {
    db.prepare('DELETE FROM respostas WHERE usuario_id = ?').run(usuarioId)
    db.prepare('DELETE FROM tentativas WHERE usuario_id = ?').run(usuarioId)
  })()
}

export function limparSalvas(usuarioId) {
  db.prepare('DELETE FROM questoes_salvas WHERE usuario_id = ?').run(usuarioId)
}

export function limparRevisar(usuarioId) {
  db.prepare('DELETE FROM questoes_revisar WHERE usuario_id = ?').run(usuarioId)
}

export async function excluirConta(usuarioId, tokenEmitidoEm, dados) {
  const { senha, confirmacao } = validar(esquemaExclusao, dados)
  const usuario = obterUsuario(usuarioId)

  if (confirmacao.trim().toLowerCase() !== usuario.email) {
    throw requisicaoInvalida('Digite o e-mail da conta para confirmar a exclusão')
  }

  await confirmarIdentidade(usuarioId, tokenEmitidoEm, senha)

  db.transaction(() => {
    db.prepare(`
      UPDATE comentarios SET usuario_id = NULL, autor = 'Usuário removido' WHERE usuario_id = ?
    `).run(usuarioId)

    db.prepare('DELETE FROM usuarios WHERE id = ?').run(usuarioId)
  })()

  removerArquivoDaFoto(usuario.foto)
}
