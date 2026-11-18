import fs from 'node:fs'
import path from 'node:path'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { db, iniciar } from './helpers.js'
import { config } from '../src/config.js'

let s, ana

const basic = senha => ({ Authorization: `Basic ${Buffer.from(`admin:${senha}`).toString('base64')}` })
const admin = (metodo, caminho, opcoes = {}) => s.api(metodo, `/admin/api${caminho}`, { ...opcoes, cabecalhos: { ...basic('senha-admin-de-teste'), ...opcoes.cabecalhos } })

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')

const QUESTAO = {
  ano: 2025, nivelId: 2, conteudoId: 3, subconteudoId: 301, objetoId: 1,
  resumo: 'Questão com imagens nas alternativas',
  enunciadoTexto: 'Enunciado da questão com alternativas em imagem.',
  alternativaA: 'Só texto', alternativaB: '', alternativaC: 'Texto e imagem', alternativaD: 'Outra', alternativaE: 'Última',
  resposta: 'C', comentario: 'Comentário da questão com imagens', teoria: 'Teoria'
}

function formulario(campos, arquivos = {}) {
  const form = new FormData()
  Object.entries(campos).forEach(([chave, valor]) => form.append(chave, valor))
  Object.entries(arquivos).forEach(([campo, nome]) => form.append(campo, new Blob([PNG], { type: 'image/png' }), nome))
  return form
}

before(async () => {
  s = await iniciar()
  ana = await s.criarUsuario('Ana Souza', 'ana@teste.com')
})
after(() => s.parar())

test('sem conta: corrige no servidor e não grava nada', async () => {
  const certa = await s.api('POST', '/api/questoes/1/corrigir', { corpo: { alternativa: 'B' } })
  assert.equal(certa.status, 200)
  assert.deepEqual({ correta: certa.corpo.correta, resposta: certa.corpo.resposta }, { correta: true, resposta: 'B' })
  assert.equal(certa.corpo.comentario, 'Comentário da 1')

  const errada = await s.api('POST', '/api/questoes/1/corrigir', { corpo: { alternativa: 'A' } })
  assert.equal(errada.corpo.correta, false)

  assert.equal(db.prepare('SELECT COUNT(*) n FROM respostas').get().n, 0)
  assert.equal(db.prepare('SELECT COUNT(*) n FROM tentativas').get().n, 0)
})

test('sem conta: entradas inválidas são recusadas', async () => {
  assert.equal((await s.api('POST', '/api/questoes/1/corrigir', { corpo: { alternativa: 'Z' } })).status, 400)
  assert.equal((await s.api('POST', '/api/questoes/1/corrigir', { corpo: {} })).status, 400)
  assert.equal((await s.api('POST', '/api/questoes/999/corrigir', { corpo: { alternativa: 'A' } })).status, 404)
  assert.equal((await s.api('POST', '/api/questoes/6/corrigir', { corpo: { alternativa: 'A' } })).status, 400)
})

test('o gabarito e o comentário só saem na explicação depois de responder', async () => {
  const antes = (await s.api('GET', '/api/questoes/2/explicacao', { token: ana.token })).corpo
  assert.deepEqual({ liberada: antes.liberada, resposta: antes.resposta, comentario: antes.comentario }, { liberada: false, resposta: null, comentario: '' })

  await s.api('POST', '/api/questoes/2/resposta', { token: ana.token, corpo: { alternativa: 'C' } })

  const depois = (await s.api('GET', '/api/questoes/2/explicacao', { token: ana.token })).corpo
  assert.deepEqual({ liberada: depois.liberada, resposta: depois.resposta }, { liberada: true, resposta: 'A' })

  const anonima = (await s.api('GET', '/api/questoes/2/explicacao')).corpo
  assert.equal(anonima.resposta, null)
})

test('token inválido na explicação é tratado como visitante', async () => {
  const r = await s.api('GET', '/api/questoes/2/explicacao', { token: 'invalido' })
  assert.equal(r.status, 200)
  assert.equal(r.corpo.resposta, null)
})

test('questão sem alternativas não pode ser resolvida, então a explicação é liberada', async () => {
  const e = (await s.api('GET', '/api/questoes/6/explicacao')).corpo
  assert.equal(e.liberada, true)
  assert.equal(e.resposta, 'A')
})

test('comentários: visitante lê mas não escreve; a foto do autor acompanha o comentário', async () => {
  assert.equal((await s.api('POST', '/api/questoes/1/comentarios', { corpo: { texto: 'oi' } })).status, 401)

  const criado = await s.api('POST', '/api/questoes/1/comentarios', { token: ana.token, corpo: { texto: 'Meu comentário' } })
  assert.equal(criado.status, 201)
  assert.equal(criado.corpo.foto, null)

  db.prepare('UPDATE usuarios SET foto = ? WHERE id = ?').run('/uploads/fotos/ana.png', ana.id)

  const lista = (await s.api('GET', '/api/questoes/1/comentarios')).corpo
  assert.equal(lista[0].foto, '/uploads/fotos/ana.png')
})

test('alternativas com imagem: cadastro, leitura pública, troca e remoção', async () => {
  const criada = await admin('POST', '/questoes', {
    form: formulario(QUESTAO, { imagemAlternativaB: 'b.png', imagemAlternativaC: 'c.png' })
  })
  assert.equal(criada.status, 201, JSON.stringify(criada.corpo))

  const id = criada.corpo.id
  assert.deepEqual(Object.keys(criada.corpo.alternativasImagens).sort(), ['B', 'C'])

  const publica = (await s.api('GET', `/api/questoes/${id}`)).corpo
  assert.deepEqual(publica.alternativas.map(a => a.letra), ['A', 'B', 'C', 'D', 'E'])

  const b = publica.alternativas.find(a => a.letra === 'B')
  assert.equal(b.texto, '')
  assert.match(b.imagem, /^\/uploads\/questoes\//)
  assert.equal(publica.alternativas.find(a => a.letra === 'A').imagem, '')

  const servida = await fetch(s.url + b.imagem)
  assert.equal(servida.status, 200)
  assert.match(servida.headers.get('content-type'), /image\/png/)

  const arquivoB = path.join(config.uploadsDir, 'questoes', path.basename(b.imagem))
  assert.ok(fs.existsSync(arquivoB))

  const mantida = await admin('PUT', `/questoes/${id}`, { corpo: { ...QUESTAO, resumo: 'Editada sem tocar nas imagens' } })
  assert.equal(mantida.status, 200)
  assert.equal(mantida.corpo.alternativasImagens.B, b.imagem, 'editar o texto não perde a imagem')

  const trocada = await admin('PUT', `/questoes/${id}`, { form: formulario(QUESTAO, { imagemAlternativaB: 'nova.png' }) })
  assert.notEqual(trocada.corpo.alternativasImagens.B, b.imagem)
  assert.equal(fs.existsSync(arquivoB), false, 'imagem substituída é apagada')

  const arquivoC = path.join(config.uploadsDir, 'questoes', path.basename(trocada.corpo.alternativasImagens.C))
  const removida = await admin('PUT', `/questoes/${id}`, { corpo: { ...QUESTAO, removerImagemAlternativaC: '1' } })
  assert.equal(removida.corpo.alternativasImagens.C, undefined)
  assert.equal(fs.existsSync(arquivoC), false, 'imagem removida é apagada')

  const semTexto = await admin('PUT', `/questoes/${id}`, { corpo: { ...QUESTAO, removerImagemAlternativaB: '1' } })
  assert.equal(Object.keys(semTexto.corpo.alternativas).includes('B'), false, 'alternativa sem texto e sem imagem deixa de existir')
})

test('alternativas com imagem por URL e URL inválida', async () => {
  const ruim = await admin('POST', '/questoes', { corpo: { ...QUESTAO, imagemUrlAlternativaB: 'javascript:alert(1)' } })
  assert.equal(ruim.status, 400)

  const boa = await admin('POST', '/questoes', { corpo: { ...QUESTAO, imagemUrlAlternativaB: 'https://exemplo.com/b.png' } })
  assert.equal(boa.status, 201)
  assert.equal(boa.corpo.alternativasImagens.B, 'https://exemplo.com/b.png')
})

test('arquivo que não é imagem em alternativa é ignorado', async () => {
  const form = formulario(QUESTAO)
  form.append('imagemAlternativaB', new Blob(['texto'], { type: 'text/plain' }), 'b.txt')

  const r = await admin('POST', '/questoes', { form })
  assert.equal(r.status, 201)
  assert.equal(r.corpo.alternativasImagens.B, undefined)
})

test('excluir a questão apaga as imagens das alternativas', async () => {
  const criada = await admin('POST', '/questoes', { form: formulario(QUESTAO, { imagemAlternativaD: 'd.png' }) })
  const arquivo = path.join(config.uploadsDir, 'questoes', path.basename(criada.corpo.alternativasImagens.D))
  assert.ok(fs.existsSync(arquivo))

  assert.equal((await admin('DELETE', `/questoes/${criada.corpo.id}`)).status, 204)
  assert.equal(fs.existsSync(arquivo), false)
})

test('exportar e importar mantém as imagens das alternativas', async () => {
  const criada = await admin('POST', '/questoes', { form: formulario(QUESTAO, { imagemAlternativaE: 'e.png' }) })
  const id = criada.corpo.id

  await admin('POST', '/exportar')

  const json = JSON.parse(fs.readFileSync(path.join(config.pastaQuestoes, `${String(id).padStart(4, '0')}.json`), 'utf8'))
  assert.match(json.alternativasImagem.E, /-E\.png$/)
  assert.ok(fs.existsSync(path.join(config.pastaImagens, json.alternativasImagem.E)))
})
