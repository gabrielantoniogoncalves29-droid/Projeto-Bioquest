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
  Classificação ENEM
</h2>



<div class="cards">



  <div class="item">


    <div class="icon">

      🧬

    </div>



    <div class="text">


      <div class="title">


        Competência


        <span>
          {{ questao.enem.competencia }}
        </span>


      </div>



      <p>

        {{ questao.enem.descricaoCompetencia }}

      </p>


    </div>



  </div>







  <div class="item">


    <div class="icon">

      🧠

    </div>



    <div class="text">


      <div class="title">


        Habilidade


        <span>
          {{ questao.enem.habilidade }}
        </span>


      </div>



      <p>

        {{ questao.enem.descricaoHabilidade }}

      </p>


    </div>



  </div>



</div>



</section>


</template>




<style scoped>


.section{


margin-top:18px;


}



h2{


font-size:18px;


color:#222;


margin:0 0 14px;


}



.cards{


display:grid;


grid-template-columns:1fr 1fr;


gap:14px;


}




.item{


background:#f9fcfa;


border:1px solid #e5eee9;


border-radius:10px;


padding:18px;


display:flex;


gap:15px;


align-items:flex-start;


}




.icon{


width:42px;


height:42px;


border-radius:50%;


background:#e7f5ee;


display:flex;


align-items:center;


justify-content:center;


font-size:20px;


flex-shrink:0;


}





.text{


flex:1;


}




.title{


font-size:15px;


font-weight:700;


color:#303438;


display:flex;


align-items:center;


gap:10px;


}





.title span{


background:#1f8a5b;


color:white;


padding:3px 9px;


border-radius:6px;


font-size:12px;


}





p{


margin:10px 0 0;


font-size:14px;


line-height:1.5;


color:#596066;


}





@media(max-width:800px){


.cards{


grid-template-columns:1fr;


}



}



</style>