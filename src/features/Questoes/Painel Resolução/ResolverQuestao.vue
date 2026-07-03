<script setup>

import {onMounted,ref, computed} from 'vue'

import {useRoute} from 'vue-router'

import {useResolverStore}
from '@/store/resolver.js'

import {buscarIdsQuestoes}
from '@/services/questoes.js'

import {buscarQuestaoResolver}
from '@/services/resolver.js'

import { useDetalhesStore } 
from '@/store/detalhes.js'


import { buscarDetalhesPorId }
from '@/services/detalhes.js'

import HeaderQuestao from '@/features/Questoes/Painel Resolução/HeaderQuestão.vue'

import Enunciado from '@/features/Questoes/Painel Resolução/Enunciado.vue'

import AlternativaItem from '@/features/Questoes/Painel Resolução/AlternativaItem.vue'

import QuestaoFooter from '@/features/Questoes/Painel Resolução/QuestaoFooter.vue'

import PainelResolucao from '@/features/Questoes/Painel Resolução/PainelResolucao.vue'

import Header from '@/components/layout/Header.vue'



const route = useRoute()

const store = useResolverStore()


const id = Number(route.params.id)
const detalhesStore = useDetalhesStore()


const barraAberta = ref(true)

const classeLayout = computed(()=>{

  return {

    "barra-fechada": !barraAberta.value

  }

})

const questao = computed(()=>{

  return store.questao

})



onMounted(async()=>{
const detalhes =
await buscarDetalhesPorId(id)


detalhesStore.carregarDetalhes(detalhes)

const dados =

await buscarQuestaoResolver(id)



store.carregarQuestao(dados)




const ids =

await buscarIdsQuestoes()



store.carregarIds(ids)



})



function goback(){

window.history.back()

}

const proximaQuestao = computed(()=>{

return store.proximaQuestao

})



const questaoAnterior = computed(()=>{

return store.questaoAnterior

})

const detalhes = computed(()=>{

  return detalhesStore.detalheAtual

})

</script>


<template>
<Header/>
<main class="resolver-page">


  <div class="breadcrumb">

    <span 
      @click="goback()" 
      class="voltar"
    >
      ⟵ Voltar
    </span>


    <span class="separator">|</span>


    <span>Biblioteca de Questões</span>

    <span>/</span>

    <span>Pesquisa</span>

    <span>/</span>


    <span>
      Questão {{ questao?.id }}
    </span>


    <span>/</span>


    <span>Resolver</span>


  </div>

  <div 
    v-if="!questao"
    class="loading"
  >

    Carregando questão...

  </div>





<div 
  v-else
  class="resolver-layout"
  :class="classeLayout"
>



    <section class="questao-container">


<HeaderQuestao

:questao="questao"

:idsQuestoes="store.idsQuestoes"

/>



<Enunciado

:questao="questao"

/>




      <AlternativaItem

        :alternativas="questao.alternativas"

      />





<QuestaoFooter

:questao="questao"

:proximaQuestao="proximaQuestao"

:questaoAnterior="questaoAnterior"

/>


    </section>






    <aside class="painel-container">

<PainelResolucao
:questao="questao"
v-model:aberto="barraAberta"
:detalhes="detalhes"
/>

    </aside>





  </div>


</main>

</template>

<style scoped>

.resolver-page {
  padding: 24px;
  background: #fcfefd67;
  min-height: 100vh;
}
.painel-container {

background:white;

border:1px solid #e6e6e6;

border-radius:16px;

overflow:visible;

transition:width .35s ease;

}

.breadcrumb {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 24px;

  color: #5f6368;
  font-size: 14px;
}

.breadcrumb span:hover {
  text-decoration: underline;
}

.voltar {
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
}

.separator {
  color: #d0d0d0;
}

.resolver-layout {

  display:grid;

  grid-template-columns:
  minmax(0, 2.4fr)
  380px;

  gap:16px;

  transition:grid-template-columns .35s ease;

}

.resolver-layout.barra-fechada {

  grid-template-columns:
  minmax(0, 1fr)
  55px;

}

.questao-container {
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  overflow: hidden;
}



@media (max-width: 1200px) {

  .resolver-layout {
    grid-template-columns: 1fr;
  }

}

</style>