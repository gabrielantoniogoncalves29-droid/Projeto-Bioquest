import { api } from '@/services/api'

export async function buscarEstatisticas() {

  const { data } = await api.get('/estatisticas')

  return data

}
