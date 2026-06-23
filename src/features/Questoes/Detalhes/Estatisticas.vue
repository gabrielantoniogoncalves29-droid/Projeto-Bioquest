<script setup>


defineProps({

  questao:{
    type:Object,
    required:true
  }

})


</script>





<template>


<section class="box">



<h3>
  Estatísticas
</h3>




<div class="stat">


<span class="label">
  Taxa de acerto
</span>




<div class="percent">


<strong>

{{ questao.informacoes.taxaAcerto }}

</strong>


</div>




<div class="progress">


<div
class="fill"
:style="{
width: questao.informacoes.taxaAcerto
}"
>


</div>


</div>



</div>






<div class="divider"></div>







<div class="item">


<span>
  👥 Resolvida por
</span>


<strong>

{{ questao.informacoes.resolvidaPor }}

</strong>


</div>







<div class="item">


<span>
  ⭐ Favoritada por
</span>


<strong>

{{ questao.informacoes.favoritadaPor }}

</strong>


</div>







<div class="item">


<span>
  📊 Dificuldade
</span>


<strong
class="difficulty"
>


{{ questao.nivel }}


</strong>


</div>





</section>


</template>







<style scoped>


.box{


background:white;


border:1px solid #e7ece9;


border-radius:12px;


padding:20px;


margin-top:16px;


}





h3{


font-size:17px;


color:#222;


margin:0 0 18px;


}





.label{


display:block;


font-size:13px;


color:#6b7280;


margin-bottom:6px;


}





.percent{


display:flex;


justify-content:flex-end;


margin-bottom:8px;


}





.percent strong{


font-size:22px;


color:#1f6f5c;


}





.progress{


height:8px;


background:#e8efec;


border-radius:999px;


overflow:hidden;


}





.fill{


height:100%;


background:#1f8a5b;


border-radius:999px;


}





.divider{


height:1px;


background:#edf0ef;


margin:20px 0;


}





.item{


display:flex;


justify-content:space-between;


align-items:center;


font-size:14px;


margin-bottom:14px;


gap:10px;


}





.item span{


color:#6b7280;


}





.item strong{


color:#303438;


font-weight:700;


}





.difficulty{


background:#fff3cd;


color:#856404 !important;


padding:4px 10px;


border-radius:999px;


font-size:12px;


}





</style>