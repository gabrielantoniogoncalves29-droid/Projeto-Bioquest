<script setup>
import Header from '../components/layout/Header.vue'
import TopBanner from '@/features/Estatisticas/TopBanner.vue'
import Sequencia from '../features/Estatisticas/Sequencia.vue'
import Rodape from '../components/layout/Rodape.vue'
</script>

<template>
  <Header />
  <div class="stats-page">
    <div class="stats-page__inner">
      <TopBanner />
      <Sequencia />
    </div>
  </div>
  <Rodape />
</template>

<style scoped>
.stats-page {
  box-sizing: border-box;
  width: 100%;
  min-height: 60vh;
  background: var(--cor-fundo-pagina);
  overflow-x: clip;
}
.stats-page__inner {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
}
.stats-page__inner > * { min-width: 0; }

@media (max-width: 900px) {
  .stats-page { padding: 22px 20px 50px; }
}
@media (max-width: 580px) {
  .stats-page { padding: 16px 14px 35px; }
  .stats-page__inner { gap: 16px; }
}
</style>