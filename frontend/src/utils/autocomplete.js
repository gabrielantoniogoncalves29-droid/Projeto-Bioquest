import { buscarPalavrasChave } from '@/services/palavrasChave'

export async function buscarSugestoes(termo, limite = 8, sinal) {

    const consulta = (termo ?? '').trim()

    if (!consulta) return []

    try {

        return await buscarPalavrasChave(consulta, limite, sinal)

    } catch {

        return []

    }

}
