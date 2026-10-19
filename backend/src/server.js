import { config } from './config.js'
import { inicializarBanco } from './db.js'
import { criarApp } from './app.js'

inicializarBanco()

criarApp().listen(config.porta, () => {
  console.log(`API em http://localhost:${config.porta}`)

  if (config.adminAtivo) {
    console.log(`Painel de questões em http://localhost:${config.porta}/admin`)
  }
})
