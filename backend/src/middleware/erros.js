import { ErroHttp } from '../utils/erros.js'
import { config } from '../config.js'
import { registrarAviso, registrarErro, contextoDaRequisicao } from '../utils/log.js'
import { alertar } from '../utils/alerta.js'

export function naoEncontradoHandler(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' })
}

export function erroHandler(erro, req, res, next) {
  if (res.headersSent) return next(erro)

  res.set('Cache-Control', 'no-store')

  if (erro instanceof ErroHttp) {
    const sensivel = req.originalUrl.startsWith('/api/auth') || req.originalUrl.startsWith('/admin')

    if (erro.status === 401 || erro.status === 403) {
      registrarAviso('acesso_negado', { ...contextoDaRequisicao(req), status: erro.status, codigo: erro.codigo })
    } else if (erro.status === 400 && sensivel) {
      registrarAviso('validacao', { ...contextoDaRequisicao(req), mensagem: erro.message })
    }

    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes, codigo: erro.codigo })
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

  registrarErro('erro_servidor', { ...contextoDaRequisicao(req), mensagem: String(erro?.message ?? erro), pilha: String(erro?.stack ?? '').split('\n').slice(0, 4).join(' | ') })
  alertar('erro_servidor', `Erro 500 em ${req.method} ${req.originalUrl.split('?')[0]}: ${String(erro?.message ?? erro).slice(0, 200)}`)
  res.status(500).json({
    erro: 'Erro interno do servidor',
    ...(config.producao ? {} : { detalhe: String(erro?.message ?? erro) })
  })
}
