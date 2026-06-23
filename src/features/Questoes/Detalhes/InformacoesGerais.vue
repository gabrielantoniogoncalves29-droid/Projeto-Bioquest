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
  Informações gerais
</h2>



<div class="grid">


<div class="info">


  <div class="icon">
    📝
  </div>


  <div>

    <span class="label">
      Código da questão
    </span>


    <strong>
      {{ questao.informacoes.codigo }}
    </strong>


  </div>


</div>





<div class="info">


  <div class="icon">
    📅
  </div>


  <div>

    <span class="label">
      Ano da prova
    </span>


    <strong>
      {{ questao.ano }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    💬
  </div>


  <div>

    <span class="label">
      Tipo de questão
    </span>


    <strong>
      {{ questao.tipo }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    📊
  </div>


  <div>

    <span class="label">
      Nível de dificuldade
    </span>


    <strong>
      {{ questao.nivel }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    🧠
  </div>


  <div>

    <span class="label">
      Nível intelectual
    </span>


    <strong>
      {{ questao.informacoes.nivelIntelectual }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    📈
  </div>


  <div>

    <span class="label">
      Taxa de acerto
    </span>


    <strong>
      {{ questao.informacoes.taxaAcerto }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    👥
  </div>


  <div>

    <span class="label">
      Resolvida por
    </span>


    <strong>
      {{ questao.informacoes.resolvidaPor }}
    </strong>


  </div>


</div>







<div class="info">


  <div class="icon">
    ☆
  </div>


  <div>

    <span class="label">
      Favoritada por
    </span>


    <strong>
      {{ questao.informacoes.favoritadaPor }}
    </strong>


  </div>


</div>



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

  margin:0 0 16px;

}




.grid{


display:grid;


grid-template-columns:repeat(4,1fr);


gap:22px 30px;


}





.info{


display:flex;


align-items:center;


gap:12px;


}





.icon{


width:38px;


height:38px;


border-radius:50%;


background:#e7f5ee;


display:flex;


align-items:center;


justify-content:center;


font-size:18px;


flex-shrink:0;


}





.label{


display:block;


font-size:13px;


color:#6b7280;


margin-bottom:3px;


}





strong{


display:block;


font-size:14px;


color:#303438;


font-weight:700;


}





@media(max-width:1000px){


.grid{

grid-template-columns:repeat(2,1fr);

}


}



@media(max-width:600px){


.grid{

grid-template-columns:1fr;

}


}



</style>