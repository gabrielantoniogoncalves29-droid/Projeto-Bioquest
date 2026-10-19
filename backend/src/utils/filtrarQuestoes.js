export const ORDENS = ['recentes', 'antigas', 'maiorDificuldade', 'menorDificuldade']

export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

const textosEmCache = new WeakMap()

// Texto pesquisável do card: resumo, subconteúdo, conteúdo, objeto da matriz e
// palavras-chave (conteúdo + observações da planilha). Id e ano são tratados à parte.
function textoDoCard(card) {
  let texto = textosEmCache.get(card)

  if (texto === undefined) {
    texto = normalizar([
      card.resumo,
      card.subconteudo,
      card.conteudoNome,
      card.objetoNome,
      ...(card.palavrasChave ?? [])
    ].join(' '))

    textosEmCache.set(card, texto)
  }

  return texto
}

// "Todas as palavras precisam casar" (AND). Termo só de dígitos (com ou sem #)
// casa com o id ou o ano exatos; qualquer termo também casa por trecho de texto.
function casaComTermo(card, palavras) {
  const texto = textoDoCard(card)

  return palavras.every(palavra => {
    if (texto.includes(palavra)) return true

    if (/^\d+$/.test(palavra)) {
      const numero = Number(palavra)
      return card.id === numero || card.ano === numero
    }

    return false
  })
}

const naLista = (lista, valor) =>
  !lista?.length || (valor !== null && valor !== undefined && lista.includes(valor))

export function filtrarQuestoes(cards, filtros = {}, contexto = {}) {
  const palavras = normalizar(filtros.termo)
    .split(/\s+/)
    .map(palavra => palavra.replace(/^#+/, ''))
    .filter(Boolean)

  const estados = filtros.estados ?? []
  const { respondidas = new Set(), salvas = new Set(), revisar = new Set() } = contexto

  const atendeEstado = card => estados.some(estado => {
    if (estado === 1) return respondidas.has(card.id)
    if (estado === 2) return salvas.has(card.id)
    if (estado === 3) return revisar.has(card.id)
    if (estado === 4) return !respondidas.has(card.id)
    return false
  })

  return cards.filter(card => {
    if (!naLista(filtros.anos, card.ano)) return false
    if (!naLista(filtros.niveis, card.nivel)) return false
    if (!naLista(filtros.objetos, card.objetoId)) return false
    if (!naLista(filtros.conteudos, card.conteudoId)) return false
    if (!naLista(filtros.subconteudos, card.subconteudoId)) return false
    if (estados.length && !atendeEstado(card)) return false
    if (palavras.length && !casaComTermo(card, palavras)) return false
    return true
  })
}

// Valor ausente (null) vai sempre para o fim, em qualquer direção.
function comparar(a, b, direcao) {
  const aVazio = a === null || a === undefined
  const bVazio = b === null || b === undefined

  if (aVazio || bVazio) return aVazio === bVazio ? 0 : aVazio ? 1 : -1

  return direcao * (a - b)
}

// Desempate determinístico: ano (mais recente primeiro, exceto em "antigas") e depois serial.
export function ordenarQuestoes(cards, ordem) {
  const lista = [...cards]
  const porSerial = (a, b) => a.serial - b.serial

  switch (ordem) {
    case 'recentes':
      return lista.sort((a, b) => comparar(a.ano, b.ano, -1) || porSerial(a, b))

    case 'antigas':
      return lista.sort((a, b) => comparar(a.ano, b.ano, 1) || porSerial(a, b))

    case 'maiorDificuldade':
      return lista.sort((a, b) =>
        comparar(a.nivel, b.nivel, -1) || comparar(a.ano, b.ano, -1) || porSerial(a, b))

    case 'menorDificuldade':
      return lista.sort((a, b) =>
        comparar(a.nivel, b.nivel, 1) || comparar(a.ano, b.ano, -1) || porSerial(a, b))

    default:
      return lista.sort(porSerial)
  }
}

export function filtrarEOrdenar(cards, filtros = {}, contexto = {}) {
  return ordenarQuestoes(filtrarQuestoes(cards, filtros, contexto), filtros.ordem)
}
