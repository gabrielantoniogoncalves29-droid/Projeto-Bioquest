import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { config } from '../config.js'

const TAMANHO_MAXIMO = 5 * 1024 * 1024
const ARQUIVOS_ROTACIONADOS = 5
const SIGILOSO = /senha|token|secret|segredo|authorization|credencial|password|cookie/i

const arquivo = path.join(config.logsDir, 'seguranca.log')
let pastaPronta = false

export const resumirIdentificador = valor =>
  valor ? crypto.createHash('sha256').update(String(valor).toLowerCase()).digest('hex').slice(0, 12) : null

function limpar(campos) {
  const saida = {}

  for (const [chave, valor] of Object.entries(campos)) {
    if (SIGILOSO.test(chave) || valor === undefined) continue
    saida[chave] = typeof valor === 'string' ? valor.slice(0, 300) : valor
  }

  return saida
}

function rotacionarSePreciso() {
  let tamanho

  try {
    tamanho = fs.statSync(arquivo).size
  } catch {
    return
  }

  if (tamanho < TAMANHO_MAXIMO) return

  for (let i = ARQUIVOS_ROTACIONADOS - 1; i >= 1; i--) {
    if (fs.existsSync(`${arquivo}.${i}`)) fs.renameSync(`${arquivo}.${i}`, `${arquivo}.${i + 1}`)
  }

  fs.renameSync(arquivo, `${arquivo}.1`)
}

export function registrar(nivel, evento, campos = {}) {
  const linha = JSON.stringify({ ts: new Date().toISOString(), nivel, evento, ...limpar(campos) })

  if (config.ambiente !== 'test') process.stdout.write(`${linha}\n`)

  try {
    if (!pastaPronta) {
      fs.mkdirSync(config.logsDir, { recursive: true })
      pastaPronta = true
    }

    rotacionarSePreciso()
    fs.appendFileSync(arquivo, `${linha}\n`)
  } catch (erro) {
    process.stderr.write(`Falha ao gravar o log de segurança: ${erro.message}\n`)
  }
}

export const registrarInfo = (evento, campos) => registrar('info', evento, campos)
export const registrarAviso = (evento, campos) => registrar('aviso', evento, campos)
export const registrarErro = (evento, campos) => registrar('erro', evento, campos)

export const contextoDaRequisicao = req => ({
  ip: req.ip,
  metodo: req.method,
  rota: String(req.originalUrl ?? req.url).split('?')[0],
  usuarioId: req.usuarioId
})
