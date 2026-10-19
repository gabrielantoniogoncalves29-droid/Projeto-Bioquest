// Verificação ponta a ponta da API + painel admin (usa HTTP de verdade).
//
//   1) npm run seed:reset && npm run dev        (em outro terminal)
//   2) npm run verificar                        (API=http://localhost:3000 por padrão)
//
// Só rode em desenvolvimento: usa o usuário demo (salva, marca, responde) e cria/edita
// questões pelo admin. Ao final desfaz o que dá para desfazer (questão criada, salvas,
// revisar, edição da questão 1). As respostas do usuário demo (questão 1) ficam no banco;
// "npm run seed:reset" zera tudo. Se ADMIN_SENHA estiver definida, ela é enviada.
import fs from 'node:fs'
import assert from 'node:assert/strict'

const BASE = (process.env.API ?? 'http://localhost:3000').replace(/\/+$/, '')
const planilha = JSON.parse(
  fs.readFileSync(new URL('../db/seed-data/questoes.json', import.meta.url), 'utf8')
)

const cabecalhoAdmin = process.env.ADMIN_SENHA
  ? { Authorization: `Basic ${Buffer.from(`admin:${process.env.ADMIN_SENHA}`).toString('base64')}` }
  : {}

let passou = 0
const falhas = []

async function teste(nome, fn) {
  try {
    await fn()
    passou++
    console.log(`  ✔ ${nome}`)
  } catch (erro) {
    falhas.push(nome)
    console.log(`  ✘ ${nome}\n      ${String(erro.message).split('\n')[0]}`)
  }
}

async function http(caminho, opcoes = {}) {
  const resposta = await fetch(BASE + caminho, opcoes)
  const texto = await resposta.text()
  let json
  try { json = JSON.parse(texto) } catch { json = undefined }
  return { status: resposta.status, json, texto, headers: resposta.headers }
}

const get = caminho => http(caminho)
const admin = (caminho, opcoes = {}) =>
  http(`/admin/api${caminho}`, { ...opcoes, headers: { ...cabecalhoAdmin, ...(opcoes.headers ?? {}) } })

function formulario(campos, arquivo) {
  const dados = new FormData()
  for (const [chave, valor] of Object.entries(campos)) dados.append(chave, valor ?? '')
  if (arquivo) dados.append('imagem', arquivo, 'teste.png')
  return dados
}

// PNG 1x1 válido
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)
const blobPng = () => new Blob([PNG], { type: 'image/png' })

const idsOrdenados = lista => lista.map(q => q.id).sort((a, b) => a - b)
const sub = l => l.objetoLivroId * 100 + Number(l.conteudoCodigo.slice(1))

function oraculo(f) {
  return planilha
    .filter(l =>
      (!f.ano || f.ano.includes(l.ano)) &&
      (!f.nivel || f.nivel.includes(l.categorizacao)) &&
      (!f.objeto || f.objeto.includes(l.objetoMatrizId)) &&
      (!f.conteudo || f.conteudo.includes(l.objetoLivroId)) &&
      (!f.subconteudo || f.subconteudo.includes(sub(l)))
    )
    .map(l => l.questaoId)
    .sort((a, b) => a - b)
}

const consulta = f =>
  Object.entries(f).map(([k, v]) => `${k}=${encodeURIComponent(Array.isArray(v) ? v.join(',') : v)}`).join('&')

let semente = 12345
const aleatorio = () => (semente = (semente * 1664525 + 1013904223) % 4294967296) / 4294967296
const sorteio = (lista, n) => [...lista].sort(() => aleatorio() - 0.5).slice(0, n)

const criadas = []
let original1 = null

console.log(`\nVerificando ${BASE}\n`)

console.log('Banco e taxonomia')
await teste('GET /api/questoes devolve as 183 questões da planilha', async () => {
  const { status, json } = await get('/api/questoes')
  assert.equal(status, 200)
  assert.equal(json.filter(q => q.id <= 183).length, 183)
  assert.deepEqual(idsOrdenados(json.filter(q => q.id <= 183)), planilha.map(l => l.questaoId).sort((a, b) => a - b))
})

await teste('card tem os campos de id/nome e nenhum gabarito', async () => {
  const { json } = await get('/api/questoes')
  const c = json.find(q => q.id === 1)
  for (const campo of ['id', 'ano', 'nivel', 'dificuldade', 'objetoId', 'conteudoId', 'subconteudoId', 'subconteudo', 'conteudoNome', 'resumo', 'palavrasChave', 'temAlternativas']) {
    assert.ok(campo in c, `falta ${campo}`)
  }
  assert.ok(!('resposta' in c) && !('gabarito' in c))
  assert.equal(c.temAlternativas, false)
})

await teste('GET /api/taxonomia: 12 anos, 18 conteúdos, 6 eixos, 3 níveis, subconteúdos com C#', async () => {
  const { json } = await get('/api/taxonomia')
  assert.equal(json.anos.length, 12)
  assert.equal(json.conteudos.length, 18)
  assert.equal(json.eixos.length, 6)
  assert.equal(json.niveis.length, 3)
  const metab = json.conteudos.find(c => c.id === 4)
  assert.deepEqual(metab.subconteudos.map(s => s.codigo), ['C1', 'C2', 'C3'])
  assert.equal(metab.subconteudos[0].id, 401)
})

await teste('Respiração aeróbica e Produção de ATP caem no mesmo subconteúdo (401)', async () => {
  const { json } = await get('/api/questoes?subconteudo=401')
  const esperado = planilha.filter(l => l.objetoLivroId === 4 && l.conteudoCodigo === 'C1').map(l => l.questaoId)
  assert.deepEqual(idsOrdenados(json), esperado.sort((a, b) => a - b))
  const nomes = new Set(planilha.filter(l => esperado.includes(l.questaoId)).map(l => l.conteudoNome))
  assert.ok(nomes.has('Respiração aeróbica') && nomes.has('Produção de ATP'))
})

console.log('\nFiltros (comparados com um oráculo calculado direto da planilha)')
const universo = {
  ano: [...new Set(planilha.map(l => l.ano))],
  nivel: [1, 2, 3],
  objeto: [1, 2, 3, 4, 5, 6],
  conteudo: [...new Set(planilha.map(l => l.objetoLivroId))],
  subconteudo: [...new Set(planilha.map(sub))]
}

for (const grupo of Object.keys(universo)) {
  await teste(`filtro "${grupo}" isolado (cada valor)`, async () => {
    for (const valor of universo[grupo]) {
      const { json } = await get(`/api/questoes?${grupo}=${valor}`)
      const esperado = oraculo({ [grupo]: [valor] })
      assert.deepEqual(idsOrdenados(json.filter(q => q.id <= 183)), esperado, `${grupo}=${valor}`)
    }
  })
}

await teste('eixo (objeto da matriz) usa a coluna da própria questão, não o conteúdo', async () => {
  const conteudos = [...new Set(planilha.map(l => l.objetoLivroId))].filter(c =>
    new Set(planilha.filter(l => l.objetoLivroId === c).map(l => l.objetoMatrizId)).size > 1
  )
  assert.ok(conteudos.length > 0, 'a planilha deveria ter conteúdo(s) em mais de um eixo')

  for (const c of conteudos) {
    for (const e of universo.objeto) {
      const { json } = await get(`/api/questoes?conteudo=${c}&objeto=${e}`)
      assert.deepEqual(idsOrdenados(json.filter(q => q.id <= 183)), oraculo({ conteudo: [c], objeto: [e] }), `conteudo=${c} objeto=${e}`)
    }
  }
})

await teste('40 combinações aleatórias (E entre grupos, OU dentro do grupo)', async () => {
  for (let i = 0; i < 40; i++) {
    const f = {}
    for (const grupo of sorteio(Object.keys(universo), 1 + Math.floor(aleatorio() * 4))) {
      f[grupo] = sorteio(universo[grupo], 1 + Math.floor(aleatorio() * 3))
    }
    const { json } = await get(`/api/questoes?${consulta(f)}`)
    assert.deepEqual(idsOrdenados(json.filter(q => q.id <= 183)), oraculo(f), JSON.stringify(f))
  }
})

await teste('/api/questoes/ids = ids de /api/questoes com os mesmos parâmetros e mesma ordem', async () => {
  for (const ordem of ['recentes', 'antigas', 'maiorDificuldade', 'menorDificuldade']) {
    const q = `ano=2016,2019&nivel=2,3&ordem=${ordem}&q=ecologia`
    const a = await get(`/api/questoes?${q}`)
    const b = await get(`/api/questoes/ids?${q}`)
    assert.deepEqual(b.json, a.json.map(c => c.id), ordem)
  }
})

await teste('parâmetro inválido -> 400 amigável', async () => {
  assert.equal((await get('/api/questoes?ano=abc')).status, 400)
  assert.equal((await get('/api/questoes?ordem=xyz')).status, 400)
})

console.log('\nOrdenação')
const antes = (a, b) => a < b
await teste('recentes / antigas: ano e desempate por serial', async () => {
  const rec = (await get('/api/questoes?ordem=recentes')).json
  const ant = (await get('/api/questoes?ordem=antigas')).json
  for (let i = 1; i < rec.length; i++) {
    assert.ok(rec[i - 1].ano > rec[i].ano || (rec[i - 1].ano === rec[i].ano && rec[i - 1].serial < rec[i].serial), `recentes @${i}`)
    assert.ok(ant[i - 1].ano < ant[i].ano || (ant[i - 1].ano === ant[i].ano && ant[i - 1].serial < ant[i].serial), `antigas @${i}`)
  }
})

await teste('maior / menor dificuldade por id do nível (3>2>1)', async () => {
  const maior = (await get('/api/questoes?ordem=maiorDificuldade')).json.filter(q => q.id <= 183)
  const menor = (await get('/api/questoes?ordem=menorDificuldade')).json.filter(q => q.id <= 183)
  for (let i = 1; i < maior.length; i++) {
    assert.ok(maior[i - 1].nivel >= maior[i].nivel, `maior @${i}`)
    assert.ok(menor[i - 1].nivel <= menor[i].nivel, `menor @${i}`)
  }
  assert.equal(maior[0].nivel, 3)
  assert.equal(menor[0].nivel, 1)
})

console.log('\nPesquisa e autocomplete')
await teste('pesquisa por id (com e sem #)', async () => {
  for (const q of ['12', '#12']) {
    const { json } = await get(`/api/questoes?q=${encodeURIComponent(q)}`)
    assert.ok(json.some(c => c.id === 12), q)
  }
})

await teste('pesquisa sem acento / sem diferenciar caixa', async () => {
  const a = (await get('/api/questoes?q=PROTEINAS')).json
  const b = (await get(`/api/questoes?q=${encodeURIComponent('proteínas')}`)).json
  assert.ok(a.length > 0)
  assert.deepEqual(a.map(c => c.id), b.map(c => c.id))
})

await teste('várias palavras = todas precisam casar (AND)', async () => {
  const so1 = (await get('/api/questoes?q=ecologia')).json
  const dois = (await get('/api/questoes?q=ecologia+competicao')).json
  assert.ok(dois.length > 0 && dois.length < so1.length)
  const ids1 = new Set(so1.map(c => c.id))
  assert.ok(dois.every(c => ids1.has(c.id)))
})

await teste('pesquisa por ano e por nome do objeto da matriz', async () => {
  const ano = (await get('/api/questoes?q=2019')).json
  assert.ok(ano.length >= 15 && ano.some(c => c.ano === 2019))
  const eixo = (await get(`/api/questoes?q=${encodeURIComponent('qualidade de vida')}`)).json
  assert.ok(eixo.length >= 9)
})

await teste('autocomplete traz termos de conteúdo (sem parênteses) e de observações', async () => {
  const a = (await get('/api/palavras-chave?q=prote')).json
  assert.ok(a.includes('Proteínas'), `conteúdo: ${a}`)
  const b = (await get(`/api/palavras-chave?q=${encodeURIComponent('aminoacidos')}`)).json
  assert.ok(b.some(t => t.includes('aminoácidos')), `observações: ${b}`)
  assert.ok(a.length <= 8)
  assert.deepEqual((await get('/api/palavras-chave?q=p')).json, [])
})

await teste('autocomplete: "começa com" antes de "contém"', async () => {
  const lista = (await get('/api/palavras-chave?q=cel')).json
  const normal = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const primeiroSemPrefixo = lista.findIndex(t => !normal(t).startsWith('cel'))
  if (primeiroSemPrefixo !== -1) {
    assert.ok(lista.slice(primeiroSemPrefixo).every(t => !normal(t).startsWith('cel')), lista.join(' | '))
  }
})

await teste('"Câncer; mitose; divisão celular" vira 3 termos (com o conteúdo, dedupe sem acento/caixa)', async () => {
  const linha = planilha.find(l => l.observacoes.startsWith('Câncer; mitose'))
  const q = (await admin(`/questoes/${linha.questaoId}`)).json
  const normal = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  assert.deepEqual(q.palavrasChave.map(normal), ['divisao celular', 'cancer', 'mitose'], String(q.palavrasChave))
  const a = (await get(`/api/palavras-chave?q=${encodeURIComponent('canc')}`)).json
  assert.ok(a.includes('Câncer'), String(a))
})

console.log('\nAdmin')
await teste('painel abre e traz <select> de alternativa correta (sem radios)', async () => {
  const { status, texto } = await http('/admin/', { headers: cabecalhoAdmin })
  assert.equal(status, 200)
  assert.ok(texto.includes('name="resposta"') && texto.includes('<select'))
  assert.ok(!/type="radio"/.test(texto) && !/\brequired\b/.test(texto))
})

await teste('questão em branco (só id) é criada e aparece na lista pública', async () => {
  const { status, json } = await admin('/questoes', { method: 'POST', body: formulario({}) })
  assert.equal(status, 201, JSON.stringify(json))
  criadas.push(json.id)
  assert.ok(json.id >= 184, `id = ${json.id}`)
  assert.equal(json.resposta, null)
  const lista = (await get('/api/questoes')).json
  const card = lista.find(c => c.id === json.id)
  assert.ok(card && card.resumo === `Questão ${json.id}`, card?.resumo)
  assert.equal(card.ano, null)
})

await teste('questão em branco editada de novo (PUT) continua funcionando', async () => {
  const id = criadas[0]
  const { status } = await admin(`/questoes/${id}`, { method: 'PUT', body: formulario({}) })
  assert.equal(status, 200)
})

await teste('tipo inválido continua sendo recusado e id repetido dá 409', async () => {
  const ruim = await admin('/questoes', { method: 'POST', body: formulario({ ano: 'abc' }) })
  assert.equal(ruim.status, 400)
  const dup = await admin('/questoes', { method: 'POST', body: formulario({ id: 1 }) })
  assert.equal(dup.status, 409)
  const url = await admin('/questoes', { method: 'POST', body: formulario({ imagemUrl: 'ftp://x' }) })
  assert.equal(url.status, 400)
})

await teste('gabarito vem da planilha no admin, com alternativas vazias', async () => {
  const { json } = await admin('/questoes/1')
  assert.equal(json.resposta, planilha[0].gabarito)
  assert.deepEqual(json.alternativas, {})
  assert.equal(json.planilha.conteudoCodigo, 'C4')
  assert.equal(json.planilha.objetoLivroNome, 'Bioquímica')
  assert.deepEqual(json.palavrasChave, ['Proteínas', 'Aspectos nutricionais', 'aminoácidos naturais e essenciais'])
  original1 = json
})

await teste('salvar sem textos de alternativas mantém o gabarito', async () => {
  const q = original1
  const corpo = {
    id: '', ano: q.ano, banca: q.banca, prova: q.prova, numeroQuestao: q.numeroQuestao,
    nivelId: q.nivelId, conteudoId: q.conteudoId, subconteudoId: q.subconteudoId, objetoId: q.objetoId,
    resposta: q.resposta, palavrasChave: q.palavrasChave.join('; ')
  }
  const { status, json } = await admin('/questoes/1', { method: 'PUT', body: formulario(corpo) })
  assert.equal(status, 200, JSON.stringify(json))
  assert.equal(json.resposta, q.resposta)
  assert.deepEqual(json.palavrasChave, q.palavrasChave)
})

const enunciado1 = 'Texto de teste do enunciado <b>com html</b>'
await teste('enunciado + imagem + alternativas salvos na questão 1 aparecem na hora no front', async () => {
  const q = original1
  const corpo = {
    ano: q.ano, banca: q.banca, prova: q.prova, numeroQuestao: q.numeroQuestao,
    nivelId: q.nivelId, conteudoId: q.conteudoId, subconteudoId: q.subconteudoId, objetoId: q.objetoId,
    resposta: q.resposta, enunciadoTexto: enunciado1, enunciadoComplemento: 'Complemento', imagemAlt: 'alt teste',
    alternativaA: 'Alt A', alternativaB: 'Alt B', alternativaC: 'Alt C', alternativaD: 'Alt D', alternativaE: 'Alt E',
    palavrasChave: 'um; dois, com vírgula; Um'
  }
  const salvo = await admin('/questoes/1', { method: 'PUT', body: formulario(corpo, blobPng()) })
  assert.equal(salvo.status, 200, JSON.stringify(salvo.json))
  assert.match(salvo.json.imagem, /^\/uploads\/questoes\//)
  assert.deepEqual(salvo.json.palavrasChave, ['um', 'dois, com vírgula'])

  const publico = await get('/api/questoes/1')
  assert.equal(publico.json.enunciado.textoPrincipal, enunciado1)
  assert.equal(publico.json.enunciado.imagem, salvo.json.imagem)
  assert.equal(publico.json.alternativas.length, 5)
  assert.equal(publico.json.temAlternativas, true)
  assert.ok(!('resposta' in publico.json), 'GET /:id não pode ter gabarito')

  const imagem = await fetch(BASE + salvo.json.imagem)
  assert.equal(imagem.status, 200)

  const card = (await get('/api/questoes')).json.find(c => c.id === 1)
  assert.equal(card.temAlternativas, true)
  assert.deepEqual(card.palavrasChave, ['um', 'dois, com vírgula'])
})

await teste('trocar a imagem apaga o arquivo antigo; remover limpa o campo', async () => {
  const antiga = (await admin('/questoes/1')).json.imagem
  const corpo = { ...camposDe(original1), enunciadoTexto: enunciado1, alternativaA: 'Alt A', alternativaB: 'Alt B', alternativaC: 'Alt C', alternativaD: 'Alt D', alternativaE: 'Alt E' }
  const trocada = await admin('/questoes/1', { method: 'PUT', body: formulario(corpo, blobPng()) })
  assert.notEqual(trocada.json.imagem, antiga)
  assert.equal((await fetch(BASE + antiga)).status, 404, 'arquivo antigo deveria ter sido apagado')
  const removida = await admin('/questoes/1', { method: 'PUT', body: formulario({ ...corpo, removerImagem: '1' }) })
  assert.equal(removida.json.imagem, '')
  assert.equal((await fetch(BASE + trocada.json.imagem)).status, 404)
})

function camposDe(q) {
  return {
    ano: q.ano, banca: q.banca, prova: q.prova, numeroQuestao: q.numeroQuestao,
    nivelId: q.nivelId, conteudoId: q.conteudoId, subconteudoId: q.subconteudoId, objetoId: q.objetoId,
    resposta: q.resposta, palavrasChave: q.palavrasChave.join('; ')
  }
}

console.log('\nResolver')
await teste('sem alternativas: responder -> 400 com mensagem clara', async () => {
  const { status, json } = await http('/api/questoes/2/resposta', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alternativa: 'A' })
  })
  assert.equal(status, 400)
  assert.match(json.erro, /alternativas/i)
})

const gabarito1 = planilha[0].gabarito
const errada1 = ['A', 'B', 'C', 'D', 'E'].find(l => l !== gabarito1)
const postarResposta = (id, alternativa) => http(`/api/questoes/${id}/resposta`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alternativa })
})

await teste('acerto e erro devolvem correta/resposta; letra inválida -> 400', async () => {
  const ruim = await postarResposta(1, errada1)
  assert.equal(ruim.status, 200)
  assert.equal(ruim.json.correta, false)
  assert.equal(ruim.json.resposta, gabarito1)
  const boa = await postarResposta(1, gabarito1)
  assert.equal(boa.json.correta, true)
  assert.equal((await postarResposta(1, 'Z')).status, 400)
})

await teste('minha-resposta restaura o estado respondido', async () => {
  const { json } = await get('/api/questoes/1/minha-resposta')
  assert.equal(json.alternativa, gabarito1)
  assert.equal(json.correta, true)
  assert.equal((await get('/api/questoes/3/minha-resposta')).json, null)
})

await teste('percentual de acertos não é exposto nem muda ao responder', async () => {
  const a = (await get('/api/questoes/1')).json.taxaAcerto
  await postarResposta(1, errada1)
  await postarResposta(1, gabarito1)
  assert.equal(a, null)
  assert.equal((await get('/api/questoes/1')).json.taxaAcerto, null)
})

await teste('/explicacao traz o gabarito', async () => {
  assert.equal((await get('/api/questoes/1/explicacao')).json.resposta, gabarito1)
})

await teste('gabarito vazio -> 409 amigável', async () => {
  const id = criadas[0]
  const corpo = { alternativaA: 'x', alternativaB: 'y' }
  await admin(`/questoes/${id}`, { method: 'PUT', body: formulario(corpo) })
  const { status, json } = await postarResposta(id, 'A')
  assert.equal(status, 409)
  assert.match(json.erro, /gabarito/i)
})

console.log('\nSalvar / revisar / perfil / estados')
const put = (caminho, metodo = 'PUT') => http(caminho, { method: metodo })

await teste('salvar e revisar são idempotentes (204) e desfazem', async () => {
  for (const rota of ['salvar', 'revisar']) {
    assert.equal((await put(`/api/questoes/5/${rota}`)).status, 204)
    assert.equal((await put(`/api/questoes/5/${rota}`)).status, 204)
  }
  assert.equal((await put('/api/questoes/999999/salvar')).status, 404)
})

await teste('perfil lista salvas/revisar/resolvidas com os cards novos', async () => {
  await put('/api/questoes/6/revisar')
  const { json } = await get('/api/perfil')
  const salva = json.questoesSalvas.find(q => q.id === 5)
  assert.ok(salva && 'objetoId' in salva && 'subconteudoId' in salva)
  assert.ok(json.questoesRevisar.some(q => q.id === 5) && json.questoesRevisar.some(q => q.id === 6))
  assert.ok(json.questoesResolvidas.some(q => q.id === 1))
})

await teste('filtro de estado no servidor: respondidas, salvas, revisar, não respondidas', async () => {
  const ids = async e => (await get(`/api/questoes/ids?estado=${e}`)).json
  assert.ok((await ids(1)).includes(1))
  assert.ok((await ids(2)).includes(5))
  assert.ok((await ids(3)).includes(5) && (await ids(3)).includes(6))
  assert.ok(!(await ids(4)).includes(1) && (await ids(4)).includes(2))
})

await teste('desfazer remove dos três lugares', async () => {
  await put('/api/questoes/5/salvar', 'DELETE')
  await put('/api/questoes/5/revisar', 'DELETE')
  await put('/api/questoes/6/revisar', 'DELETE')
  const { json } = await get('/api/perfil')
  assert.ok(!json.questoesSalvas.some(q => q.id === 5))
  assert.ok(!json.questoesRevisar.some(q => [5, 6].includes(q.id)))
  assert.ok(!(await get('/api/questoes/ids?estado=2')).json.includes(5))
  assert.ok(!(await get('/api/questoes/ids?estado=3')).json.some(id => [5, 6].includes(id)))
})

console.log('\nFórum, cache e robustez')
await teste('comentários: lista vazia, POST bloqueado (401)', async () => {
  const lista = await get('/api/questoes/1/comentarios')
  assert.equal(lista.status, 200)
  assert.deepEqual(lista.json, [])
  const { status, json } = await http('/api/questoes/1/comentarios', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: 'oi' })
  })
  assert.equal(status, 401)
  assert.match(json.erro, /login/i)
})

await teste('em desenvolvimento os GETs não são cacheados', async () => {
  const { headers } = await get('/api/questoes')
  assert.match(headers.get('cache-control') ?? '', /no-store/)
})

await teste('id inválido -> 400, inexistente -> 404, rota inexistente -> 404 JSON', async () => {
  assert.equal((await get('/api/questoes/abc')).status, 400)
  assert.equal((await get('/api/questoes/99999')).status, 404)
  assert.equal((await get('/api/nao-existe')).status, 404)
})

// ---- limpeza ----
for (const id of criadas) await admin(`/questoes/${id}`, { method: 'DELETE' })

if (original1) {
  const restaurar = { ...camposDe(original1), palavrasChave: original1.palavrasChave.join('; ') }
  await admin('/questoes/1', { method: 'PUT', body: formulario(restaurar) })
}

console.log(`\n${passou} testes passaram, ${falhas.length} falharam.`)
if (falhas.length) {
  console.log(falhas.map(f => `  - ${f}`).join('\n'))
  process.exit(1)
}
