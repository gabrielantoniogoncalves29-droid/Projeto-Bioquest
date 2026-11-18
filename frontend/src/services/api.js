import axios from 'axios'

const origem = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const CHAVE_TOKEN = 'bioquest:token'

export const api = axios.create({
  baseURL: `${origem}/api`,
  timeout: 15000
})

let aoPerderSessao = null

export function definirAoPerderSessao(funcao) {

  aoPerderSessao = funcao

}

export function lerToken() {

  try {

    return localStorage.getItem(CHAVE_TOKEN)

  } catch {

    return null

  }

}

export function gravarToken(token) {

  try {

    if (token) localStorage.setItem(CHAVE_TOKEN, token)
    else localStorage.removeItem(CHAVE_TOKEN)

  } catch {

    return

  }

}

export function dadosDoToken(token) {

  try {

    const carga = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')

    const { iat, exp } = JSON.parse(atob(carga))

    return typeof iat === 'number' && typeof exp === 'number' ? { emitidoEm: iat * 1000, expiraEm: exp * 1000 } : null

  } catch {

    return null

  }

}

api.interceptors.request.use(config => {

  const token = lerToken()

  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`

  return config

})

api.interceptors.response.use(
  resposta => resposta,
  erro => {

    const enviouToken = Boolean(erro.config?.headers?.Authorization)

    const sessaoInvalida = erro.response?.status === 401 && erro.response.data?.codigo === 'sessao_invalida'

    if (sessaoInvalida && enviouToken && aoPerderSessao) aoPerderSessao()

    return Promise.reject(erro)

  }
)

export function mensagemDeErro(erro, padrao = 'Não foi possível concluir a operação. Tente novamente.') {

  if (!erro.response) {

    return erro.code === 'ECONNABORTED'
      ? 'O servidor demorou para responder. Tente novamente.'
      : 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'

  }

  if (erro.response.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'

  if (erro.response.status >= 500) return 'O servidor está com problemas no momento. Tente novamente mais tarde.'

  return erro.response.data?.erro ?? padrao

}

export function codigoDeErro(erro) {

  return erro.response?.data?.codigo ?? null

}

export function urlMidia(caminho) {

  if (!caminho) return ''

  if (/^(https?:|data:|blob:)/i.test(caminho)) return caminho

  return `${origem}${caminho}`

}
