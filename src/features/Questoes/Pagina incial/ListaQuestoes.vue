<script setup>

import { onMounted, computed } from 'vue'

import QuestoesCard from './Questoes_card.vue'

import { useQuestoesStore } from '@/store/questoes_card.js'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'


const store = useQuestoesStore()
const filtrosStore = useQuestoesFiltrosStore()


const questoes = computed(() => {

  return store.questoesOrdenadas

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


</template>

<style scoped>


.lista-questoes {

  width:100%;
  border-top:1px solid var(--cor-borda);
  
  background: var(--cor-fundo-card);

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

  color:var(--cor-texto-suave);

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
    color: var(--cor-primaria);
    line-height: 1;
}

.resultado span{
    font-size: 16px;
    color: var(--cor-texto-suave);
    white-space: nowrap;
}

.resolver-btn{

    display:inline-flex;
    align-items:center;
    gap:10px;

    padding:0px 15px 0px 16px;
    width:240px;
    height:40px;
    background: color-mix(in srgb, var(--cor-fundo-sutil) 21%, transparent);
    margin-right: 40px;
    margin-left: auto;
    border:1px solid var(--cor-borda);

    border-radius:9px;

    color:var(--cor-texto-secundario);

    transition:.2s;
}

.resolver-btn:hover{

    background:var(--cor-fundo-sutil);
    border-color:var(--cor-borda);

}

.resolver-btn .material-icons{
    font-size:21px;
    color:var(--cor-primaria-texto);
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


[data-tema="escuro"] .resultado strong{
    color: var(--cor-primaria-texto);
}

</style>
