import {defineStore} from 'pinia'
import {ref} from 'vue'


export const useQuestoesStore =
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