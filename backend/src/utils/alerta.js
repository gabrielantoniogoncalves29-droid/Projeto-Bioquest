import { config } from '../config.js'

const INTERVALO_MINIMO_MS = 10 * 60 * 1000
const ultimos = new Map()

export function alertar(tipo, mensagem) {
  if (!config.alertaWebhookUrl) return

  const agora = Date.now()

  if (agora - (ultimos.get(tipo) ?? 0) < INTERVALO_MINIMO_MS) return

  ultimos.set(tipo, agora)

  fetch(config.alertaWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `[BioQuest] ${mensagem}`, content: `[BioQuest] ${mensagem}` }),
    signal: AbortSignal.timeout(5000)
  }).catch(() => {})
}
