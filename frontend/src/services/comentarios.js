import { api } from '@/services/api'

export async function buscarComentariosPorQuestao(id) {

  const { data } = await api.get(`/questoes/${Number(id)}/comentarios`)

  return data

}

export async function enviarComentarioDaQuestao(id, texto) {

  const { data } = await api.post(`/questoes/${Number(id)}/comentarios`, { texto })

  return data

}
