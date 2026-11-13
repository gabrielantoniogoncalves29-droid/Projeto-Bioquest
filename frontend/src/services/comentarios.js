import { api, urlMidia } from '@/services/api'

export async function buscarComentariosPorQuestao(id) {

  const { data } = await api.get(`/questoes/${Number(id)}/comentarios`)

  return data.map(comentario => ({ ...comentario, foto: urlMidia(comentario.foto) }))

}

export async function enviarComentarioDaQuestao(id, texto) {

  const { data } = await api.post(`/questoes/${Number(id)}/comentarios`, { texto })

  return { ...data, foto: urlMidia(data.foto) }

}
