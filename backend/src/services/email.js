import nodemailer from 'nodemailer'
import { config } from '../config.js'
import { indisponivel } from '../utils/erros.js'

let transporte = null
let transporteDeTeste = null

export function smtpConfigurado() {
  return Boolean(config.smtp.host && config.smtp.from)
}

export function definirTransporteDeTeste(funcao) {
  transporteDeTeste = funcao
}

export function emailDisponivel() {
  return Boolean(transporteDeTeste) || smtpConfigurado()
}

function obterTransporte() {
  if (!transporte) {
    transporte = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined
    })
  }

  return transporte
}

export async function enviarEmail({ para, assunto, texto }) {
  if (transporteDeTeste) return transporteDeTeste({ para, assunto, texto })

  if (!smtpConfigurado()) {
    throw indisponivel('O envio de e-mails não está configurado neste servidor')
  }

  await obterTransporte().sendMail({ from: config.smtp.from, to: para, subject: assunto, text: texto })
}
