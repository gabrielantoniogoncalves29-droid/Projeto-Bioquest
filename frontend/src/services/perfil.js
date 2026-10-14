import perfil from '@/data/perfil.json'


export function buscarPerfil(){

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve(perfil)

        }, 300)

    })

}

export function atualizarPerfil(dados){

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve({ ...perfil, ...dados })

        }, 300)

    })

}
