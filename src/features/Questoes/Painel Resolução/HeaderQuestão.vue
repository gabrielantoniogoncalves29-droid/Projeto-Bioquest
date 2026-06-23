<script setup>

import {computed} from 'vue'


const props = defineProps({

questao:{

type:Object,

default:()=>({})

},


idsQuestoes:{

 type:Array,

 default:()=>[]

}

})



const indiceAtual = computed(()=>{


return props.idsQuestoes.indexOf(
props.questao.id
)


})




const questaoAnterior = computed(()=>{


if(indiceAtual.value <= 0)
return null


return props.idsQuestoes[
indiceAtual.value - 1
]


})




const proximaQuestao = computed(()=>{


if(
indiceAtual.value === -1 ||
indiceAtual.value >= props.idsQuestoes.length-1
)

return null



return props.idsQuestoes[
indiceAtual.value + 1
]


})


</script>

<template>

<div class="header-questao">


  <div class="header-top">


    <div class="info-esquerda">


      <span class="badge-ano">

        {{ questao.ano }}

      </span>




      <div class="navegacao">



        <span

          class="texto-info"

          :class="{
            disabled: !questaoAnterior
          }"

        >

          ← Anterior

        </span>





        <span class="texto-info-static">


          Questão

          {{ questao.id }}



        </span>





        <span

          class="texto-info"

          :class="{
            disabled: !proximaQuestao
          }"

        >

          Próxima →

        </span>




      </div>



    </div>





    <div class="acoes">



      <button class="btn-salvar">


        <span class="material-icons">

          bookmark_border

        </span>


        Salvar questão


      </button>





       

<router-link
:to="`/detalhes/${questao.id}`"
 class="details-btn">

          Ver detalhes

          <span class="arrow">
            ❯
          </span>
</router-link>




    </div>



  </div>







<div class="header-bottom">


  <span class="codigo">

    Código:
    {{ questao.id }}

  </span>


</div>
</div>

</template>

<style scoped>

.header-questao {
  padding: 24px 28px;
  border-bottom: 1px solid #e9ecef;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-esquerda {
  display: flex;
  align-items: center;
  gap: 30px; 
}

.navegacao {

  display: flex;
  flex: 1;               
  justify-content: center;
  align-items: center;
  gap: 17px;               
}




.badge-ano {
  background: #e8f6ef;
  color: #0d6b4d;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.texto-info {

  color: #2a313dc6;           
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  cursor: pointer;
  transition: all .15s ease;
}

.texto-info-static {

  color: #282f3bd7;           
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
}

.texto-info:hover {
  color: #0d6b4d;            
}

.acoes {
  display: flex;
  gap: 12px;

}

.btn-salvar {
  background: transparent;
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.details-btn {

  border: none;


  padding: 0 12px;

  background: transparent;

  display: flex;

  align-items: center;

  gap: 6px;

  font-size: 14px;

  font-weight: 300;

  color: #515357;

  cursor: pointer;

    text-decoration: none; 
  display: inline-block; 

}





.details-btn:hover {

  color: #1f6f5c;

}





.arrow {

  font-size: 13px;

}


.header-bottom {
  margin-top: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 10px;
}

.tag-verde {
  background: #e8f6ef;
  color: #0d6b4d;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.tag-azul {
  background: #e7f0ff;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}

.codigo {
  color: #5d636f;
  font-size: 14px;
}

@media (max-width: 768px) {

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }


}

</style>