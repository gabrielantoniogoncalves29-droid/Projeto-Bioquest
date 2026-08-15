<template>

  <div
    v-show="store.mostrarFiltros"
    class="painel-filtros"
  >

    <div class="coluna">

      <FiltrosAccordion
        titulo="Eixo Temático"
        filtro="eixosSelecionados"
      />

      <FiltrosAccordion
        titulo="Conteúdo"
        filtro="conteudosSelecionados"
      />

      <FiltrosSubconteudo />

    </div>

    <div class="coluna">

      <FiltrosAccordion
        titulo="Ano da prova"
        filtro="anosSelecionados"
      />

      <FiltrosAccordion
        titulo="Categoria"
        filtro="niveisSelecionados"
      />

      <FiltrosAccordion
        titulo="Estado"
        filtro="estadoSelecionado"
      />

    </div>

  </div>

</template>

<script setup>

import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import FiltrosSubconteudo from './FiltroSubconteudo.vue'
import FiltrosAccordion from './Filtros.vue'

const store = useQuestoesFiltrosStore()

</script>

<style scoped>

.painel-filtros{

  display:grid;

  grid-template-columns: 1fr 1fr;

  gap:24px;
  margin: 10px 20px;
  padding:24px;

  border:1px solid #e5e7eb;

  border-radius:14px;

  background:white;

}

.coluna{

  display:flex;

  flex-direction:column;

  gap:16px;

}

.acoes{

  grid-column:1 / -1;

  margin-top:10px;

}

@media(max-width:900px){

  .painel-filtros{

    grid-template-columns:1fr;

  }

}

@media(max-width:768px){

  .painel-filtros{

    margin: 10px 12px;
    padding: 16px;
    gap: 16px;

  }

}

@media(max-width:480px){

  .painel-filtros{

    margin: 8px;
    padding: 12px;
    border-radius: 10px;

  }

}

</style>
