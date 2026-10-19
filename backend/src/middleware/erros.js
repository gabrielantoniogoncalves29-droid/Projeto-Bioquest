import { ErroHttp } from '../utils/erros.js'
import { config } from '../config.js'

export function naoEncontradoHandler(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' })
}

export function erroHandler(erro, req, res, next) {
  if (res.headersSent) return next(erro)

  if (erro instanceof ErroHttp) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes })
  }

  if (erro?.name === 'MulterError') {
    const mensagem = erro.code === 'LIMIT_FILE_SIZE'
      ? 'A imagem é grande demais'
      : 'Não foi possível receber o arquivo'
    return res.status(400).json({ erro: mensagem })
  }

  if (erro?.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' })
  }

  console.error(erro)
  res.status(500).json({
    erro: 'Erro interno do servidor',
    ...(config.producao ? {} : { detalhe: String(erro?.message ?? erro) })
  })
}
