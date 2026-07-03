<script setup>


defineProps({

  questao:{
    type:Object,
    required:true
  },


  navegacao:{
    type:Object,
    default:()=>({

      atual:1,

      total:10

    })

  }

})


</script>




<template>


<aside class="sidebar">



<div class="box">


<h3>
  Navegação
</h3>




<router-link
  to="/questoes"
  class="back"
>

  ← Voltar para questões

</router-link>




<div class="divider"></div>






<div class="current">


<span>
  Questão atual
</span>


<strong>

  {{ questao.numeroQuestao }}

</strong>


</div>







<div class="progress">


<span
v-for="numero in navegacao.total"
:key="numero"

:class="{

active:
numero === navegacao.atual

}"

>

</span>


</div>







<div class="buttons">



<button
class="previous"
>

← Anterior

</button>





<button
class="next"
>

Próxima →

</button>



</div>




</div>


</aside>


</template>







<style scoped>


.sidebar{


position:sticky;


top:20px;


}





.box{


background:white;


border:1px solid #e7ece9;


border-radius:12px;


padding:20px;


}





h3{


font-size:17px;


color:#222;


margin:0 0 18px;


}





.back{


display:flex;


align-items:center;


gap:8px;


text-decoration:none;


color:#1f6f5c;


font-size:14px;


font-weight:600;


}





.divider{


height:1px;


background:#edf0ef;


margin:18px 0;


}





.current{


display:flex;


justify-content:space-between;


align-items:center;


}



.current span{


font-size:13px;


color:#6b7280;


}





.current strong{


font-size:20px;


color:#1f6f5c;


}





.progress{


display:flex;


gap:7px;


margin:20px 0;


flex-wrap:wrap;


}





.progress span{


width:10px;


height:10px;


border-radius:50%;


background:#dce5e1;


}





.progress span.active{


background:#1f6f5c;


}





.buttons{


display:flex;


flex-direction:column;


gap:10px;


}





button{


height:38px;


border-radius:8px;


font-weight:700;


font-size:13px;


cursor:pointer;


}





.previous{


background:white;


border:1px solid #d9e2de;


color:#515357;


}





.next{


background:#1f6f5c;


border:1px solid #1f6f5c;


color:white;


}





button:hover{


opacity:.9;


}




.section{

margin-top:20px;

}



h2{

font-size:18px;

color:#222;

margin-bottom:14px;

}





.cards{

display:grid;

grid-template-columns:1fr 1fr;

gap:20px;

}




.card{

background:#fff;

border:1px solid #e5eee9;

border-radius:16px;

padding:18px;

display:flex;

align-items:center;

gap:16px;

box-shadow:0 4px 12px rgba(0,0,0,.05);

}





.objeto-icon{


width:85px;

height:85px;

padding:6px;

object-fit:contain;


}





.info{

display:flex;

flex-direction:column;

gap:6px;


}



.label{

font-size:13px;

color:#78827d;

}



.tag{


background:#1f8a5b;

color:white;

width:max-content;

padding:3px 10px;

border-radius:20px;

font-size:12px;

font-weight:bold;


}



h3{


font-size:15px;

color:#26332d;

margin:0;

line-height:1.3;


}







.estrutura-box{


background:#fff;

border:1px solid #e5eee9;

border-radius:16px;

padding:18px;


}




.estrutura{


background:#f9fcfa;

border-radius:12px;

padding:15px;


display:flex;

align-items:center;

gap:12px;

flex-wrap:wrap;


}



.estrutura-item{


display:flex;

align-items:center;

gap:10px;

font-size:14px;

font-weight:600;

color:#1f6f5c;


}




.estrutura-icon{


width:52px;

height:52px;

border-radius:50%;

background:#e7f5ee;


}



.arrow{


font-size:26px;

color:#9aa6a0;


}






@media(max-width:800px){


.cards{

grid-template-columns:1fr;

}


}



</style>