import {defineStore} from 'pinia'
import {buscarQuestoes} from '@/services/card'


export const useQuestoesStore = defineStore(
'questoes',
{
state:()=>({
questoes:[],
carregando:false
}),
getters: {
totalQuestoes: (state) => state.questoes.length
},
actions:{
async carregarQuestoes(){
this.carregando=true
this.questoes = await buscarQuestoes()
this.carregando=false
}
}

})