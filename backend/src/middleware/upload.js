import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'
import { config } from '../config.js'
import { requisicaoInvalida } from '../utils/erros.js'
import { registrarAviso, contextoDaRequisicao } from '../utils/log.js'

const EXTENSOES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
}

function criarUpload(subpasta, tamanhoMaximo, tiposPermitidos, maximoDeArquivos = 1) {
  const destino = path.join(config.uploadsDir, subpasta)
  fs.mkdirSync(destino, { recursive: true })

  return multer({
    storage: multer.diskStorage({
      destination: destino,
      filename: (req, arquivo, cb) => {
        const sufixo = crypto.randomBytes(8).toString('hex')
        cb(null, `${Date.now()}-${sufixo}${EXTENSOES[arquivo.mimetype]}`)
      }
    }),
    limits: { fileSize: tamanhoMaximo, files: maximoDeArquivos },
    fileFilter: (req, arquivo, cb) => {
      cb(null, tiposPermitidos.includes(arquivo.mimetype))
    }
  })
}

const LETRAS = ['A', 'B', 'C', 'D', 'E']

export const uploadImagensDaQuestao = criarUpload(
  'questoes',
  5 * 1024 * 1024,
  ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  1 + LETRAS.length
).fields([
  { name: 'imagem', maxCount: 1 },
  ...LETRAS.map(letra => ({ name: `imagemAlternativa${letra}`, maxCount: 1 }))
])

export const uploadFotoPerfil = criarUpload(
  'fotos',
  3 * 1024 * 1024,
  ['image/jpeg', 'image/png', 'image/webp']
)

function detectarTipo(caminho) {
  const cabecalho = Buffer.alloc(12)
  const descritor = fs.openSync(caminho, 'r')

  try {
    fs.readSync(descritor, cabecalho, 0, 12, 0)
  } finally {
    fs.closeSync(descritor)
  }

  if (cabecalho.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (cabecalho[0] === 0xff && cabecalho[1] === 0xd8 && cabecalho[2] === 0xff) return 'image/jpeg'
  if (cabecalho.subarray(0, 4).toString('latin1') === 'RIFF' && cabecalho.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp'
  if (['GIF87a', 'GIF89a'].includes(cabecalho.subarray(0, 6).toString('latin1'))) return 'image/gif'

  return null
}

function arquivosEnviados(req) {
  if (req.file) return [req.file]

  return Object.values(req.files ?? {}).flat()
}

export function conferirImagem(req, res, next) {
  const arquivos = arquivosEnviados(req)

  if (arquivos.length === 0) return next()

  for (const arquivo of arquivos) {
    let tipo = null

    try {
      tipo = detectarTipo(arquivo.path)
    } catch {
      tipo = null
    }

    if (tipo && EXTENSOES[tipo] === path.extname(arquivo.filename)) continue

    arquivos.forEach(enviado => fs.rmSync(enviado.path, { force: true }))
    registrarAviso('upload_rejeitado', { ...contextoDaRequisicao(req), tipoInformado: arquivo.mimetype, tipoReal: tipo ?? 'desconhecido' })

    return next(requisicaoInvalida('O arquivo enviado não é uma imagem válida'))
  }

  next()
}
