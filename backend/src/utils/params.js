import { requisicaoInvalida } from './erros.js'

export function idDaRota(req, nome = 'id') {
  const valor = Number(req.params[nome])

  if (!Number.isInteger(valor) || valor <= 0) {
    throw requisicaoInvalida('Identificador inválido')
  }

  return valor
}

export function validar(esquema, dados) {
  const resultado = esquema.safeParse(dados ?? {})

  if (!resultado.success) {
    const problemas = resultado.error.issues
    throw requisicaoInvalida(
      problemas[0].message,
      problemas.map(p => ({ campo: p.path.join('.'), mensagem: p.message }))
    )
  }

  return resultado.data
}
