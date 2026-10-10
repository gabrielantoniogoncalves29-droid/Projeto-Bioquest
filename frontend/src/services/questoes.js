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

export function buscarQuestoes() {

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
