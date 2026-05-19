<script setup>
import { ref } from 'vue'

import CardQuestao  from '@/components/layout/Questoes_card.vue'
import Ordenar from '@/components/layout/Ordenar.vue'
import Filtros  from '@/components/layout/Filtro.vue'

const aberta = ref(null);
const opcaoSelecionada = ref("Ordenar por");
const sidebarWidth = ref(280);

function barra(id){
    if(aberta.value === id){
      aberta.value = null
    }
    else{
      aberta.value = id
    }
  }

function selecionar(opcao){
    opcaoSelecionada.value = opcao
    aberta.value = null
}
</script>

<template>

<div class="layout-geral">

<Filtros class="sidebar" :v-model="sidebarWidth" />
    <main class="conteudo">

        <Ordenar />

        <section class="cards">

            <div class="lista-cards">

                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />

            </div>

        </section>

    </main>

</div>

</template>

<style scoped>
header{
    height: 50px;
    display: flex;
    align-items: center;
}

.layout-geral{
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #f7f7f7;
}

.sidebar{
    flex-shrink: 0;
    width: 260px;
    height: 100vh;
    background: white;
    border-right: 1px solid #e5e5e5;
    overflow: hidden;
}

.conteudo{
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 24px;

    overflow: hidden;
}



.cards{
    flex: 1;
    overflow: hidden;
}

.lista-cards{
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding-right: 8px;
}

.material-icons{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
</style>