<script setup>

import { computed } from 'vue'

import { useResolverStore } from '@/store/resolver/resolver'

const resolver = useResolverStore()

const questao = computed(() => resolver.questao)



const enunciado = computed(
    () => resolver.questao?.enunciado ?? null
)


</script>



<template>


<div
    v-if="enunciado"
    class="enunciado-container"
    :class="{ 'sem-imagem': !questao.enunciado.imagem }"
>


  <div class="texto-container">


    <h2>

      {{ questao.enunciado.textoPrincipal }}

    </h2>



    <p>

      {{ questao.enunciado.textoComplementar }}

    </p>


  </div>



  <div

    v-if="questao.enunciado.imagem"

    class="imagem-container"

  >


    <img

      :src="questao.enunciado.imagem"

      :alt="questao.enunciado.alt"

    />


  </div>



</div>


</template>





<style scoped>

.enunciado-container {

  display: grid;

  grid-template-columns: 55% 45%;

  gap: 24px;

  padding: 20px;

  border-bottom: 1px solid #e9ecef;

  align-items: start;

}

.enunciado-container.sem-imagem {

  grid-template-columns: 1fr;

}



.imagem-container {

  border-radius: 12px;

  overflow: hidden;

  background:white;

  height: 300px;

}



.imagem-container img {

  width:100%;

  height:100%;

  object-fit:contain;

  display:block;

}



.texto-container {

  display:flex;

  flex-direction:column;

  justify-content:center;

}



.texto-container h2 {

  font-size:1.1rem;

  line-height:1.7;

  color:#1f2937;

  margin-bottom:14px;

  font-weight:500;

  letter-spacing:.01em;

}



.texto-container p {

  font-size:.95rem;

  line-height:1.8;

  color:#5b6472;

}



@media(max-width:1100px){


.enunciado-container{

grid-template-columns:1fr;

}

.imagem-container{

height:240px;

}


}

</style>