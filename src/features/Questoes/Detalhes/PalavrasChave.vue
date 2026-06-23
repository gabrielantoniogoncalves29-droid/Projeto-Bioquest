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
  Palavras-chave
</h2>



<div class="tags">


<span
  v-for="palavra in questao.palavrasChave"
  :key="palavra"
  class="tag"
>

  {{ palavra }}

</span>


</div>


</section>


</template>






<style scoped>


.section{

  margin-top:22px;

}





h2{

  font-size:18px;

  color:#222;

  margin:0 0 14px;

}







.tags{


display:flex;


flex-wrap:wrap;


gap:10px;


}





.tag{


background:#e7f5ee;


color:#1f6f5c;


padding:7px 14px;


border-radius:999px;


font-size:13px;


font-weight:600;


border:1px solid #d6eee2;


transition:.2s;


}





.tag:hover{


background:#d9f1e5;


transform:translateY(-1px);


}



</style>