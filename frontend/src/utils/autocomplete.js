import { buscarPalavrasChave } from '@/services/palavrasChave'

export async function buscarSugestoes(termo, limite = 6) {

    const consulta = (termo ?? '').trim()

    if (!consulta) return []

    try {

        return await buscarPalavrasChave(consulta, limite)

    } catch {

        return []

    }

}
