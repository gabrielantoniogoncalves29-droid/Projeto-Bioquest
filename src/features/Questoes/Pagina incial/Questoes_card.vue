<script setup>

import { computed } from 'vue'
import { conteudos } from '@/features/Questoes/data/filtros.js'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

const props = defineProps({
  questao: {
    type: Object,
    required: true
  }
})

const filtrosStore = useQuestoesFiltrosStore()

const modo = computed(() => filtrosStore.modoVisualizacao)

const conteudo = computed(()=>{
  return conteudos.find(c => c.id === props.questao.conteudoId)
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
        :class="modo"
        :src="icone"
        alt="Ícone do conteúdo"
      >

      <div class="content">

<div class="top" :class="modo">

      <span class="year">
        {{ questao.ano }}
    </span>

    <span class="meta">
        {{ conteudo?.nome }}
    </span>

    <span class="meta">
        Questão #{{ questao.id }}
    </span>



</div>

        <h3 :class="modo">
          {{ questao.resumo }}
        </h3>


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
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border: 1px solid #e7ece9;
  border-radius: 12px;

  box-sizing: border-box;
  transition: all .25s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
}

.card.lista{
  min-height:132px;
  padding:16px 22px;
}

.card.lista .left{
  gap:18px;
}

.card.lista .icon{
  width:74px;
  height:74px;
}

.card.lista .top{
  gap:26px;
  margin-bottom:12px;
  padding-bottom:10px;
}

.card.lista .year{
  font-size:15px;
}

.card.lista .meta{
  font-size:14px;
}

.card.lista h3{
  font-size:15.3px;
  line-height:1.6;
  -webkit-line-clamp:3;
}

.card.lista .btn{
  min-width:102px;
  height:35px;
  padding:0 16px;

  font-size:15px;
  font-weight:600;
}

.card.grade{
  min-height:118px;
  padding:14px;
}

.card.grade .left{
  gap:12px;
}

.card.grade .icon{
  width:64px;
  height:64px;
}

.card.grade .top{
  gap:20px;
  margin-bottom:8px;
  padding-bottom:8px;
}

.card.grade h3{
  font-size:14px;
  line-height:1.45;
  -webkit-line-clamp:2;
}

.card.grade .btn{
  height:35px;
  padding:0 16px;
}

.left{
  display:flex;
  align-items:center;
  flex:1;
  min-width:0;
}

.icon{
  object-fit:contain;
  flex-shrink:0;
}

.content{
  flex:1;
  min-width:0;

  display:flex;
  flex-direction:column;
}

.top{
  display:flex;
  align-items:center;
  flex-wrap:wrap;

  border-bottom:1px solid #edf0f2;
}

.year{
  color:#1f6f5c;
  font-size:14px;
  font-weight:700;
}

.meta{
  font-size:13px;
  color:#6b7280;
  font-weight:500;
}

h3{
  margin:0;

  font-family:"Inter",sans-serif;
  font-weight:400;
  color:#404040;

  display:-webkit-box;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.actions{
  display:flex;
  align-items:center;
  margin-left:20px;
  flex-shrink:0;
}

.btn{
  display:flex;
  align-items:center;
  justify-content:center;
  height: 40px;
  padding:0 20px;

  color: #0d6b4d;
  background:#fff;

  border:1px solid  #0d6b4d;
  border-radius:9px;

  font-weight:600;
  text-decoration:none;

  transition:all .2s ease;
}

.btn:hover{
  background: #0d6b4d;
  color:#fff;
}

@media (max-width:768px){

  .card{
    padding:16px;
  }

  .left{
    flex-direction:column;
    align-items:flex-start;
  }

  .actions{
    margin:18px 0 0;
    width:100%;
  }

  .btn{
    width:100%;
    height:42px;
  }

  .card.lista .icon,
  .card.grade .icon{
    width:66px;
    height:66px;
  }

}

@media (max-width:480px){

  .card{
    padding:14px;
    border-radius: 10px;
  }

  .card.lista,
  .card.grade{
    min-height: auto;
  }

  .top{
    gap:12px;
    row-gap: 6px;
  }

  h3{
    font-size:14px !important;
  }

  .year{
    font-size:13px;
  }

  .meta{
    font-size:12px;
  }

  .btn{
    font-size:14px;
  }

}

</style>
