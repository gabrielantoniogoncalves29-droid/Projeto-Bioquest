export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function escaparLike(texto) {
  return texto.replace(/[\\%_]/g, '\\$&')
}

export function listaDeTexto(valor, separador) {
  return String(valor ?? '')
    .split(separador)
    .map(item => item.trim())
    .filter(Boolean)
}

export function resumirTexto(texto, limite = 280) {
  const limpo = String(texto ?? '').replace(/\s+/g, ' ').trim()
  if (limpo.length <= limite) return limpo
  const corte = limpo.slice(0, limite)
  const ultimoEspaco = corte.lastIndexOf(' ')
  return `${corte.slice(0, ultimoEspaco > 0 ? ultimoEspaco : limite)}…`
}

// Remove o trecho entre parênteses: "Citoplasma e organelas (Citoplasma)" -> "Citoplasma e organelas".
export function limparParenteses(texto) {
  return String(texto ?? '').replace(/\s*\([^)]*\)/g, '').trim()
}

// Palavras-chave de uma questão da planilha: o conteúdo (sem parênteses)
// seguido de cada termo das observações, separados SOMENTE por ";" (vírgulas
// fazem parte do termo, ex.: "Câncer, mitose").
export function termosDaPlanilha(conteudoNome, observacoes) {
  return [limparParenteses(conteudoNome), ...listaDeTexto(observacoes, ';')].filter(Boolean)
}
