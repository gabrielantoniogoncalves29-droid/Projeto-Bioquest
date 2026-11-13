import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const pastaTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'bioquest-teste-'))

Object.assign(process.env, {
  NODE_ENV: 'test',
  DB_PATH: path.join(pastaTemp, 'teste.db'),
  UPLOADS_DIR: path.join(pastaTemp, 'uploads'),
  PASTA_QUESTOES: path.join(pastaTemp, 'exportadas'),
  PASTA_IMAGENS: path.join(pastaTemp, 'imagens-exportadas'),
  JWT_SECRET: 'segredo-de-teste-com-bem-mais-de-trinta-e-dois-caracteres',
  BCRYPT_ROUNDS: '4',
  RATE_LIMIT_AUTH_MAX: process.env.RATE_LIMIT_AUTH_MAX || '10000',
  RATE_LIMIT_EMAIL_MAX: process.env.RATE_LIMIT_EMAIL_MAX || '10000',
  RATE_LIMIT_LOGIN_MAX: process.env.RATE_LIMIT_LOGIN_MAX || '10000',
  RATE_LIMIT_CONTA_MAX: process.env.RATE_LIMIT_CONTA_MAX || '10000',
  RATE_LIMIT_FORUM_MAX: process.env.RATE_LIMIT_FORUM_MAX || '10000',
  RATE_LIMIT_CORRECAO_MAX: process.env.RATE_LIMIT_CORRECAO_MAX || '10000',
  RATE_LIMIT_UPLOAD_MAX: process.env.RATE_LIMIT_UPLOAD_MAX || '10000',
  RATE_LIMIT_ADMIN_MAX: process.env.RATE_LIMIT_ADMIN_MAX || '10000',
  ADMIN_ATIVO: 'true',
  ADMIN_SENHA: 'senha-admin-de-teste',
  FORUM_ABERTO: 'true',
  EXPORTAR_QUESTOES: 'true',
  GOOGLE_CLIENT_ID: '',
  SMTP_HOST: ''
})

const { db, inicializarBanco } = await import('../src/db.js')
const { criarApp } = await import('../src/app.js')
const email = await import('../src/services/email.js')
const google = await import('../src/services/google.js')
const { definirPalavrasDaQuestao } = await import('../src/services/palavrasChave.js')

export { db, email, google }

export const caixa = []
email.definirTransporteDeTeste(async mensagem => { caixa.push(mensagem) })

export function ultimoTokenPara(para) {
  const mensagem = [...caixa].reverse().find(m => m.para === para)
  return mensagem?.texto.match(/#token=([\w-]+)/)?.[1]
}

const QUESTOES = [
  { id: 1, ano: 2022, nivel: 1, objeto: 1, conteudo: 2, sub: 204, resumo: 'Proteínas e aminoácidos essenciais', kw: ['proteína', 'nutrição'], resposta: 'B' },
  { id: 2, ano: 2023, nivel: 2, objeto: 1, conteudo: 3, sub: 301, resumo: 'Membrana plasmática e transporte', kw: ['membrana'], resposta: 'A' },
  { id: 3, ano: 2023, nivel: 3, objeto: 4, conteudo: 17, sub: 1705, resumo: 'Relações ecológicas e competição', kw: ['ecologia', 'competição'], resposta: 'C' },
  { id: 4, ano: 2024, nivel: 1, objeto: 4, conteudo: 17, sub: 1705, resumo: 'Cadeia alimentar em um lago', kw: ['ecologia'], resposta: 'D' },
  { id: 5, ano: 2024, nivel: 2, objeto: 5, conteudo: 1, sub: 101, resumo: 'Origem da vida', kw: [], resposta: 'E' },
  { id: 6, ano: 2024, nivel: 2, objeto: 1, conteudo: 2, sub: 201, resumo: 'Questão sem alternativas', kw: [], resposta: 'A', semAlternativas: true }
]

function semearQuestoes() {
  for (const q of QUESTOES) {
    db.prepare(`
      INSERT INTO questoes (id, serial, ano, nivel_id, objeto_id, conteudo_id, subconteudo_id, resumo, resposta, comentario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(q.id, q.id, q.ano, q.nivel, q.objeto, q.conteudo, q.sub, q.resumo, q.resposta, `Comentário da ${q.id}`)

    if (!q.semAlternativas) {
      for (const letra of ['A', 'B', 'C', 'D', 'E']) {
        db.prepare('INSERT INTO alternativas (questao_id, letra, texto) VALUES (?, ?, ?)').run(q.id, letra, `Alternativa ${letra}`)
      }
    }

    definirPalavrasDaQuestao(q.id, q.kw)
  }
}

export async function iniciar({ semear = true } = {}) {
  inicializarBanco()
  if (semear) semearQuestoes()

  const servidor = criarApp().listen(0)
  await new Promise(resolver => servidor.once('listening', resolver))
  const url = `http://127.0.0.1:${servidor.address().port}`

  async function api(metodo, caminho, { token, corpo, form, cabecalhos = {} } = {}) {
    const opcoes = { method: metodo, headers: { ...cabecalhos } }
    if (token) opcoes.headers.Authorization = `Bearer ${token}`
    if (corpo !== undefined && metodo !== 'GET') {
      opcoes.headers['Content-Type'] = 'application/json'
      opcoes.body = JSON.stringify(corpo)
    }
    if (form) opcoes.body = form

    const resposta = await fetch(url + caminho, opcoes)
    const texto = await resposta.text()
    let dados = null
    try { dados = texto ? JSON.parse(texto) : null } catch { dados = texto }

    return { status: resposta.status, corpo: dados, cabecalhos: resposta.headers }
  }

  async function criarUsuario(nome, endereco, senha = 'senha-segura-1') {
    const cadastro = await api('POST', '/api/auth/cadastro', { corpo: { nome, email: endereco, senha } })
    if (cadastro.status !== 201) throw new Error(`cadastro falhou: ${JSON.stringify(cadastro.corpo)}`)

    const confirmacao = await api('POST', '/api/auth/confirmar-email', { corpo: { token: ultimoTokenPara(endereco) } })
    if (confirmacao.status !== 200) throw new Error('confirmação falhou')

    const login = await api('POST', '/api/auth/login', { corpo: { email: endereco, senha } })
    return { token: login.corpo.token, email: endereco, senha, id: db.prepare('SELECT id FROM usuarios WHERE email = ?').get(endereco).id }
  }

  return { api, url, criarUsuario, parar: () => new Promise(resolver => servidor.close(resolver)) }
}
