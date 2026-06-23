<script setup>

import { ref } from 'vue'


const props = defineProps({

  questao:{
    type:Object,
    required:true
  }

})


const favoritada = ref(false)

const copiado = ref(false)



function favoritar(){

  favoritada.value = !favoritada.value

}



async function copiarLink(){


  await navigator.clipboard.writeText(
    window.location.href
  )


  copiado.value = true



  setTimeout(()=>{

    copiado.value = false

  },2000)


}





async function compartilhar(){


  if(navigator.share){


    await navigator.share({

      title:
      `Questão ${props.questao.numeroQuestao}`,

      text:
      props.questao.resumo,

      url:
      window.location.href

    })


  }else{


    copiarLink()


  }


}



</script>




<template>


<section class="box">



<h3>
  Ações
</h3>




<button
class="action"
@click="favoritar"
>


<span>

  {{ favoritada ? '★' : '☆' }}

</span>



{{ favoritada
? 'Favoritada'
: 'Favoritar questão'
}}


</button>







<button

class="action"

@click="copiarLink"

>


<span>
  🔗
</span>


{{ copiado
? 'Link copiado'
: 'Copiar link'
}}



</button>







<button

class="action"

@click="compartilhar"

>


<span>
  📤
</span>


Compartilhar


</button>





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


margin:0 0 16px;


}





.action{


width:100%;


height:42px;


background:white;


border:1px solid #e5ebe8;


border-radius:8px;


display:flex;


align-items:center;


gap:10px;


padding:0 14px;


margin-bottom:10px;


font-size:14px;


font-weight:600;


color:#404245;


cursor:pointer;


transition:.2s;


}





.action span{


font-size:18px;


}





.action:hover{


background:#f8faf9;


border-color:#1f6f5c;


color:#1f6f5c;


}





</style>