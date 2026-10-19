import { api } from '@/services/api'

export async function buscarPalavrasChave(termo, limite = 6, sinal) {

  const { data } = await api.get('/palavras-chave', {
    params: { q: termo, limite },
    signal: sinal
  })

  return data

}
