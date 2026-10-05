import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useResolverStore = defineStore(
'resolver',
()=>{


const questao = ref(null)


const idsQuestoes = ref([])

const indiceAtual = computed(()=>{


if(!questao.value)
return -1


return idsQuestoes.value.indexOf(
    questao.value.id
)


})


const navegacao = computed(() => ({

    atual:
        indiceAtual.value === -1
            ? 0
            : indiceAtual.value + 1,

    total: idsQuestoes.value.length

}))

function carregarQuestao(dados){

    questao.value = dados

}

function carregarIds(ids){

    idsQuestoes.value = ids

}


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

    navegacao,

    carregarQuestao,

    carregarIds,

    questaoAnterior,

    proximaQuestao,

    limpar

}



})



export const useIndiceStore =
defineStore(
'questoes',
()=>{


const questoes = ref([])


const questaoAtual = ref(null)



function carregarQuestoes(lista){

 questoes.value = lista

}



function selecionarQuestao(id){


questaoAtual.value =
questoes.value.find(
 q=>q.id === Number(id)
)


}



return{

questoes,

questaoAtual,

carregarQuestoes,

selecionarQuestao

}


})