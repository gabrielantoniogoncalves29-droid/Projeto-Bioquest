import questoes from '@/data/card.json'


export function buscarIdsQuestoes(){


return new Promise((resolve)=>{


setTimeout(()=>{


const ids = questoes.map(

questao => questao.id

)


resolve(ids)


},300)


})


}