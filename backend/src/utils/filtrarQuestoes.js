import { normalizar } from './texto.js'

const textosEmCache = new WeakMap()

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
