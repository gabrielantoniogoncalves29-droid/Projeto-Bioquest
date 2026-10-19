import { inicializarBanco } from '../src/db.js'
import { exportarTodas } from '../src/services/arquivosQuestoes.js'

inicializarBanco()

const { exportadas, ignoradas } = exportarTodas()

console.log(`Questões exportadas para db/questoes: ${exportadas}`)
console.log(`Ignoradas (só têm dados da planilha, nada a versionar): ${ignoradas}`)
