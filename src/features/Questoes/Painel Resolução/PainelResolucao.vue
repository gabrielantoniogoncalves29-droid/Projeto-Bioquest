<script setup>

defineProps({

  questao:{

    type:Object,

    required:true

  }

})


</script>



<template>

<div class="painel">



  <div class="card-resposta">


    <span class="label">

      Resposta correta

    </span>


    <div class="resposta">

      {{ questao.resposta }}

    </div>


  </div>





  <div class="card-info">


    <h3>

      Explicação

    </h3>


    <p>

      {{ questao.comentario }}

    </p>


  </div>





  <div class="card-info">


    <h3>

      Conteúdo relacionado

    </h3>


  </div>







  <div class="card-estatistica">


    <div class="header-card">


      <span>

        Percentual de acertos

      </span>


      <strong>

        {{questao.estatisticas.taxaAcerto}}%

      </strong>


    </div>



    <div class="barra">


      <div

        class="preenchimento"

        :style="{
          width:
          questao.estatisticas.taxaAcerto + '%'
        }"

      ></div>


    </div>


  </div>







  <div class="card-distribuicao">


    <span>

      Alternativas mais marcadas

    </span>




    <div

      class="item"

      v-for="item in questao.estatisticas.distribuicao"

      :key="item.alternativa"

    >



      <span>

        {{item.alternativa}}

      </span>




      <div class="barra-mini">


        <div

          class="fill"

          :class="{

            correta:
            item.alternativa === questao.resposta

          }"


          :style="{

            width:item.percentual + '%'

          }"


        ></div>



      </div>



      <span>

        {{item.percentual}}%

      </span>



    </div>




  </div>






</div>

</template>


<style scoped>

.painel {

  padding: 16px;
  height: 100%;
  display: flex;

  flex-direction: column;

  gap: 14px;

}

.card-resposta,
.card-info {

  background: white;
  height:70px;
  border: 1px solid #edf0f2;

  border-radius: 12px;

  padding: 14px;

}

.label {

  display: block;

  color: #6b7280;

  font-size: 12px;

  margin-bottom: 10px;

}

.resposta {

  width: 42px;
  height: 42px;


  border-radius: 50%;

  background: #0d6b4d;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 18px;

}

.card-info h3 {

  font-size: 14px;

  margin-bottom: 8px;

  color: #111827;

}

.card-info p {

  font-size: 13px;

  line-height: 1.5;

  color: #6b7280;

}

.tags {

  display: flex;
  font-size: 16px;
  flex-wrap: wrap;

  gap: 6px;

}

.tags span {

  background: #f0f9f4;

  color: #0d6b4d;

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 12px;

  font-weight: 500;

}

.card-estatistica {

  background: white;

  border: 1px solid #edf0f2;

  border-radius: 12px;

  padding: 14px;

}

.header-card {

  display: flex;

  justify-content: space-between;

  margin-bottom: 10px;

}

.barra {

  height: 10px;

  background: #edf0f2;

  border-radius: 999px;

  overflow: hidden;

}

.preenchimento {

  height: 100%;

  background: #0d6b4d;

  transition: width .8s ease;

}

.card-distribuicao {

  background: white;

  border: 1px solid #edf0f2;

  border-radius: 12px;

  padding: 14px;

}

.item {

  display: grid;

  grid-template-columns: 20px 1fr 40px;

  align-items: center;

  gap: 10px;

  margin-bottom: 10px;

}

.barra-mini {

  height: 8px;

  background: #edf0f2;

  border-radius: 999px;

  overflow: hidden;

}

.fill {

  height: 100%;

  background: #94a3b8;

  transition: width .8s ease;

}

.fill.correta {

  background: #0d6b4d;

}
</style>