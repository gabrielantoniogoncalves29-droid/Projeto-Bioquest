<script setup>

import { computed } from 'vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import { useQuestoesStore } from '@/store/questoes_card.js'
import { useResolverStore } from '@/store/resolver/resolver.js'

const props = defineProps({
  questao: {
    type: Object,
    required: true
  }
})

const filtrosStore = useQuestoesFiltrosStore()

const modo = computed(() => filtrosStore.modoVisualizacao)

const questoesStore = useQuestoesStore()
const resolver = useResolverStore()

function gerarVetor() {
  resolver.definirVetor(questoesStore.questoesOrdenadas.map(item => item.id))
}

const icone = computed(()=>{

  return new URL(
    `../icons/${props.questao.conteudoId ?? 1}.png`,
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
        {{ questao.conteudoNome }}
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
          @click="gerarVetor"
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

  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda-suave);
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

  border-bottom:1px solid var(--cor-borda);
}

.year{
  color:var(--cor-primaria-texto);
  font-size:14px;
  font-weight:700;
}

.meta{
  font-size:13px;
  color:var(--cor-texto-suave);
  font-weight:500;
}

h3{
  margin:0;

  font-family:"Inter",sans-serif;
  font-weight:400;
  color:var(--cor-texto-principal);

  display:-webkit-box;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.actions{
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:8px;
  margin-left:20px;
  flex-shrink:0;
}

.btn{
  display:flex;
  align-items:center;
  justify-content:center;
  height: 40px;
  padding:0 20px;

  color: var(--cor-primaria);
  background: var(--cor-fundo-card);

  border:1px solid  var(--cor-primaria);
  border-radius:9px;

  font-weight:600;
  text-decoration:none;

  transition:all .2s ease;
}

.btn:hover{
  background: var(--cor-primaria);
  color: var(--cor-texto-invertido);
}

[data-tema="escuro"] .btn{
  color: var(--cor-texto-principal);
}



@media (max-width:768px){

  .card,
  .card.lista,
  .card.grade{
    display:block;
    min-height:0;
    padding:16px;
    border-radius:12px;
  }

  .card:hover{
    transform:none;
    box-shadow:none;
  }

  .left,
  .card.lista .left,
  .card.grade .left{
    display:grid;
    grid-template-columns:44px minmax(0, 1fr);
    grid-template-areas:
      "icone meta"
      "resumo resumo"
      "acao acao";
    align-items:center;
    gap:12px;
  }

  .content{
    display:contents;
  }

  .icon,
  .card.lista .icon,
  .card.grade .icon{
    display:block;
    grid-area:icone;
    width:44px;
    height:44px;
  }

  .top,
  .card.lista .top,
  .card.grade .top{
    grid-area:meta;
    gap:2px 10px;
    margin:0;
    padding:0;
    border-bottom:0;
    min-width:0;
  }

  .year,
  .card.lista .year{
    font-size:14px;
  }

  .meta,
  .card.lista .meta{
    font-size:13px;
    line-height:1.35;
  }

  h3,
  .card.lista h3,
  .card.grade h3{
    grid-area:resumo;
    font-size:15px;
    line-height:1.55;
    -webkit-line-clamp:4;
    padding-top:12px;
    border-top:1px solid var(--cor-borda-suave);
  }

  .actions{
    grid-area:acao;
    margin:0;
    width:100%;
  }

  .btn,
  .card.lista .btn,
  .card.grade .btn{
    width:100%;
    height:44px;
    font-size:15px;
  }

}

@media (max-width:360px){

  .card,
  .card.lista,
  .card.grade{
    padding:14px;
  }

  .left,
  .card.lista .left,
  .card.grade .left{
    grid-template-columns:40px minmax(0, 1fr);
    gap:10px;
  }

  .icon,
  .card.lista .icon,
  .card.grade .icon{
    width:40px;
    height:40px;
  }

}

@media (prefers-reduced-motion:reduce){

  .card,
  .btn{
    transition:none;
  }

}

</style>
