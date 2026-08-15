<script setup>

import { computed } from 'vue'
import { conteudos } from '@/features/Questoes/data/filtros.js'

const props = defineProps({
  questao: {
    type: Object,
    required: true
  }
})

const conteudo = computed(() => {
  return conteudos.find(c => c.id === props.questao.conteudoId)
})

const icone = computed(() => {

  return new URL(
    `../Questoes/icons/${props.questao.conteudoId}.png`,
    import.meta.url
  ).href

})

</script>

<template>

  <div class="card">

    <div class="left">

      <div class="icon-wrap">

        <img
          class="icon"
          :src="icone"
          alt="Ícone do conteúdo"
        >

      </div>

      <div class="content">

        <div class="top">

          <span class="year">
            {{ questao.ano }}
          </span>

          <span class="dot">•</span>

          <span class="meta">
            {{ conteudo?.nome }}
          </span>

          <span class="dot">•</span>

          <span class="meta">
            Questão #{{ questao.id }}
          </span>

        </div>

        <h3>
          {{ questao.resumo }}
        </h3>

      </div>

    </div>

    <router-link
      :to="`/resolver/${questao.id}`"
      class="btn"
    >
      Resolver
    </router-link>

  </div>

</template>

<style scoped>

.card{
  width:100%;

  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;

  padding:14px 16px;

  background:#fff;
  border:1px solid #e9ebea;
  border-radius:12px;

  box-sizing:border-box;
  transition:border-color .15s ease;
}

.card:hover{
  border-color:#c9d6cf;
}

.left{
  display:flex;
  align-items:center;
  gap:14px;
  flex:1;
  min-width:0;
}

.icon-wrap{
  width:44px;
  height:44px;

  border-radius:10px;

  background:#f4f6f5;

  display:flex;
  align-items:center;
  justify-content:center;

  flex-shrink:0;
}

.icon{
  width:26px;
  height:26px;
  object-fit:contain;
}

.content{
  flex:1;
  min-width:0;

  display:flex;
  flex-direction:column;
  gap:4px;
}

.top{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:6px;
}

.year{
  color:#0d6b4d;
  font-size:12.5px;
  font-weight:700;
}

.dot{
  color:#c7d0cb;
  font-size:11px;
}

.meta{
  font-size:12.5px;
  color:#6b7280;
  font-weight:500;
}

h3{
  margin:0;

  font-weight:400;
  font-size:14px;
  line-height:1.4;
  color:#374151;

  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
  overflow:hidden;
}

.btn{
  display:flex;
  align-items:center;
  justify-content:center;
  height:34px;
  padding:0 16px;

  color:#0d6b4d;
  background:#fff;

  border:1px solid #d6ded9;
  border-radius:8px;

  font-size:13.5px;
  font-weight:600;
  text-decoration:none;
  white-space:nowrap;

  flex-shrink:0;

  transition:all .15s ease;
}

.btn:hover{
  border-color:#0d6b4d;
  background:#f7faf8;
}

@media (max-width:460px){

  .card{
    flex-wrap:wrap;
  }

  .left{
    width:100%;
  }

  .btn{
    width:100%;
    height:38px;
  }

}

</style>
