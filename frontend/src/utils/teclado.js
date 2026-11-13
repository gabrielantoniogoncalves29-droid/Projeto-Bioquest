const TIPOS_IGNORADOS = ['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'hidden', 'range', 'color', 'image']

function ehCampoDeTexto(elemento) {

  return elemento instanceof HTMLInputElement && !TIPOS_IGNORADOS.includes(elemento.type)

}

export function avancarComEnter(evento, aoConcluir = null) {

  if (evento.defaultPrevented || evento.isComposing) return

  if (evento.shiftKey || evento.ctrlKey || evento.metaKey || evento.altKey) return

  const alvo = evento.target

  if (!ehCampoDeTexto(alvo)) return

  const campos = [...evento.currentTarget.querySelectorAll('input')].filter(campo =>
    ehCampoDeTexto(campo) &&
    !campo.disabled &&
    !campo.readOnly &&
    campo.getClientRects().length > 0
  )

  const proximo = campos[campos.indexOf(alvo) + 1]

  if (proximo) {

    evento.preventDefault()

    proximo.focus()

    return

  }

  if (typeof aoConcluir === 'function') {

    evento.preventDefault()

    aoConcluir()

  }

}
