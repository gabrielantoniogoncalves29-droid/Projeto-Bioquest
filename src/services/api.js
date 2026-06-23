import questoes from '@/data/card.json'


export function buscarQuestoes(){

console.log("JSON carregado:", questoes)


return Promise.resolve(questoes)

}