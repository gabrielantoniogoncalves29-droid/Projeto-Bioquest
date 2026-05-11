<script setup>
import Header from '../components/layout/Header.vue';
import Banner from '../components/layout/TopBanner.vue';
import Filtro from '../components/layout/Filtro.vue';
import Ordenar from '@/components/layout/Ordenar.vue';
import Rodape from '../components/layout/Rodape.vue';
</script>

<template>
  <Header></Header>
  <Banner></Banner>
  <div id="topo">
    <Filtro></Filtro>
    <Ordenar></Ordenar>
  </div>
  <Rodape></Rodape> 
</template>

<style>
  #topo{
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
</style>