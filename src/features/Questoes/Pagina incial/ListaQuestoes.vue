<script setup>

import { onMounted, computed } from 'vue'

import QuestoesCard from './Questoes_card.vue'

import { useQuestoesStore } from '@/store/questoes_card.js'



const store = useQuestoesStore()



const questoes = computed(()=>{

  return store.questoes

})



onMounted(()=>{

  store.carregarQuestoes()

})



defineProps({

  modo:{
    type:String,
    default:'lista'
  }

})


</script>



<template>


<section
  class="lista-questoes"
  :class="modo"
>



<div
v-if="store.carregando"
class="loading"
>

Carregando questões...

</div>



<div
v-else-if="questoes.length === 0"
class="empty"
>

Nenhuma questão encontrada.

</div>



<QuestoesCard

v-for="questao in questoes"

:key="questao.id"

:questao="questao"

/>



</section>


</template>

<style scoped>


.lista-questoes {

  width:100%;

  background:#f8faf9;

  padding:24px;

  box-sizing:border-box;

  min-height:100%;

}


.lista-questoes.lista {

  display:flex;

  flex-direction:column;

  gap:10px;

}


.lista-questoes.grade {

  display:grid;

  grid-template-columns:repeat(
    auto-fill,
    minmax(450px,1fr)
  );

  gap:16px;

}


@media(max-width:768px){

  .lista-questoes{

    padding:12px;

  }


  .lista-questoes.grade{

    grid-template-columns:1fr;

  }

}



.loading,
.empty {

  text-align:center;

  padding:40px;

  color:#6b7280;

}
</style>