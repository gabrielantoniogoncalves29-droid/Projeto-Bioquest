<template>

  <div class="painel-filtros">

    <div class="coluna">

<FiltrosAccordion
    titulo="Ano da prova"
    :opcoes="anos"
    v-model="anosSelecionados"
/>

<FiltrosAccordion
    titulo="Categoria"
    :opcoes="niveis"
    v-model="niveisSelecionados"
/>

<FiltrosAccordion
    titulo="Eixo Temático"
    :opcoes="eixos"
    v-model="eixosSelecionados"
/>


    </div>

    <div class="coluna">

<FiltrosAccordion
    titulo="Conteúdo"
    :opcoes="conteudos"
    v-model="conteudosSelecionados"
/>

<FiltrosSubconteudo
    :conteudos="conteudos"
    :conteudosSelecionados="conteudosSelecionados"
    v-model="subconteudosSelecionados"
/>

    </div>

    <div class="acoes">

      <FiltrosAcoes />

    </div>

  </div>

</template>

<script setup>

import { ref, computed } from 'vue'

import {
  anos,
  niveis,
  eixos,
  conteudos
} from '@/features/Questoes/data/filtros.js'
import FiltrosSubconteudo from './FiltroSubconteudo.vue'
import FiltrosAccordion from './Filtros.vue'
import FiltrosAcoes from './FiltrosAcoes.vue'

const anosSelecionados = ref([])

const niveisSelecionados = ref([])

const eixosSelecionados = ref([])

const conteudosSelecionados = ref([])

const subconteudosSelecionados = ref([])

const subconteudosFiltrados = computed(() => {

  const lista = []

  conteudosSelecionados.value.forEach(id => {

    const conteudo = conteudos.find(item => item.id === id)

    if(!conteudo) return

    conteudo.subconteudos.forEach((sub,index)=>{

      lista.push({

        id: `${id}-${index}`,

        nome: sub

      })

    })

  })

  return lista

})

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

</style>