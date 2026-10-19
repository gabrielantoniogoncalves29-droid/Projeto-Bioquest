import axios from 'axios'

const origem = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: `${origem}/api`,
  timeout: 15000
})

export function urlMidia(caminho) {

  if (!caminho) return ''

  if (/^(https?:|data:|blob:)/i.test(caminho)) return caminho

  return `${origem}${caminho}`

}
