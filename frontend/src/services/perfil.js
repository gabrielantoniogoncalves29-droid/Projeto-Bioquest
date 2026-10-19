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

export async function excluirDadosDoPerfil() {

  await api.delete('/perfil')

}
