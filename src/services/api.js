import questoes from '@/features/Questoes/test/card.json'


export function buscarQuestoes(){

console.log("JSON carregado:", questoes)


return Promise.resolve(questoes)

}