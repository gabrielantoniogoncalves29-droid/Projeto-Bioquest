<template>
<Header />
  <main class="biblioteca-page">

    <BibliotecaHeader />

    <BarraPesquisa
      :filtros-abertos="mostrarFiltros"
      @toggle-filtros="toggleFiltros"
    />

    <PainelFiltros
      v-if="mostrarFiltros"
    />
<Ordenacao
  :modo="modoVisualizacao"
  @alterarModo="modoVisualizacao = $event"
/>

<ListaQuestoes
  :modo="modoVisualizacao"
/>



  </main>

</template>

<script setup>

import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import BibliotecaHeader from '@/components/layout/Questoes/Pagina incial/BibliotecaHeader.vue'
import BarraPesquisa from '@/components/layout/Questoes/Pagina incial/BarraPesquisa.vue'
import PainelFiltros from '@/components/layout/Questoes/Pagina incial/PainelFiltros.vue'
import Ordenacao from '@/components/layout/Questoes/Pagina incial/Ordenacao.vue'
import ListaQuestoes from '@/components/layout/Questoes/Pagina incial/ListaQuestoes.vue'


const mostrarFiltros = ref(true)

function toggleFiltros() {

  mostrarFiltros.value = !mostrarFiltros.value

}

const modoVisualizacao = ref('lista')

</script>

<style scoped>


.biblioteca-page {
  min-height: 100vh;
  padding: 28px;

  display: flex;

  flex-direction: column;

  gap: 22px;

}

@media (max-width: 768px) {

  .biblioteca-page {

    padding: 18px;

  }

}

</style>