import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'
import { config } from '../config.js'

const EXTENSOES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
}

function criarUpload(subpasta, tamanhoMaximo, tiposPermitidos) {
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
    limits: { fileSize: tamanhoMaximo, files: 1 },
    fileFilter: (req, arquivo, cb) => {
      cb(null, tiposPermitidos.includes(arquivo.mimetype))
    }
  })
}

export const uploadImagemQuestao = criarUpload(
  'questoes',
  5 * 1024 * 1024,
  ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)

export const uploadFotoPerfil = criarUpload(
  'fotos',
  3 * 1024 * 1024,
  ['image/jpeg', 'image/png', 'image/webp']
)
