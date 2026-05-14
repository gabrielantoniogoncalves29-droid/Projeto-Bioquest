<script setup>
import { ref } from 'vue'

import QuestaoCard from '@/components/layout/Questoes_card.vue'
import SidebarFiltro  from '@/components/layout/Filtro.vue'

const sidebarWidth = ref(280)
</script>

<template>
  <main
    class="layout"
    :style="{
      gridTemplateColumns: `${sidebarWidth}px 1fr`
    }"
  >
    <SidebarFiltro
      v-model:width="sidebarWidth"
    />
    <section class="cards">

      <QuestaoCard />
      <QuestaoCard />
      <QuestaoCard />
      <QuestaoCard />
      <QuestaoCard />
      <QuestaoCard />

    </section>

  </main>

</template>

<style scoped>

.layout {
  display: grid;

  gap: 20px;
  padding-top: 0px;
  padding: 10px;

  align-items: start;

}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  overflow-y: auto;
  height: calc(100vh - 40px);
  padding-right: 8px;
}

.cards::-webkit-scrollbar {
  width: 8px;
}

.cards::-webkit-scrollbar-thumb {
  background: #d3dbd7;
  border-radius: 999px;
}

.cards {
  scroll-behavior: smooth;
}

</style>