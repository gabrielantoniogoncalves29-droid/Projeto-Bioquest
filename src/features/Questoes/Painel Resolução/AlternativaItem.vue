<script setup>

import { ref } from 'vue'


const props = defineProps({

  alternativas: {

    type: Array,

    default: () => []

  }

})


const selecionada = ref(null)



function selecionarAlternativa(letra){

  selecionada.value = letra

}


</script>



<template>

<div class="alternativas-container">


  <div

    v-for="alternativa in props.alternativas"

    :key="alternativa.letra"

    class="alternativa"

    :class="{

      selecionada: selecionada === alternativa.letra

    }"

    @click="selecionarAlternativa(alternativa.letra)"

  >


    <div

      class="letra"

      :class="{

        'letra-selecionada':
        selecionada === alternativa.letra

      }"

    >

      {{ alternativa.letra }}

    </div>



    <span>

      {{ alternativa.texto }}

    </span>



  </div>


</div>

</template>




<style scoped>


.alternativas-container {

  padding: 16px 20px;

  display: flex;

  flex-direction: column;

  gap: 8px;

}



.alternativa {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 10px 14px;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  cursor: pointer;

  transition: all .15s ease;

  background: white;

}



.alternativa:hover {

  border-color: #0d6b4d;

  background: #f9fcfa;

}



.letra {

  width: 30px;

  height: 30px;

  min-width: 30px;

  border-radius: 50%;

  border: 2px solid #0d6b4d;

  color: #0d6b4d;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 13px;

}



.alternativa span {

  font-size: 14px;

  line-height: 1.5;

  color: #374151;

}



.selecionada {

  background: #f2fbf7;

  border-color: #0d6b4d;

}



.letra-selecionada {

  background: #0d6b4d;

  color: white;

}


</style>