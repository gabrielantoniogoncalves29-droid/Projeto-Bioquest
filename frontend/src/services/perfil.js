import { api, urlMidia } from '@/services/api'

export async function buscarPerfil() {

  const { data } = await api.get('/perfil')

  return { ...data, foto: urlMidia(data.foto) }

}

export async function atualizarPerfil(dados) {

  const { data } = await api.patch('/perfil', dados)

  return data

}

export async function enviarFotoPerfil(arquivo) {

  const formulario = new FormData()

  formulario.append('foto', arquivo)

  const { data } = await api.post('/perfil/foto', formulario)

  return urlMidia(data.foto)

}

export async function excluirDadosDoPerfil({ senha, confirmacao }) {

  await api.delete('/perfil', { data: { senha, confirmacao } })

}

export async function solicitarTrocaDeEmail({ novoEmail, senha }) {

  const { data } = await api.post('/perfil/email', { novoEmail, senha })

  return data

}

export function apagarRespostas() {

  return api.delete('/perfil/respostas')

}

export function apagarSalvas() {

  return api.delete('/perfil/salvas')

}

export function apagarRevisar() {

  return api.delete('/perfil/revisar')

}
