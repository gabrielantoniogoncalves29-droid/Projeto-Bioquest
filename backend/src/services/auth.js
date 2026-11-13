import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../db.js'
import { config } from '../config.js'
import { emitirToken } from '../middleware/auth.js'
import { enviarEmail, emailDisponivel } from './email.js'
import { validarCredencialGoogle } from './google.js'
import { validar } from '../utils/params.js'
import { ErroHttp, conflito, indisponivel, naoAutorizado, proibido } from '../utils/erros.js'

const nome = z.string({ error: 'Informe o nome' }).trim().min(2, 'Informe o nome').max(80, 'Nome muito longo')
  .regex(/^[^<>\u0000-\u001f\u007f]+$/, 'O nome contém caracteres inválidos')
const email = z.string({ error: 'Informe o e-mail' }).trim().toLowerCase().email('E-mail inválido').max(120, 'E-mail muito longo')
const senha = z.string({ error: 'Informe a senha' }).min(8, 'A senha deve ter pelo menos 8 caracteres').max(72, 'A senha deve ter no máximo 72 caracteres')

export const esquemas = {
  nome,
  cadastro: z.object({ nome, email, senha }),
  login: z.object({ email, senha: z.string({ error: 'Informe a senha' }).min(1, 'Informe a senha').max(200) }),
  email: z.object({ email }),
  token: z.object({ token: z.string().min(10).max(200) }),
  redefinir: z.object({ token: z.string().min(10).max(200), senha }),
  alterarSenha: z.object({ senhaAtual: z.string().min(1, 'Informe a senha atual').max(200), novaSenha: senha }),
  google: z.object({ credencial: z.string().min(20).max(4000) })
}

const VALIDADE_EM_HORAS = { confirmar_email: 24, redefinir_senha: 1, alterar_email: 24 }
const hashDe = texto => crypto.createHash('sha256').update(texto).digest('hex')
const tokenInvalido = () => new ErroHttp(400, 'Link inválido ou expirado', undefined, 'token_invalido')

export function criarTokenDeEmail(usuarioId, tipo, dados) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiraEm = new Date(Date.now() + VALIDADE_EM_HORAS[tipo] * 3600 * 1000).toISOString()

  db.transaction(() => {
    db.prepare('DELETE FROM tokens_usuario WHERE usuario_id = ? AND tipo = ? AND usado_em IS NULL').run(usuarioId, tipo)
    db.prepare(`
      INSERT INTO tokens_usuario (usuario_id, tipo, hash, dados, expira_em) VALUES (?, ?, ?, ?, ?)
    `).run(usuarioId, tipo, hashDe(token), dados ? JSON.stringify(dados) : null, expiraEm)
  })()

  return token
}

function consumirToken(token, tipos) {
  const linha = db.prepare('SELECT * FROM tokens_usuario WHERE hash = ?').get(hashDe(token))

  if (!linha || linha.usado_em || !tipos.includes(linha.tipo) || linha.expira_em < new Date().toISOString()) {
    throw tokenInvalido()
  }

  const marcado = db.prepare(`
    UPDATE tokens_usuario SET usado_em = ? WHERE id = ? AND usado_em IS NULL
  `).run(new Date().toISOString(), linha.id)

  if (marcado.changes !== 1) throw tokenInvalido()

  return { ...linha, dados: linha.dados ? JSON.parse(linha.dados) : null }
}

async function mandarLink({ para, assunto, abertura, caminho, token, validade }) {
  const link = `${config.appUrl}/${caminho}#token=${token}`

  await enviarEmail({
    para,
    assunto,
    texto: `${abertura}\n\n${link}\n\nO link vale por ${validade} e só pode ser usado uma vez.\nSe você não pediu isso, ignore esta mensagem.\n\nBioQuest`
  })
}

const emails = {
  confirmar: (para, token) => mandarLink({
    para, token, caminho: 'confirmar-email', validade: '24 horas',
    assunto: 'Confirme seu e-mail no BioQuest', abertura: 'Para ativar sua conta no BioQuest, confirme seu e-mail:'
  }),
  redefinir: (para, token) => mandarLink({
    para, token, caminho: 'redefinir-senha', validade: '1 hora',
    assunto: 'Redefinição de senha do BioQuest', abertura: 'Para criar uma nova senha no BioQuest, acesse:'
  }),
  novoEmail: (para, token) => mandarLink({
    para, token, caminho: 'confirmar-email', validade: '24 horas',
    assunto: 'Confirme seu novo e-mail no BioQuest', abertura: 'Para confirmar este endereço como seu novo e-mail no BioQuest, acesse:'
  })
}

export const enviarLinkDeNovoEmail = emails.novoEmail

async function tentarEnviar(envio) {
  try {
    await envio()
    return true
  } catch (erro) {
    console.error('Falha ao enviar e-mail:', erro.message)
    return false
  }
}

const agoraEmSegundos = () => Math.floor(Date.now() / 1000)
const buscarPorEmail = valor => db.prepare('SELECT * FROM usuarios WHERE email = ?').get(valor)

const hashFalso = bcrypt.hashSync('senha-falsa-para-igualar-o-tempo', config.bcryptRounds)

export function usuarioPublico(usuarioId) {
  const u = db.prepare('SELECT nome, email, foto, senha_hash, google_sub FROM usuarios WHERE id = ?').get(usuarioId)

  if (!u) throw naoAutorizado('Sessão inválida', 'sessao_invalida')

  return { nome: u.nome, email: u.email, foto: u.foto, temSenha: Boolean(u.senha_hash), temGoogle: Boolean(u.google_sub) }
}

const sessao = usuarioId => ({ token: emitirToken(usuarioId), usuario: usuarioPublico(usuarioId) })

function inserirUsuario(campos) {
  try {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO usuarios (nome, email, senha_hash, google_sub, email_confirmado)
      VALUES (@nome, @email, @senha_hash, @google_sub, @email_confirmado)
    `).run({ senha_hash: null, google_sub: null, email_confirmado: 0, ...campos })

    return Number(lastInsertRowid)
  } catch (erro) {
    if (String(erro.code).startsWith('SQLITE_CONSTRAINT')) throw conflito('Este e-mail já está em uso')
    throw erro
  }
}

export async function cadastrar(corpo) {
  const dados = validar(esquemas.cadastro, corpo)

  if (buscarPorEmail(dados.email)) throw conflito('Este e-mail já está em uso')

  const id = inserirUsuario({
    nome: dados.nome,
    email: dados.email,
    senha_hash: await bcrypt.hash(dados.senha, config.bcryptRounds)
  })

  const emailEnviado = emailDisponivel()
    && await tentarEnviar(() => emails.confirmar(dados.email, criarTokenDeEmail(id, 'confirmar_email')))

  return {
    emailEnviado,
    mensagem: emailEnviado
      ? 'Conta criada. Enviamos um link de confirmação para o seu e-mail.'
      : 'Conta criada, mas não foi possível enviar o e-mail de confirmação agora. Tente reenviar mais tarde.'
  }
}

export async function entrar(corpo) {
  const dados = validar(esquemas.login, corpo)
  const usuario = buscarPorEmail(dados.email)

  const confere = await bcrypt.compare(dados.senha, usuario?.senha_hash ?? hashFalso)

  if (!usuario || !usuario.senha_hash || !confere) throw naoAutorizado('E-mail ou senha incorretos')

  if (!usuario.email_confirmado) {
    throw proibido('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.', 'email_nao_confirmado')
  }

  return sessao(usuario.id)
}

export function renovarSessao(usuarioId) {
  return sessao(usuarioId)
}

export async function entrarComGoogle(corpo) {
  const { credencial } = validar(esquemas.google, corpo)
  const google = await validarCredencialGoogle(credencial)

  const existente = db.prepare('SELECT id FROM usuarios WHERE google_sub = ?').get(google.sub)

  if (existente) return sessao(existente.id)

  if (buscarPorEmail(google.email)) {
    throw conflito('Já existe uma conta com este e-mail. Entre com e-mail e senha.')
  }

  const id = inserirUsuario({ nome: google.nome.slice(0, 80), email: google.email, google_sub: google.sub, email_confirmado: 1 })

  return sessao(id)
}

export async function vincularGoogle(usuarioId, corpo) {
  const { credencial } = validar(esquemas.google, corpo)
  const google = await validarCredencialGoogle(credencial)

  const dono = db.prepare('SELECT id FROM usuarios WHERE google_sub = ?').get(google.sub)

  if (dono && dono.id !== usuarioId) throw conflito('Esta conta Google já está vinculada a outro usuário')

  db.prepare('UPDATE usuarios SET google_sub = ? WHERE id = ?').run(google.sub, usuarioId)

  return usuarioPublico(usuarioId)
}

export function confirmarEmail(corpo) {
  const { token } = validar(esquemas.token, corpo)

  return db.transaction(() => {
    const linha = consumirToken(token, ['confirmar_email', 'alterar_email'])

    if (linha.tipo === 'confirmar_email') {
      db.prepare('UPDATE usuarios SET email_confirmado = 1 WHERE id = ?').run(linha.usuario_id)
      return { tipo: linha.tipo }
    }

    const novoEmail = linha.dados.novoEmail

    if (db.prepare('SELECT 1 FROM usuarios WHERE email = ? AND id <> ?').get(novoEmail, linha.usuario_id)) {
      throw conflito('Este e-mail já está em uso por outra conta')
    }

    db.prepare('UPDATE usuarios SET email = ?, email_confirmado = 1 WHERE id = ?').run(novoEmail, linha.usuario_id)

    return { tipo: linha.tipo, email: novoEmail }
  })()
}

function exigirEmailConfigurado() {
  if (!emailDisponivel()) throw indisponivel('O envio de e-mails não está configurado neste servidor')
}

export async function reenviarConfirmacao(corpo) {
  const { email: endereco } = validar(esquemas.email, corpo)
  exigirEmailConfigurado()

  const usuario = buscarPorEmail(endereco)

  if (usuario && !usuario.email_confirmado && usuario.senha_hash) {
    await tentarEnviar(() => emails.confirmar(usuario.email, criarTokenDeEmail(usuario.id, 'confirmar_email')))
  }
}

export async function solicitarRecuperacao(corpo) {
  const { email: endereco } = validar(esquemas.email, corpo)
  exigirEmailConfigurado()

  const usuario = buscarPorEmail(endereco)

  if (usuario) {
    await tentarEnviar(() => emails.redefinir(usuario.email, criarTokenDeEmail(usuario.id, 'redefinir_senha')))
  }
}

export async function redefinirSenha(corpo) {
  const dados = validar(esquemas.redefinir, corpo)
  const hash = await bcrypt.hash(dados.senha, config.bcryptRounds)

  db.transaction(() => {
    const linha = consumirToken(dados.token, ['redefinir_senha'])

    db.prepare(`
      UPDATE usuarios SET senha_hash = ?, email_confirmado = 1, tokens_validos_desde = ? WHERE id = ?
    `).run(hash, agoraEmSegundos(), linha.usuario_id)
  })()
}

export async function alterarSenha(usuarioId, corpo) {
  const dados = validar(esquemas.alterarSenha, corpo)
  const usuario = db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(usuarioId)

  if (!usuario?.senha_hash) {
    throw proibido('Esta conta ainda não tem senha. Use "Esqueci minha senha" para criar uma.', 'sem_senha')
  }

  if (!await bcrypt.compare(dados.senhaAtual, usuario.senha_hash)) {
    throw proibido('A senha atual está incorreta', 'senha_incorreta')
  }

  db.prepare('UPDATE usuarios SET senha_hash = ?, tokens_validos_desde = ? WHERE id = ?')
    .run(await bcrypt.hash(dados.novaSenha, config.bcryptRounds), agoraEmSegundos(), usuarioId)

  return sessao(usuarioId)
}

export async function confirmarIdentidade(usuarioId, tokenEmitidoEm, senhaInformada) {
  const usuario = db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(usuarioId)

  if (usuario.senha_hash) {
    if (!senhaInformada || !await bcrypt.compare(String(senhaInformada), usuario.senha_hash)) {
      throw proibido('Senha incorreta', 'senha_incorreta')
    }
    return
  }

  if (agoraEmSegundos() - tokenEmitidoEm > config.reautenticacaoSegundos) {
    throw proibido('Por segurança, saia, entre novamente e repita a ação.', 'reautenticacao_necessaria')
  }
}
