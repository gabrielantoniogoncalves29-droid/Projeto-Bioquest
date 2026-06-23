<script setup>


defineProps({

  questao:{
    type:Object,
    required:true
  }

})


</script>




<template>


<section class="section">


<h2>
  Enunciado
</h2>



<div class="enunciado">


<p class="texto">

  {{ questao.enunciado.texto }}

</p>




<img
  v-if="questao.enunciado.imagem"
  :src="questao.enunciado.imagem"
  class="imagem"
  alt="Imagem da questão"
/>





<div
  v-if="questao.enunciado.alternativas"
  class="alternativas"
>


<div
  v-for="alternativa in questao.enunciado.alternativas"
  :key="alternativa.letra"
  class="alternativa"
>


<span class="letra">

  {{ alternativa.letra }}

</span>



<span>

  {{ alternativa.texto }}

</span>



</div>


</div>




</div>


</section>


</template>





<style scoped>


.section{

  margin-top:24px;

}





h2{

  font-size:18px;

  color:#222;

  margin:0 0 16px;

}





.enunciado{


background:white;


border:1px solid #e7ece9;


border-radius:12px;


padding:24px;


}





.texto{


font-size:16px;


line-height:1.7;


color:#404245;


margin:0;


white-space:pre-line;


}





.imagem{


display:block;


max-width:100%;


margin:24px auto;


border-radius:10px;


}





.alternativas{


display:flex;


flex-direction:column;


gap:12px;


margin-top:24px;


}





.alternativa{


display:flex;


align-items:flex-start;


gap:12px;


padding:14px;


border:1px solid #e5ebe8;


border-radius:10px;


font-size:15px;


line-height:1.5;


color:#404245;


}





.letra{


width:28px;


height:28px;


border-radius:50%;


background:#e7f5ee;


color:#1f6f5c;


font-weight:700;


display:flex;


align-items:center;


justify-content:center;


flex-shrink:0;


}





.alternativa:hover{


background:#f8faf9;


}




</style>