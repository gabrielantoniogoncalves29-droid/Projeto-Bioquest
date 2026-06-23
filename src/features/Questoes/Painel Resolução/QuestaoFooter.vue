<script setup>

import { useRouter } from 'vue-router'


const props = defineProps({

  questao: {

    type: Object,

    required: true

  },


  proximaQuestao: {

    type: Number,

    default: null

  },
questaoAnterior: {

type:Number,

default:null

}
})



const router = useRouter()



function responder(){


router.push(

`/resolver/${props.questao.id}`

)


}



function verExplicacao(){


console.log(
'Mostrar explicação da questão',
props.questao.id
)


}



function proxima(){


if(!props.proximaQuestao)
return



router.push(

`/resolver/${props.proximaQuestao}`

)
}


function anterior(){

if(!props.questaoAnterior)
return


router.push(
`/resolver/${props.questaoAnterior}`
)

}

</script>

<template>


<div class="footer-questao">



  <button

    class="btn-responder"

    @click="responder"

  >

    Responder

  </button>





  <div class="acoes-direita">



    <button

      class="btn-explicacao"

      @click="verExplicacao"

    >

      Ver explicação

    </button>





    <button

      class="btn-proxima"

      @click="proxima"

      :disabled="!proximaQuestao"

    >

      Próxima questão →

    </button>
    



  </div>





</div>


</template>

<style scoped>

.footer-questao {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 16px 20px;

  border-top: 1px solid #eef1f3;

  background: #fafbfc;

}

.acoes-direita {

  display: flex;

  gap: 10px;

}

.btn-explicacao {

  background: white;

  border: 1px solid #d8dee4;

  color: #374151;

  padding: 8px 14px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;

  transition: all .15s ease;

}

.btn-explicacao:hover {

  border-color: #0d6b4d;

  color: #0d6b4d;

  background: #f7fcf9;

}

.btn-proxima {

  background: #0d6b4d;

  color: white;

  border: none;

  padding: 8px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition: all .15s ease;

}

.btn-responder {
    margin-left: 18px;
    background: #0d6b4d;
    
    color: white;
    
    border: none;
    
    padding: 10px 20px;
    
    border-radius: 8px;
    
    font-size: 14px;
    
    font-weight: 600;
    
    cursor: pointer;
    
    transition: all .15s ease;
}
.btn-responder:hover ,
.btn-proxima:hover {

  opacity: .92;

}

@media (max-width: 768px) {

  .footer-questao {

    flex-direction: column;

    align-items: stretch;

    gap: 12px;

  }

  .acoes-direita {

    width: 100%;

    display: flex;

    flex-direction: column;

  }

  .btn-explicacao,
  .btn-proxima {

    width: 100%;

  }

}

</style>