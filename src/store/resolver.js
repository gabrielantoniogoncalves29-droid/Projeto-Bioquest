import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useResolverStore = defineStore(
'resolver',
()=>{


const questao = ref(null)


const idsQuestoes = ref([])



// guarda a questão aberta

function carregarQuestao(dados){

    questao.value = dados

}



// guarda os ids vindos do questoes_card.json

function carregarIds(ids){

    idsQuestoes.value = ids

}





// posição atual dentro do vetor

const indiceAtual = computed(()=>{


if(!questao.value)
return -1


return idsQuestoes.value.indexOf(
    questao.value.id
)


})






// questão anterior

const questaoAnterior = computed(()=>{


if(indiceAtual.value <= 0)
return null


return idsQuestoes.value[
    indiceAtual.value - 1
]


})






// próxima questão

const proximaQuestao = computed(()=>{


if(

indiceAtual.value === -1 ||

indiceAtual.value >= idsQuestoes.value.length - 1

)

return null



return idsQuestoes.value[

indiceAtual.value + 1

]


})






function limpar(){

questao.value = null

}




return {


questao,


idsQuestoes,


carregarQuestao,


carregarIds,


questaoAnterior,


proximaQuestao,


limpar


}



})