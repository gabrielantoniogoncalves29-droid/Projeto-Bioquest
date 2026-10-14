import questoes from '@/data/card.json'


export function buscarQuestoes(){


 return new Promise((resolve)=>{


  setTimeout(()=>{


    resolve(questoes)


  },500)


 })


}



export function buscarQuestaoPorId(id){


return new Promise((resolve)=>{


const questao = questoes.find(
 item=>item.id === Number(id)
)


setTimeout(()=>{


resolve(questao)


},300)


})


}

export function buscarIdsQuestoes(){


return new Promise((resolve)=>{


setTimeout(()=>{


const ids = questoes.map(

item => item.id

)


resolve(ids)


},300)


})


}