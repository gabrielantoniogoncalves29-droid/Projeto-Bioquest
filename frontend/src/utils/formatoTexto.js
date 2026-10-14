function escaparHtml(texto) {

    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

}

function aplicarInline(texto) {

    return texto
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<u>$1</u>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')

}

export function formatarTexto(bruto) {

    if (!bruto) return ''

    const escapado = escaparHtml(bruto)

    const linhas = escapado.split('\n')

    let html = ''
    let dentroDeLista = false

    for (const linha of linhas) {

        const semEspacos = linha.trimStart()
        const ehItemDeLista = semEspacos.startsWith('- ')

        if (ehItemDeLista) {

            if (!dentroDeLista) {

                html += '<ul>'
                dentroDeLista = true

            }

            html += `<li>${aplicarInline(semEspacos.slice(2))}</li>`

        } else {

            if (dentroDeLista) {

                html += '</ul>'
                dentroDeLista = false

            }

            if (linha.trim() === '') {

                html += '<br>'

            } else {

                html += `<p>${aplicarInline(linha)}</p>`

            }

        }

    }

    if (dentroDeLista) html += '</ul>'

    return html

}
