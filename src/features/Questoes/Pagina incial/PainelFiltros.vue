<script setup>
import {ref, computed} from 'vue'
import {
 anos,
 niveis,
 eixos,
 conteudos
} from '@/features/Questoes/data/filtros.js'


import FiltrosSelect from './filtros/FiltrosSelect.vue'
import FiltrosCheckbox from './filtros/FiltrosCheckbox.vue'
import FiltrosAcoes from './filtros/FiltrosAcoes.vue'


const conteudosSelecionados = ref([])
const subconteudosSelecionados = ref([])

const subconteudosFiltrados = computed(() => {


  const resultado = []


  conteudosSelecionados.value.forEach(id => {


    const conteudo = conteudos.find(
      item => item.id === id
    )


    if(conteudo){


      conteudo.subconteudos.forEach((sub,index)=>{


        resultado.push({

          id:`${id}-${index}`,

          nome:sub

        })


      })


    }


  })


  return resultado


})
</script>


<template>

<div class="painel-filtros">

  <div class="linha-filtros">

    <FiltrosSelect
      titulo="Ano da prova"
      placeholder="Todos"
      :opcoes="anos"
    />

    <FiltrosSelect
      titulo="Categoria"
      placeholder="Todos"
      :opcoes="niveis"
    />

    <FiltrosSelect
      titulo="Eixo temático"
      placeholder="Todos"
      :opcoes="eixos"
    />

<FiltrosCheckbox

  titulo="Conteúdo"

  :opcoes="conteudos"

  v-model="conteudosSelecionados"

/>

<FiltrosCheckbox

titulo="Subconteúdo"

:opcoes="subconteudosFiltrados"

v-model="subconteudosSelecionados"

/>

  </div>
  </div>

</template>
  <style scoped>

.painel-filtros {

  display: flex;

  flex-direction: column;

  gap: 24px;
  box-sizing: border-box;
  padding: 24px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

}

.linha-filtros {

  display: grid;

grid-template-columns:
  repeat(auto-fit, minmax(160px, 1fr));

  gap: 18px;

}



.linha-checkbox {

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(320px, 1fr));

  gap: 24px;

}

@media (max-width: 1400px) {

  .linha-filtros {

    grid-template-columns:
      repeat(3, minmax(180px, 1fr));

  }

}

@media (max-width: 900px) {

  .linha-filtros {

    grid-template-columns:
      repeat(2, minmax(180px, 1fr));

  }

}

@media (max-width: 600px) {

  .linha-filtros {

    grid-template-columns: 1fr;

  }

  .linha-checkbox {

    grid-template-columns: 1fr;

  }

}

</style>