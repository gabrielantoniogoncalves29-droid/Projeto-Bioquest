import detalhes from '@/data/detalhes.json'


export function buscarDetalhesPorId(id){

    return new Promise((resolve)=>{


        setTimeout(()=>{


            const detalhe = detalhes.find(
                item => item.id === Number(id)
            )


            resolve(detalhe)


        },300)


    })


}