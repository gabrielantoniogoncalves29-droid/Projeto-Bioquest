<script setup>

import { computed } from 'vue'


const props = defineProps({
  questao: {
    type: Object,
    required: true
  },

  modo: {
    type: String,
    default: 'lista'
  }
})


const icone = computed(()=>{

  return new URL(
    `../icons/${props.questao.conteudoId}.png`,
    import.meta.url
  ).href

})


</script>


<template>

<div
  class="card"
  :class="modo"
>
    <div class="left">


      <img
        class="icon"
        :src="icone"
        alt="Ícone do conteúdo"
      >


      <div class="content">

        <div class="top">



          <span class="year">
            {{ questao.ano }}
          </span>


          <span class="question-number">
            Questão {{ questao.numeroQuestao }}
          </span>
            <span class="codigo">
            Código: {{ questao.id }}
           </span>
        </div>

        <h3>
          {{ questao.resumo }}
        </h3>
        <div class="tags">





        </div>


      </div>



      <div class="actions">


        <router-link
          :to="`/resolver/${questao.id}`"
          class="btn"
        >

          Resolver

        </router-link>

      </div>


    </div>


  </div>


</template>

<style scoped>

.card {
  width: 100%;
  background: white;
  border: 1px solid #e7ece9;
  border-radius: 10px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  transition: 0.2s;
  box-sizing: border-box;
  min-height: 125px;
}


.card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 6px 20px rgba(0,0,0,0.05);
}


.left {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  min-width: 0;
}

 .codigo{
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;

  padding: 4px 30px;
  border-radius: 999px;
  margin-left: auto;
}

.question-number{
  color: #494d56;
  padding:4px 10px;
}



.icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
}





.content {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
}






.top {
  display: flex;
  align-items: center;
  gap: 10px;

  margin:10px 8px;
  border-bottom: 1px solid #e7ece9;
  font-size: 14px;
  color: #6b7280;

  flex-wrap: wrap;
}




.year {


  color: #1f6f5c;

  padding: 5px 0px;

  border-radius: 999px;

  font-weight: 700;

  font-size: 14px;
}




h3{
  font-size:16px;
  line-height:1.45;
  color:#404245;
  font-weight:500;
  margin:0 0 12px;

  display:-webkit-box;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.card.lista h3{
  -webkit-line-clamp:3;
}

.card.grade h3{
  -webkit-line-clamp:2;
}





.tags {

  display: flex;

  gap: 8px;

  flex-wrap: wrap;

}





.tag {

  padding: 5px 12px;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 600;

  white-space: nowrap;

}





.green {

  background: #e7f5ee;

  color: #1f8a5b;

}





.blue {

  background: #e8f1ff;

  color: #2767c7;

}



.actions {

  display: flex;

  flex-direction: column;

  align-items: flex-end;

  gap: 16px;

  flex-shrink: 0;

}





.btn {

  color: #1f6f5c;

  height: 35px;

  padding: 0 20px;

  border: 1.5px solid #1f6f5c;

  border-radius: 8px;

  background: #ffffff;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;

  display: flex;

  align-items: center;

  justify-content: center;

  text-decoration: none;

}





.btn:hover {

  background: #1f6f5c;

  color: #ffffff;

}






.arrow {

  font-size: 13px;

}





@media(max-width:768px){


.card {

  flex-direction: column;

  align-items: stretch;

}



.actions {

  align-items:flex-start;

}


}


</style>