import { config } from './config.js'
import { inicializarBanco } from './db.js'
import { criarApp } from './app.js'
import { verificarSaude } from './services/saude.js'
import { alertar } from './utils/alerta.js'
import { registrarErro, registrarInfo } from './utils/log.js'
import { criarBackup } from './services/backup.js'

inicializarBanco()

const DEZ_MINUTOS = 10 * 60 * 1000

setInterval(() => {
  const saude = verificarSaude()

  if (!saude.ok) {
    registrarErro('saude_critica', { banco: saude.banco.ok, armazenamento: saude.armazenamento.ok, livreBytes: saude.armazenamento.livreBytes })
    alertar('saude_critica', 'A verificação de saúde falhou (banco ou armazenamento).')
  } else if (saude.avisos.includes('backup_ausente_ou_antigo')) {
    alertar('backup', 'Nenhum backup recente do banco foi encontrado.')
  }
}, DEZ_MINUTOS).unref()

const UM_DIA = 24 * 60 * 60 * 1000

function backupDiario() {
  try {
    const { arquivo } = criarBackup()
    registrarInfo('backup_ok', { arquivo })
  } catch (erro) {
    registrarErro('backup_falhou', { mensagem: erro.message })
    alertar('backup_falhou', `Falha ao criar o backup do banco: ${erro.message.slice(0, 200)}`)
  }
}

if (config.producao && process.env.BACKUP_AUTOMATICO !== 'false') {
  setTimeout(backupDiario, 60 * 1000).unref()
  setInterval(backupDiario, UM_DIA).unref()
}

process.on('uncaughtException', erro => {
  registrarErro('excecao_nao_tratada', { mensagem: erro.message })
  alertar('excecao', `Exceção não tratada: ${erro.message.slice(0, 200)}`)
  process.exit(1)
})

process.on('unhandledRejection', erro => {
  registrarErro('promessa_rejeitada', { mensagem: String(erro?.message ?? erro) })
})

criarApp().listen(config.porta, () => {
  console.log(`API em http://localhost:${config.porta}`)

  if (config.adminAtivo) {
    console.log(`Painel de questões em http://localhost:${config.porta}/admin`)
  }
})
