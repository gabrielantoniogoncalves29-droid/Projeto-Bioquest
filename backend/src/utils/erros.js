export class ErroHttp extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem)
    this.status = status
    this.detalhes = detalhes
  }
}

export const naoEncontrado = (mensagem = 'Não encontrado') => new ErroHttp(404, mensagem)
export const requisicaoInvalida = (mensagem, detalhes) => new ErroHttp(400, mensagem, detalhes)
export const conflito = (mensagem) => new ErroHttp(409, mensagem)
