import palavrasChave from '@/data/palavrasChave.json'

function normalizar(texto) {

    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

}

/**
 * Retorna sugestões de palavras-chave a partir de um termo digitado.
 * Prioriza palavras que COMEÇAM com o termo, depois as que apenas CONTÊM o termo.
 * Ignora acentos e maiúsculas/minúsculas na comparação.
 */
export function buscarSugestoes(termo, limite = 6) {

    const consulta = normalizar((termo ?? '').trim())

    if (!consulta) return []

    const comecaCom = []
    const contem = []

    for (const palavra of palavrasChave) {

        const normalizada = normalizar(palavra)

        if (normalizada === consulta) continue

        if (normalizada.startsWith(consulta)) {

            comecaCom.push(palavra)

        } else if (normalizada.includes(consulta)) {

            contem.push(palavra)

        }

    }

    return [...comecaCom, ...contem].slice(0, limite)

}
