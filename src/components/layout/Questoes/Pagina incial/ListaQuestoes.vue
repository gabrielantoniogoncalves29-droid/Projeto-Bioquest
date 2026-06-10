<script setup>

import QuestoesCard from './Questoes_card.vue'



defineProps({
  modo: String
})

</script>


<template>

<section
  class="lista-questoes"
  :class="modo"
>

  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />
  <QuestoesCard />

</section>

</template>



<style scoped>

.lista-questoes {

  width: 100%;

}

.lista-questoes.lista {

  display: flex;

  flex-direction: column;

  gap: 16px;

}

.lista-questoes.grade {

  display: grid;

  grid-template-columns: repeat(
    auto-fill,
    minmax(450px, 1fr)
  );

  gap: 20px;

  width: 100%;

}

@media (max-width: 768px) {

  .lista-questoes {

    grid-template-columns: 1fr;

  }

}

</style>