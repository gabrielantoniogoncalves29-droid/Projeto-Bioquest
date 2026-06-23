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
  Estrutura dos livros didáticos
</h2>



<div class="estrutura">


  <template
    v-for="(item,index) in questao.estrutura"
    :key="item.nome"
  >


    <div class="item">


      <span class="icon">

        {{ item.icone }}

      </span>



      <span class="nome">

        {{ item.nome }}

      </span>


    </div>



    <span
      v-if="index < questao.estrutura.length - 1"
      class="arrow"
    >

      ›

    </span>


  </template>


</div>


</section>


</template>





<style scoped>


.section{

  margin-top:20px;

}



h2{

  font-size:18px;

  color:#222;

  margin:0 0 14px;

}





.estrutura{


width:100%;


background:#f9fcfa;


border:1px solid #e5eee9;


border-radius:10px;


padding:18px;


display:flex;


align-items:center;


gap:14px;


flex-wrap:wrap;


}





.item{


display:flex;


align-items:center;


gap:10px;


color:#1f6f5c;


font-size:14px;


font-weight:600;


}





.icon{


width:32px;


height:32px;


border-radius:50%;


background:#e7f5ee;


display:flex;


align-items:center;


justify-content:center;


font-size:16px;


}





.nome{


white-space:nowrap;


}





.arrow{


font-size:24px;


color:#9aa6a0;


}





@media(max-width:700px){


.estrutura{

  gap:10px;

}



}



</style>