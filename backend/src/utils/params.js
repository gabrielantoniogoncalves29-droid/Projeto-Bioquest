import { requisicaoInvalida } from './erros.js'

export function idDaRota(req, nome = 'id') {
  const valor = Number(req.params[nome])

  if (!Number.isInteger(valor) || valor <= 0) {
    throw requisicaoInvalida('Identificador inválido')
  }

  return valor
}
