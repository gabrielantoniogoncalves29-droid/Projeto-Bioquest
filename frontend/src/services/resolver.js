import resolver from '@/data/resolver.json'


export function buscarQuestaoResolver(id){


return new Promise((resolve)=>{


setTimeout(()=>{


const questao = resolver.find(

item => item.id === Number(id)

)


resolve(questao)


},300)


})


}