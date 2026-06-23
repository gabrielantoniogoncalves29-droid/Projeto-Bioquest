import {defineStore} from 'pinia'
import {ref} from 'vue'


export const useDetalhesStore = defineStore(
'detalhes',
()=>{


const detalheAtual = ref(null)



function carregarDetalhes(detalhe){

    detalheAtual.value = detalhe

}



function limparDetalhes(){

    detalheAtual.value = null

}



return {

    detalheAtual,

    carregarDetalhes,

    limparDetalhes

}


})