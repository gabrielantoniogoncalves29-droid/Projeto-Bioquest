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
const filtroAnoEl = document.getElementById('filtro-ano')
const filtroObjetoEl = document.getElementById('filtro-objeto')
const filtroSemEnunciadoEl = document.getElementById('filtro-sem-enunciado')
const filtroSemAlternativasEl = document.getElementById('filtro-sem-alternativas')
const planilhaEl = document.getElementById('planilha')
const planilhaDadosEl = document.getElementById('planilha-dados')
const btnPendenteAnterior = document.getElementById('btn-pendente-anterior')
const btnPendenteProxima = document.getElementById('btn-pendente-proxima')
const layoutEl = document.getElementById('vista-editor')
const vistaPlanilhaEl = document.getElementById('vista-planilha')
const abasEl = document.querySelectorAll('.abas button[data-aba]')
const plBuscaEl = document.getElementById('pl-busca')
const plAnoEl = document.getElementById('pl-ano')
const plObjetoEl = document.getElementById('pl-objeto')
const plCategoriaEl = document.getElementById('pl-categoria')
const plStatusEl = document.getElementById('pl-status')
const plContagemEl = document.getElementById('pl-contagem')
const plCorpoEl = document.getElementById('pl-corpo')
const ABAS = ['planilha', 'adicionar', 'editar']

let taxonomia = null
let questoes = []
let editandoId = null
let palavrasExistentes = []
let abaAtual = 'planilha'
let ordemPlanilha = { campo: 'id', direcao: 1 }

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
    opcao.textContent = item.rotulo ?? item.nome
    select.append(opcao)
  })

  if (valorAtual !== undefined && valorAtual !== null) select.value = String(valorAtual)
}

function montarAlternativas() {
  const caixa = document.getElementById('alternativas')

  preencherSelect(
    form.resposta,
    letras.map(letra => ({ id: letra, nome: letra })),
    '',
    '—'
  )

  letras.forEach(letra => {
    const linha = document.createElement('div')
    linha.className = 'alt-linha'

    const rotulo = document.createElement('span')
    rotulo.className = 'letra'
    rotulo.textContent = letra

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
  const subs = conteudo
    ? conteudo.subconteudos.map(s => ({ id: s.id, rotulo: `${s.codigo} · ${s.nome}` }))
    : []

  preencherSelect(form.subconteudoId, subs, subconteudoId, '—')
}

function novaQuestao() {
  editandoId = null
  form.reset()
  limparMensagem()
  tituloEl.textContent = 'Nova questão'
  btnExcluir.hidden = true
  imagemAtual.hidden = true
  form.elements.id.disabled = false
  planilhaEl.hidden = true
  form.banca.value = 'Enem'

  atualizarSubconteudos(form.conteudoId.value)
  marcarAtiva()
  atualizarBotoesPendentes()
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
  form.banca.value = q.banca
  form.prova.value = q.prova
  form.ano.value = q.ano ?? ''
  form.numeroQuestao.value = q.numeroQuestao ?? ''
  form.nivelId.value = q.nivelId ?? ''
  form.conteudoId.value = q.conteudoId ?? ''
  atualizarSubconteudos(q.conteudoId, q.subconteudoId)
  form.objetoId.value = q.objetoId ?? ''
  form.enunciadoTexto.value = q.enunciadoTexto
  form.enunciadoComplemento.value = q.enunciadoComplemento
  form.resumo.value = q.resumo
  form.imagemAlt.value = q.imagemAlt
  form.comentario.value = q.comentario
  form.teoria.value = q.teoria.join('\n')
  form.palavrasChave.value = q.palavrasChave.join('; ')

  letras.forEach(letra => {
    form[`alternativa${letra}`].value = q.alternativas[letra] ?? ''
  })

  form.resposta.value = q.resposta ?? ''
  mostrarPlanilha(q.planilha)

  if (q.imagem) {
    imagemPrevia.src = q.imagem
    imagemPrevia.alt = q.imagemAlt || 'Imagem da questão'
    imagemAtual.hidden = false
  } else {
    imagemAtual.hidden = true
  }

  marcarAtiva()
  atualizarBotoesPendentes()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function mostrarPlanilha(planilha) {
  planilhaDadosEl.replaceChildren()

  const temDados = planilha && (planilha.objetoMatrizId || planilha.objetoLivroId || planilha.conteudoCodigo)

  planilhaEl.hidden = !temDados
  if (!temDados) return

  const itens = [
    ['Objeto da matriz', `${planilha.objetoMatrizId} · ${planilha.objetoMatrizNome}`],
    ['Objeto do livro', `${planilha.objetoLivroId} · ${planilha.objetoLivroNome}`],
    ['Conteúdo (código)', planilha.conteudoCodigo],
    ['Conteúdo (nome original)', planilha.conteudoNome],
    ['Categorização', planilha.categorizacao],
    ['Observações', planilha.observacoes]
  ]

  itens.forEach(([rotulo, valor]) => {
    const dt = document.createElement('dt')
    dt.textContent = rotulo
    const dd = document.createElement('dd')
    dd.textContent = valor ?? '—'
    planilhaDadosEl.append(dt, dd)
  })
}

const pendente = q => !q.temEnunciado || !q.temAlternativas

function marcarAtiva() {
  listaEl.querySelectorAll('li').forEach(li => {
    li.classList.toggle('ativa', Number(li.dataset.id) === editandoId)
  })
}

function filtrarLista() {
  const termo = buscaEl.value.trim().toLowerCase()
  const ano = filtroAnoEl.value
  const objeto = filtroObjetoEl.value

  return questoes.filter(q => {
    if (ano && String(q.ano) !== ano) return false
    if (objeto && String(q.objetoId) !== objeto) return false
    if (filtroSemEnunciadoEl.checked && q.temEnunciado) return false
    if (filtroSemAlternativasEl.checked && q.temAlternativas) return false
    if (!termo) return true

    return `${q.id} ${q.ano ?? ''} ${q.objeto ?? ''} ${q.conteudo ?? ''} ${q.subconteudo ?? ''} ${q.resumo}`
      .toLowerCase()
      .includes(termo)
  })
}

function renderizarLista() {
  const filtradas = filtrarLista()

  contagemEl.textContent = `${filtradas.length} de ${questoes.length} questões`
  listaEl.replaceChildren()

  filtradas.forEach(q => {
    const li = document.createElement('li')
    li.dataset.id = q.id
    li.classList.toggle('completa', !pendente(q))

    const botao = document.createElement('button')
    botao.type = 'button'

    const codigo = document.createElement('span')
    codigo.className = 'codigo'
    codigo.textContent = `#${q.id} · ${q.ano ?? 'sem ano'}`

    const meta = document.createElement('span')
    meta.className = 'meta'
    meta.textContent = [q.objeto, [q.conteudo, q.subconteudo].filter(Boolean).join(' › ')]
      .filter(Boolean)
      .join(' · ') || 'Sem classificação'

    const resumo = document.createElement('span')
    resumo.className = 'resumo'
    resumo.textContent = q.resumo

    const pendencias = document.createElement('span')
    pendencias.className = 'pendencias'
    const faltas = []
    if (!q.temEnunciado) faltas.push('enunciado')
    if (!q.temAlternativas) faltas.push('alternativas')
    if (!q.temGabarito) faltas.push('gabarito')
    pendencias.textContent = faltas.length ? `Falta: ${faltas.join(', ')}` : 'Completa'

    botao.append(codigo, meta, resumo, pendencias)
    botao.addEventListener('click', () => abrirQuestao(q.id))
    li.append(botao)
    listaEl.append(li)
  })

  marcarAtiva()
  atualizarBotoesPendentes()
  renderizarPlanilha()
}

// Navegação "pendente": percorre a lista completa (por código) pulando as questões
// que já têm enunciado e alternativas.
function proximaPendente(direcao) {
  const ordenadas = [...questoes].sort((a, b) => a.id - b.id)
  const posicao = ordenadas.findIndex(q => q.id === editandoId)
  const inicio = posicao === -1 ? (direcao > 0 ? -1 : ordenadas.length) : posicao

  for (let i = inicio + direcao; i >= 0 && i < ordenadas.length; i += direcao) {
    if (pendente(ordenadas[i])) return ordenadas[i]
  }

  return null
}

function atualizarBotoesPendentes() {
  btnPendenteAnterior.disabled = !proximaPendente(-1)
  btnPendenteProxima.disabled = !proximaPendente(1)
}

function irParaPendente(direcao) {
  const alvo = proximaPendente(direcao)
  if (alvo) abrirQuestao(alvo.id)
}

function situacaoDaQuestao(q) {
  const faltas = []
  if (!q.temEnunciado) faltas.push('enunciado')
  if (!q.temAlternativas) faltas.push('alternativas')
  if (!q.temGabarito) faltas.push('gabarito')
  return faltas
}

function filtrarPlanilha() {
  const termo = plBuscaEl.value.trim().toLowerCase()

  return questoes.filter(q => {
    const faltas = situacaoDaQuestao(q)

    if (plAnoEl.value && String(q.ano) !== plAnoEl.value) return false
    if (plObjetoEl.value && String(q.objetoMatrizId) !== plObjetoEl.value) return false
    if (plCategoriaEl.value && String(q.categorizacao) !== plCategoriaEl.value) return false

    switch (plStatusEl.value) {
      case 'pendentes': if (!faltas.length) return false; break
      case 'sem-enunciado': if (q.temEnunciado) return false; break
      case 'sem-alternativas': if (q.temAlternativas) return false; break
      case 'sem-gabarito': if (q.temGabarito) return false; break
      case 'completas': if (faltas.length) return false; break
    }

    if (!termo) return true

    return `${q.id} ${q.ano ?? ''} ${q.objetoMatrizNome ?? ''} ${q.objetoLivroNome ?? ''} ${q.conteudoLivroCodigo ?? ''} ${q.conteudoLivroNome ?? ''} ${q.observacoes ?? ''}`
      .toLowerCase()
      .includes(termo)
  })
}

function renderizarPlanilha() {
  const { campo, direcao } = ordemPlanilha

  const linhas = filtrarPlanilha().sort((a, b) => {
    const va = a[campo]
    const vb = b[campo]

    if (va == null && vb == null) return a.id - b.id
    if (va == null) return 1
    if (vb == null) return -1

    const comparacao = typeof va === 'number' && typeof vb === 'number'
      ? va - vb
      : String(va).localeCompare(String(vb), 'pt-BR', { numeric: true })

    return comparacao * direcao || a.id - b.id
  })

  plContagemEl.textContent = `${linhas.length} de ${questoes.length} questões`
  plCorpoEl.replaceChildren()

  linhas.forEach(q => {
    const tr = document.createElement('tr')
    const celula = (texto, classe) => {
      const td = document.createElement('td')
      td.textContent = texto ?? '—'
      if (classe) td.className = classe
      tr.append(td)
      return td
    }

    celula(`#${q.id}`, 'num')
    celula(q.ano)
    celula(q.objetoMatrizId ? `${q.objetoMatrizId} · ${q.objetoMatrizNome}` : null)
    celula(q.objetoLivroId ? `${q.objetoLivroId} · ${q.objetoLivroNome}` : null)
    celula(q.conteudoLivroCodigo ? `${q.conteudoLivroCodigo} · ${q.conteudoLivroNome ?? ''}` : q.conteudoLivroNome)
    celula(q.categorizacao)
    celula(q.observacoes, 'obs')
    celula(q.gabarito)

    const faltas = situacaoDaQuestao(q)
    celula(faltas.length ? `Falta: ${faltas.join(', ')}` : 'Completa', faltas.length ? 'falta' : 'ok')

    const acoes = document.createElement('td')
    const editar = document.createElement('button')
    editar.type = 'button'
    editar.textContent = 'Editar'
    editar.addEventListener('click', () => abrirQuestao(q.id))
    acoes.append(editar)
    tr.append(acoes)

    plCorpoEl.append(tr)
  })

  document.querySelectorAll('.tabela th[data-ordem]').forEach(th => {
    const ativo = th.dataset.ordem === campo
    th.dataset.seta = ativo ? (direcao > 0 ? ' ▲' : ' ▼') : ''
    th.textContent = th.textContent.replace(/ [▲▼]$/, '') + th.dataset.seta
  })
}

function mudarAba(aba, { semAbrir = false } = {}) {
  abaAtual = aba
  limparMensagem()

  abasEl.forEach(botao => botao.classList.toggle('ativa', botao.dataset.aba === aba))
  vistaPlanilhaEl.hidden = aba !== 'planilha'
  layoutEl.hidden = aba === 'planilha'
  layoutEl.classList.toggle('modo-adicionar', aba === 'adicionar')

  if (location.hash.slice(1) !== aba) history.replaceState(null, '', `#${aba}`)

  if (aba === 'adicionar') {
    novaQuestao()
  } else if (aba === 'editar' && !semAbrir && editandoId === null) {
    const primeira = filtrarLista()[0] ?? questoes[0]
    if (primeira) abrirQuestao(primeira.id)
  }
}

function preencherFiltrosDaLista() {
  const anos = [...new Set(questoes.map(q => q.ano).filter(Boolean))].sort((a, b) => b - a)

  preencherSelect(filtroAnoEl, anos.map(ano => ({ id: ano, nome: String(ano) })), '', 'Todos os anos')
  preencherSelect(filtroObjetoEl, taxonomia.eixos, '', 'Todos os objetos')

  const valores = { ano: plAnoEl.value, objeto: plObjetoEl.value, categoria: plCategoriaEl.value }
  const categorias = [...new Set(questoes.map(q => q.categorizacao).filter(v => v != null))].sort((a, b) => a - b)

  preencherSelect(plAnoEl, anos.map(ano => ({ id: ano, nome: String(ano) })), valores.ano, 'Todos os anos')
  preencherSelect(plObjetoEl, taxonomia.eixos, valores.objeto, 'Todos os objetos')
  preencherSelect(plCategoriaEl, categorias.map(c => ({ id: c, nome: `Categoria ${c}` })), valores.categoria, 'Todas as categorias')
}

async function carregarLista() {
  questoes = await api('/questoes')

  const anoAtual = filtroAnoEl.value
  preencherFiltrosDaLista()
  filtroAnoEl.value = anoAtual

  renderizarLista()
}

async function abrirQuestao(id) {
  try {
    preencherForm(await api(`/questoes/${id}`))
    if (abaAtual !== 'editar') mudarAba('editar', { semAbrir: true })
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
      form.palavrasChave.value = atuais ? `${atuais.replace(/;\s*$/, '')}; ${palavra}` : palavra
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
    if (abaAtual !== 'editar') mudarAba('editar', { semAbrir: true })

    const avisos = (salva.avisos || []).join(' ')
    const arquivo = salva.arquivo ? ` Arquivo para o Git: ${salva.arquivo}.` : ''
    mostrarMensagem(`Questão ${salva.id} salva com sucesso.${arquivo}${avisos ? ` Atenção: ${avisos}` : ''}`, 'ok')
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
    mudarAba('planilha')
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

  preencherSelect(form.nivelId, taxonomia.niveis, '', '—')
  preencherSelect(form.conteudoId, taxonomia.conteudos, '', '—')
  preencherSelect(form.objetoId, taxonomia.eixos, '', '—')

  // O objeto da matriz é independente do conteúdo do livro: não é sincronizado.
  form.conteudoId.addEventListener('change', () => {
    atualizarSubconteudos(form.conteudoId.value)
  })

  form.addEventListener('submit', salvar)
  btnExcluir.addEventListener('click', excluir)
  document.getElementById('btn-nova').addEventListener('click', () => mudarAba('adicionar'))
  buscaEl.addEventListener('input', renderizarLista)
  ;[filtroAnoEl, filtroObjetoEl, filtroSemEnunciadoEl, filtroSemAlternativasEl].forEach(el => {
    el.addEventListener('change', renderizarLista)
  })
  btnPendenteAnterior.addEventListener('click', () => irParaPendente(-1))
  btnPendenteProxima.addEventListener('click', () => irParaPendente(1))

  abasEl.forEach(botao => botao.addEventListener('click', () => mudarAba(botao.dataset.aba)))
  document.getElementById('btn-exportar').addEventListener('click', async () => {
    try {
      const r = await api('/exportar', { method: 'POST' })
      alert(`${r.exportadas} questão(ões) exportada(s) para db/questoes. Faça o commit dessa pasta e de db/imagens.`)
    } catch (erro) {
      alert(erro.message)
    }
  })
  ;[plBuscaEl, plAnoEl, plObjetoEl, plCategoriaEl, plStatusEl].forEach(el => {
    el.addEventListener(el === plBuscaEl ? 'input' : 'change', renderizarPlanilha)
  })
  document.querySelectorAll('.tabela th[data-ordem]').forEach(th => {
    th.addEventListener('click', () => {
      const campo = th.dataset.ordem
      ordemPlanilha = { campo, direcao: ordemPlanilha.campo === campo ? -ordemPlanilha.direcao : 1 }
      renderizarPlanilha()
    })
  })
  window.addEventListener('hashchange', () => {
    const aba = location.hash.slice(1)
    if (ABAS.includes(aba) && aba !== abaAtual) mudarAba(aba)
  })

  await Promise.all([carregarLista(), carregarPalavras()])

  const abaInicial = location.hash.slice(1)
  mudarAba(ABAS.includes(abaInicial) ? abaInicial : 'planilha')
}

iniciar()
