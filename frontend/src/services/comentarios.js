import comentarios from '@/data/comentarios.json'


export function buscarComentariosPorQuestao(id){

    return new Promise((resolve) => {

        setTimeout(() => {

            const registro = comentarios.find(
                item => item.questaoId === Number(id)
            )

            resolve(registro?.comentarios ? [...registro.comentarios] : [])

        }, 300)

    })

}
