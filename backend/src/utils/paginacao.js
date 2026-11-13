import { requisicaoInvalida } from './erros.js'

const LIMITE_MAXIMO = 100

function inteiroPositivo(valor, nome) {
  if (typeof valor !== 'string' || !/^\d{1,6}$/.test(valor) || Number(valor) < 1) {
    throw requisicaoInvalida(`Valor inválido em "${nome}"`)
  }

  return Number(valor)
}

export function paginacaoDaQuery(query) {
  if (query.limite === undefined && query.pagina === undefined) return null

  const limite = query.limite === undefined ? 20 : inteiroPositivo(query.limite, 'limite')
  const pagina = query.pagina === undefined ? 1 : inteiroPositivo(query.pagina, 'pagina')

  if (limite > LIMITE_MAXIMO) throw requisicaoInvalida(`"limite" deve ser no máximo ${LIMITE_MAXIMO}`)

  return { limite, pagina }
}

export function paginar(itens, { limite, pagina }) {
  return itens.slice((pagina - 1) * limite, pagina * limite)
}
