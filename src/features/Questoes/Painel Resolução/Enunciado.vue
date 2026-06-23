<script setup>


defineProps({

  questao:{

    type:Object,

    required:true

  }

})


</script>




<template>


<div class="enunciado-container">



  <div

    v-if="questao.enunciado.imagem"

    class="imagem-container"

  >


    <img

      :src="questao.enunciado.imagem"

      :alt="questao.enunciado.alt"

    />


  </div>




  <div class="texto-container">


    <h2>

      {{ questao.enunciado.textoPrincipal }}

    </h2>



    <p>

      {{ questao.enunciado.textoComplementar }}

    </p>


  </div>



</div>


</template>





<style scoped>

.enunciado-container {

  display: grid;

  grid-template-columns: 45% 55%;

  gap: 20px;

  padding: 20px;

  border-bottom: 1px solid #e9ecef;

}



.imagem-container {

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  overflow: hidden;

  background:white;

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

  line-height:1.6;

  color:#1f2937;

  margin-bottom:12px;

  font-weight:600;

}



.texto-container p {

  font-size:.95rem;

  line-height:1.7;

  color:#4b5563;

}



@media(max-width:1100px){


.enunciado-container{

grid-template-columns:1fr;

}


}

</style>