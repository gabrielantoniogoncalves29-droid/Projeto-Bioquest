import { api, urlMidia } from '@/services/api'

let listaEmCache = null
let listaPendente = null
let idsEmCache = null
let idsPendente = null

const questoesEmCache = new Map()
const explicacoesEmCache = new Map()

function memorizar(mapa, id, buscar) {

  if (!mapa.has(id)) {

    const promessa = buscar().catch(erro => {

      mapa.delete(id)

      throw erro

    })

    mapa.set(id, promessa)

  }

  return mapa.get(id)

}

// Descarta os caches em memória (a lista, ids e cada questão), para que edições
// feitas no /admin apareçam sem recarregar a página.
export function limparCacheQuestoes() {

  listaEmCache = null
  idsEmCache = null
  questoesEmCache.clear()
  explicacoesEmCache.clear()

}

export function buscarQuestoes(forcar = false) {

  if (forcar) limparCacheQuestoes()

  if (listaEmCache) return Promise.resolve(listaEmCache)

  if (!listaPendente) {

    listaPendente = api.get('/questoes')
      .then(({ data }) => {

        listaEmCache = data
        idsEmCache = data.map(questao => questao.id)

        return data

      })
      .finally(() => {

        listaPendente = null

      })

  }

  return listaPendente

}

export function buscarIdsQuestoes() {

  if (idsEmCache) return Promise.resolve(idsEmCache)

  if (!idsPendente) {

    idsPendente = api.get('/questoes/ids')
      .then(({ data }) => {

        idsEmCache = data

        return data

      })
      .finally(() => {

        idsPendente = null

      })

  }

  return idsPendente

}

export function buscarQuestaoPorId(id) {

  return memorizar(questoesEmCache, Number(id), async () => {

    try {

      const { data } = await api.get(`/questoes/${Number(id)}`)

      return {
        ...data,
        enunciado: {
          ...data.enunciado,
          imagem: urlMidia(data.enunciado.imagem)
        }
      }

    } catch (erro) {

      if (erro.response?.status === 404) return null

      throw erro

    }

  })

}

export function buscarExplicacao(id) {

  return memorizar(explicacoesEmCache, Number(id), async () => {

    const { data } = await api.get(`/questoes/${Number(id)}/explicacao`)

    return data

  })

}

export async function buscarTaxonomia() {

  const { data } = await api.get('/taxonomia')

  return data

}

export async function buscarConfig() {

  const { data } = await api.get('/config')

  return data

}

export async function buscarMinhaResposta(id) {

  const { data } = await api.get(`/questoes/${Number(id)}/minha-resposta`)

  return data

}

export async function enviarResposta(id, alternativa) {

  const { data } = await api.post(`/questoes/${Number(id)}/resposta`, { alternativa })

  return data

}

export function salvarQuestaoNoServidor(id) {

  return api.put(`/questoes/${Number(id)}/salvar`)

}

export function removerQuestaoSalvaNoServidor(id) {

  return api.delete(`/questoes/${Number(id)}/salvar`)

}

export function marcarRevisarNoServidor(id) {

  return api.put(`/questoes/${Number(id)}/revisar`)

}

export function desmarcarRevisarNoServidor(id) {

  return api.delete(`/questoes/${Number(id)}/revisar`)

}
