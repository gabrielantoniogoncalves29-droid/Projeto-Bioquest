<template>
<Header />
  <main class="biblioteca-page">

    <BibliotecaHeader />

    <BarraPesquisa />

    <PainelFiltros />

    <FiltrosAcoes/>

    <Ordenacao />

    <ListaQuestoes />

  </main>

</template>

<script setup>

import Header from '@/components/layout/Header.vue'
import BibliotecaHeader from '@/features/Questoes/Pagina incial/BibliotecaHeader.vue'
import BarraPesquisa from '@/features/Questoes/Pagina incial/BarraPesquisa.vue'
import PainelFiltros from '@/features/Questoes/Pagina incial/PainelFiltros.vue'
import Ordenacao from '@/features/Questoes/Pagina incial/Ordenacao.vue'
import ListaQuestoes from '@/features/Questoes/Pagina incial/ListaQuestoes.vue'
import FiltrosAcoes from '@/features/Questoes/Pagina incial/FiltrosAcoes.vue'

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

@media (max-width: 480px) {

  .biblioteca-page {

    padding: 12px;

    gap: 16px;

  }

}

</style>
