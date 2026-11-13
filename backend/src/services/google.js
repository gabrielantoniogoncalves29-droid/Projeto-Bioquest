import { OAuth2Client } from 'google-auth-library'
import { config } from '../config.js'
import { indisponivel, naoAutorizado } from '../utils/erros.js'

let cliente = null
let verificadorDeTeste = null

export function definirVerificadorGoogle(funcao) {
  verificadorDeTeste = funcao
}

export function googleConfigurado() {
  return Boolean(verificadorDeTeste) || Boolean(config.googleClientId)
}

export async function validarCredencialGoogle(credencial) {
  if (verificadorDeTeste) return verificadorDeTeste(credencial)

  if (!config.googleClientId) throw indisponivel('Login com Google não está configurado neste servidor')

  cliente ??= new OAuth2Client(config.googleClientId)

  let dados

  try {
    const ticket = await cliente.verifyIdToken({ idToken: credencial, audience: config.googleClientId })
    dados = ticket.getPayload()
  } catch {
    throw naoAutorizado('Credencial do Google inválida ou expirada')
  }

  if (!dados?.sub || !dados.email) throw naoAutorizado('Credencial do Google incompleta')
  if (dados.email_verified !== true) throw naoAutorizado('O e-mail da conta Google não está verificado')

  return { sub: dados.sub, email: dados.email.toLowerCase(), nome: dados.name || dados.email.split('@')[0] }
}
