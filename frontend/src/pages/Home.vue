<script setup>
import Header from '../components/layout/Header.vue'
import TopBanner from '../features/Inicio/TopBanner.vue'
import Description from '../features/Inicio/GeneralDescription.vue'
import QuestoesDes from '../features/Inicio/QuestoesDescription.vue'
import Funcionalidades from '../features/Inicio/Funcionalidades.vue'
import Rodape from '../components/layout/Rodape.vue'
</script>

<template>
  <Header></Header>

  <main>
    <TopBanner></TopBanner>
    <Description></Description>
    <QuestoesDes></QuestoesDes>
    <Funcionalidades></Funcionalidades>
  </main>
  
  <Rodape></Rodape>    
</template>

