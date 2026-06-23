<script setup>

defineProps({

  questao:{
    type:Object,
    required:true
  }

})

</script>


<template>


<section class="header-card">


  <div class="info">


    <div class="top">


      <span class="year">
        {{ questao.ano }}
      </span>


      <span>
        Questão {{ questao.numeroQuestao }}
      </span>


      <span>
        • {{ questao.tipo }}
      </span>


    </div>



    <h1>
      {{ questao.resumo }}
    </h1>



    <div class="tags">


      <span
        v-for="tag in questao.tags"
        :key="tag"
        class="tag"
      >

        {{ tag }}

      </span>


    </div>


  </div>




  <div class="actions">


    <button class="save">

      ♧

      Salvar

    </button>



    <button class="solve">

      Resolver questão

    </button>


  </div>


</section>


</template>



<style scoped>


.header-card {


background:white;


border:1px solid #e7ece9;


border-radius:12px;


padding:22px;


display:flex;


justify-content:space-between;


align-items:center;


gap:30px;


}



.info{


flex:1;


min-width:0;


}




.top{


display:flex;


align-items:center;


gap:10px;


font-size:14px;


color:#6b7280;


margin-bottom:14px;


}




.year{


background:#e7f5ee;


color:#1f6f5c;


padding:5px 12px;


border-radius:999px;


font-weight:700;


}





h1{


font-size:22px;


line-height:1.35;


font-weight:700;


color:#222;


margin:0 0 16px;


}





.tags{


display:flex;


gap:10px;


flex-wrap:wrap;


}





.tag{


background:#e7f5ee;


color:#1f6f5c;


padding:6px 14px;


border-radius:999px;


font-size:13px;


font-weight:600;


}





.actions{


display:flex;


gap:10px;


align-items:center;


}




button{


height:40px;


padding:0 20px;


border-radius:8px;


font-weight:700;


cursor:pointer;


font-size:14px;


}



.save{


background:white;


border:1px solid #1f6f5c;


color:#1f6f5c;


}



.solve{


background:#1f6f5c;


border:1px solid #1f6f5c;


color:white;


}




@media(max-width:900px){


.header-card{


flex-direction:column;


align-items:flex-start;


}



.actions{


width:100%;


}



}



</style>