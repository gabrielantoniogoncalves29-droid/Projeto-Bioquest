import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

dotenv.config({ path: path.join(raiz, '.env'), quiet: true })

const ambiente = process.env.NODE_ENV || 'development'
const producao = ambiente === 'production'

function lista(valor) {
  return (valor || '')
    .split(',')
    .map(item => item.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

export const config = {
  raiz,
  ambiente,
  producao,
  porta: Number(process.env.PORT) || 3000,
  dbPath: path.resolve(raiz, process.env.DB_PATH || 'data/bioquest.db'),
  uploadsDir: path.resolve(raiz, process.env.UPLOADS_DIR || 'uploads'),
  frontendUrls: lista(process.env.FRONTEND_URL || 'http://localhost:5173'),
  adminAtivo: process.env.ADMIN_ATIVO
    ? process.env.ADMIN_ATIVO === 'true'
    : !producao,
  adminSenha: process.env.ADMIN_SENHA || '',
  exportarQuestoes: process.env.EXPORTAR_QUESTOES
    ? process.env.EXPORTAR_QUESTOES === 'true'
    : !producao,
  pastaQuestoes: path.join(raiz, 'db', 'questoes'),
  pastaImagens: path.join(raiz, 'db', 'imagens'),
  usuarioDemoId: 1,

  // Pontos de extensão para quando existir login:
  //  - forumAberto: libera POST de comentários (FORUM_ABERTO=true). O login deve
  //    ligar isso e passar a exigir usuário autenticado.
  //  - taxaAcertoAtiva: liga o cálculo do percentual de acertos por questão
  //    (services/questoes.js > calcularTaxaAcerto). Só faz sentido com muitos usuários.
  forumAberto: process.env.FORUM_ABERTO === 'true',
  taxaAcertoAtiva: false,
  minRespostasParaTaxa: 20
}
