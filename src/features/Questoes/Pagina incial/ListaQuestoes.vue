<script setup>

import { onMounted, computed } from 'vue'

import QuestoesCard from './Questoes_card.vue'

import { useQuestoesStore } from '@/store/questoes_card.js'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'


const store = useQuestoesStore()
const filtrosStore = useQuestoesFiltrosStore()


const questoes = computed(() => {

  return store.questoes

})


onMounted(() => {

  store.carregarQuestoes()

})

</script>



<template>


<section
  class="lista-questoes"
  :class="filtrosStore.modoVisualizacao"
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

<div class="resultado-acoes">
<button class="resolver-btn text-on-action hover:text-information disabled:text-disabled">
  Resolver todas as questões
  <svg 
    width="18" 
    height="20" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    class="cursor-pointer"
    fill="none"
    stroke="currentColor"
  >
    <path 
      d="M5 12H19M19 12L12 5M19 12L12 19" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</button>


</div>

</template>

<style scoped>


.lista-questoes {

  width:100%;
  border-top:1px solid #cacbcf;
  
  background:#ffffff;

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

@media(max-width:480px){

  .lista-questoes{

    padding:10px;

  }

  .lista-questoes.lista {

    gap: 8px;

  }

  .resultado-acoes {

    padding: 6px 10px;

  }

}



.loading,
.empty {

  text-align:center;

  padding:40px;

  color:#6b7280;

}

.resultado-acoes{
    display: flex;
    align-items: center;
    gap: 32px;

    padding: 6px 0;
}

.resultado{
    display: flex;
    align-items: flex-end;
    gap: 7px;
}

.resultado strong{
    font-size: 16px;
    font-weight: 700;
    color: #0d6b4d;
    line-height: 1;
}

.resultado span{
    font-size: 16px;
    color: #6b7280;
    white-space: nowrap;
}

.resolver-btn{

    display:inline-flex;
    align-items:center;
    gap:10px;

    padding:0px 15px 0px 16px;
    width:240px;
    height:40px;
    background:#fafafa36;
    margin-right: 40px;
    margin-left: auto;
    border:1px solid #5e5e5c7c;

    border-radius:9px;

    color:#444;

    transition:.2s;
}

.resolver-btn:hover{

    background:#f3f6f4;
    border-color:#dbe8df;

}

.resolver-btn .material-icons{
    font-size:21px;
    color:#1f6f5c;
}



.resolver-btn:hover .material-icons{
    transform:scale(1.08);
}

@media (max-width: 480px) {

  .resolver-btn {

    width: 100%;

    margin: 0;

    justify-content: center;

  }

}

</style>
