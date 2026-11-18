export class ErroHttp extends Error {
  constructor(status, mensagem, detalhes, codigo) {
    super(mensagem)
    this.status = status
    this.detalhes = detalhes
    this.codigo = codigo
  }
}

export const naoEncontrado = (mensagem = 'Não encontrado') => new ErroHttp(404, mensagem)
export const requisicaoInvalida = (mensagem, detalhes) => new ErroHttp(400, mensagem, detalhes)
export const naoAutorizado = (mensagem = 'Faça login para continuar', codigo) => new ErroHttp(401, mensagem, undefined, codigo)
export const proibido = (mensagem, codigo) => new ErroHttp(403, mensagem, undefined, codigo)
export const conflito = (mensagem) => new ErroHttp(409, mensagem)
export const indisponivel = (mensagem) => new ErroHttp(503, mensagem)
