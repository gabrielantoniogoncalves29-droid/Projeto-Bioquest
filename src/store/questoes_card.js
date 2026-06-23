import {defineStore} from 'pinia'
import {buscarQuestoes} from '@/services/api'


export const useQuestoesStore = defineStore(
'questoes',
{
state:()=>({
questoes:[],
carregando:false
}),
actions:{
async carregarQuestoes(){
this.carregando=true
this.questoes = await buscarQuestoes()
this.carregando=false
}
}
})