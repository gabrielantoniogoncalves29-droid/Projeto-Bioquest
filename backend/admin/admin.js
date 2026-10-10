const letras = ['A', 'B', 'C', 'D', 'E']
const form = document.getElementById('form')
const mensagem = document.getElementById('mensagem')
const listaEl = document.getElementById('questoes')
const contagemEl = document.getElementById('contagem')
const buscaEl = document.getElementById('busca')
const tituloEl = document.getElementById('titulo-form')
const btnSalvar = document.getElementById('btn-salvar')
const btnExcluir = document.getElementById('btn-excluir')
const imagemAtual = document.getElementById('imagem-atual')
const imagemPrevia = document.getElementById('imagem-previa')
const sugestoesEl = document.getElementById('sugestoes')

let taxonomia = null
let questoes = []
let editandoId = null
let palavrasExistentes = []

async function api(caminho, opcoes = {}) {
  const resposta = await fetch(`api${caminho}`, opcoes)

  if (resposta.status === 204) return null

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    const erro = new Error(dados.erro || 'Falha na requisição')
    erro.detalhes = dados.detalhes
    throw erro
  }

  return dados
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto
  mensagem.className = `mensagem ${tipo}`
  mensagem.hidden = false
}

function limparMensagem() {
  mensagem.hidden = true
}

function preencherSelect(select, itens, valorAtual, vazio) {
  select.replaceChildren()

  if (vazio) {
    const opcao = document.createElement('option')
    opcao.value = ''
    opcao.textContent = vazio
    select.append(opcao)
  }

  itens.forEach(item => {
    const opcao = document.createElement('option')
    opcao.value = item.id
    opcao.textContent = item.nome
    select.append(opcao)
  })

  if (valorAtual !== undefined && valorAtual !== null) select.value = String(valorAtual)
}

function montarAlternativas() {
  const caixa = document.getElementById('alternativas')

  letras.forEach(letra => {
    const linha = document.createElement('div')
    linha.className = 'alt-linha'

    const rotulo = document.createElement('span')
    rotulo.className = 'letra'

    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'resposta'
    radio.value = letra
    radio.title = `Alternativa ${letra} é a correta`

    rotulo.append(radio, document.createTextNode(letra))

    const texto = document.createElement('input')
    texto.type = 'text'
    texto.name = `alternativa${letra}`
    texto.placeholder = `Texto da alternativa ${letra}`

    linha.append(rotulo, texto)
    caixa.append(linha)
  })
}

function atualizarSubconteudos(conteudoId, subconteudoId) {
  const conteudo = taxonomia.conteudos.find(c => c.id === Number(conteudoId))
  preencherSelect(form.subconteudoId, conteudo ? conteudo.subconteudos : [], subconteudoId)
}

function sincronizarObjeto() {
  const conteudo = taxonomia.conteudos.find(c => c.id === Number(form.conteudoId.value))
  if (conteudo) form.objetoId.value = String(conteudo.eixoId)
}

function novaQuestao() {
  editandoId = null
  form.reset()
  limparMensagem()
  tituloEl.textContent = 'Nova questão'
  btnExcluir.hidden = true
  imagemAtual.hidden = true
  form.elements.id.disabled = false
  form.banca.value = 'Enem'
  form.taxaAcerto.value = '0'

  atualizarSubconteudos(form.conteudoId.value)
  sincronizarObjeto()
  marcarAtiva()
  form.ano.focus()
}

function preencherForm(q) {
  form.reset()
  limparMensagem()
  editandoId = q.id

  tituloEl.textContent = `Editando questão ${q.id}`
  btnExcluir.hidden = false

  form.elements.id.value = q.id
  form.elements.id.disabled = true
  form.ano.value = q.ano
  form.banca.value = q.banca
  form.prova.value = q.prova
  form.numeroQuestao.value = q.numeroQuestao ?? ''
  form.taxaAcerto.value = q.taxaAcerto
  form.nivelId.value = q.nivelId
  form.conteudoId.value = q.conteudoId
  atualizarSubconteudos(q.conteudoId, q.subconteudoId)
  form.objetoId.value = q.objetoId
  form.enunciadoTexto.value = q.enunciadoTexto
  form.enunciadoComplemento.value = q.enunciadoComplemento
  form.resumo.value = q.resumo
  form.imagemAlt.value = q.imagemAlt
  form.comentario.value = q.comentario
  form.teoria.value = q.teoria.join('\n')
  form.palavrasChave.value = q.palavrasChave.join(', ')

  letras.forEach(letra => {
    form[`alternativa${letra}`].value = q.alternativas[letra] ?? ''
  })

  form.resposta.value = q.resposta

  if (q.imagem) {
    imagemPrevia.src = q.imagem
    imagemPrevia.alt = q.imagemAlt || 'Imagem da questão'
    imagemAtual.hidden = false
  } else {
    imagemAtual.hidden = true
  }

  marcarAtiva()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function marcarAtiva() {
  listaEl.querySelectorAll('li').forEach(li => {
    li.classList.toggle('ativa', Number(li.dataset.id) === editandoId)
  })
}

function renderizarLista() {
  const termo = buscaEl.value.trim().toLowerCase()

  const filtradas = questoes.filter(q => {
    if (!termo) return true
    return `${q.id} ${q.ano} ${q.conteudo} ${q.subconteudo} ${q.resumo}`.toLowerCase().includes(termo)
  })

  contagemEl.textContent = `${filtradas.length} de ${questoes.length} questões`
  listaEl.replaceChildren()

  filtradas.forEach(q => {
    const li = document.createElement('li')
    li.dataset.id = q.id

    const botao = document.createElement('button')
    botao.type = 'button'

    const codigo = document.createElement('span')
    codigo.className = 'codigo'
    codigo.textContent = `#${q.id} · ${q.ano}`

    const meta = document.createElement('span')
    meta.className = 'meta'
    meta.textContent = `${q.conteudo} › ${q.subconteudo}`

    const resumo = document.createElement('span')
    resumo.className = 'resumo'
    resumo.textContent = q.resumo

    botao.append(codigo, meta, resumo)
    botao.addEventListener('click', () => abrirQuestao(q.id))
    li.append(botao)
    listaEl.append(li)
  })

  marcarAtiva()
}

async function carregarLista() {
  questoes = await api('/questoes')
  renderizarLista()
}

async function abrirQuestao(id) {
  try {
    preencherForm(await api(`/questoes/${id}`))
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro')
  }
}

function renderizarSugestoes() {
  sugestoesEl.replaceChildren()

  palavrasExistentes.slice(0, 40).forEach(palavra => {
    const chip = document.createElement('button')
    chip.type = 'button'
    chip.textContent = palavra

    chip.addEventListener('click', () => {
      const atuais = form.palavrasChave.value.trim()
      form.palavrasChave.value = atuais ? `${atuais}, ${palavra}` : palavra
    })

    sugestoesEl.append(chip)
  })
}

async function carregarPalavras() {
  palavrasExistentes = await api('/palavras-chave')
  renderizarSugestoes()
}

async function salvar(evento) {
  evento.preventDefault()
  limparMensagem()

  if (!form.resposta.value) {
    mostrarMensagem('Marque qual alternativa é a correta.', 'erro')
    return
  }

  const dados = new FormData(form)

  if (editandoId) dados.delete('id')

  btnSalvar.disabled = true

  try {
    const salva = await api(
      editandoId ? `/questoes/${editandoId}` : '/questoes',
      { method: editandoId ? 'PUT' : 'POST', body: dados }
    )

    await Promise.all([carregarLista(), carregarPalavras()])
    preencherForm(salva)
    mostrarMensagem(`Questão ${salva.id} salva com sucesso.`, 'ok')
  } catch (erro) {
    const extras = (erro.detalhes || []).map(d => d.mensagem).join(' · ')
    mostrarMensagem(extras && extras !== erro.message ? `${erro.message} (${extras})` : erro.message, 'erro')
  } finally {
    btnSalvar.disabled = false
  }
}

async function excluir() {
  if (!editandoId) return
  if (!confirm(`Excluir a questão ${editandoId}? Esta ação não pode ser desfeita.`)) return

  try {
    await api(`/questoes/${editandoId}`, { method: 'DELETE' })
    await Promise.all([carregarLista(), carregarPalavras()])
    novaQuestao()
    mostrarMensagem('Questão excluída.', 'ok')
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro')
  }
}

async function iniciar() {
  montarAlternativas()

  try {
    taxonomia = await api('/taxonomia')
  } catch (erro) {
    mostrarMensagem(`Não foi possível carregar os dados: ${erro.message}`, 'erro')
    return
  }

  preencherSelect(form.nivelId, taxonomia.niveis)
  preencherSelect(form.conteudoId, taxonomia.conteudos)
  preencherSelect(form.objetoId, taxonomia.eixos)

  form.conteudoId.addEventListener('change', () => {
    atualizarSubconteudos(form.conteudoId.value)
    sincronizarObjeto()
  })

  form.addEventListener('submit', salvar)
  btnExcluir.addEventListener('click', excluir)
  document.getElementById('btn-nova').addEventListener('click', novaQuestao)
  buscaEl.addEventListener('input', renderizarLista)

  await Promise.all([carregarLista(), carregarPalavras()])
  novaQuestao()
}

iniciar()
