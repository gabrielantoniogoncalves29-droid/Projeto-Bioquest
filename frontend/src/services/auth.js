import { api } from '@/services/api'

export async function requisitarLogin(email, senha) {

  const { data } = await api.post('/auth/login', { email, senha })

  return data

}

export async function requisitarCadastro(nome, email, senha) {

  const { data } = await api.post('/auth/cadastro', { nome, email, senha })

  return data

}

export async function requisitarGoogle(credencial) {

  const { data } = await api.post('/auth/google', { credencial })

  return data

}

export async function buscarUsuarioAtual() {

  const { data } = await api.get('/auth/me')

  return data

}

export async function renovarSessao() {

  const { data } = await api.post('/auth/renovar')

  return data

}

export async function confirmarEmailComToken(token) {

  const { data } = await api.post('/auth/confirmar-email', { token })

  return data

}

export async function reenviarConfirmacao(email) {

  const { data } = await api.post('/auth/reenviar-confirmacao', { email })

  return data

}

export async function solicitarRecuperacaoSenha(email) {

  const { data } = await api.post('/auth/recuperar-senha', { email })

  return data

}

export async function redefinirSenhaComToken(token, senha) {

  const { data } = await api.post('/auth/redefinir-senha', { token, senha })

  return data

}

export async function encerrarSessaoNoServidor() {

  await api.post('/auth/logout')

}
