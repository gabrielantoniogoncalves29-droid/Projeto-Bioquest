<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { buscarQuestaoResolver } from '@/services/resolver'
import { buscarDetalhesPorId } from '@/services/detalhes'
import { buscarIdsQuestoes } from '@/services/questoes'

import { useResolverStore } from '@/store/resolver/resolver'
import { useDetalhesStore } from '@/store/resolver/detalhes'
import { useUiStore } from '@/store/resolver/ui'

import HeaderQuestao from '@/features/Questoes/Painel Resolução/HeaderQuestão.vue'
import Enunciado from '@/features/Questoes/Painel Resolução/Enunciado.vue'
import AlternativaItem from '@/features/Questoes/Painel Resolução/AlternativaItem.vue'
import QuestaoFooter from '@/features/Questoes/Painel Resolução/QuestaoFooter.vue'
import PainelResolucao from '@/features/Questoes/Painel Resolução/PainelResolucao.vue'
import Header from '@/components/layout/Header.vue'

const route = useRoute()

const resolver = useResolverStore()
const detalhesStore = useDetalhesStore()
const painel = useUiStore()

const { questao } = storeToRefs(resolver)

function goback() {
    window.history.back()
}

const classeLayout = computed(() =>
    painel.aberto
        ? ''
        : 'barra-fechada'
)

watch(
    () => route.params.id,

    async (novoId) => {

        if (!novoId) return

        const id = Number(novoId)

        // Carrega a questão
        const dadosQuestao = await buscarQuestaoResolver(id)
        resolver.carregarQuestao(dadosQuestao)

        // Carrega os detalhes
        const detalhes = await buscarDetalhesPorId(id)
        detalhesStore.carregarDetalhes(detalhes)

        // Carrega os ids apenas uma vez
        if (resolver.idsQuestoes.length === 0) {

            const ids = await buscarIdsQuestoes()
            resolver.carregarIds(ids)

        }

        // Limpa a alternativa selecionada ao trocar de questão
        painel.limparAlternativa()

    },

    {
        immediate: true
    }

)
</script>


<template>

<Header/>

<main class="resolver-page">

<div class="breadcrumb">

<span @click="goback()" class="voltar"> ⟵ Voltar</span>
<span class="separator">|</span>
<span>Biblioteca de Questões</span>
<span>/</span>
<span>Pesquisa</span>
<span>/</span>
<span>Questão {{ questao?.id }}</span>
<span>/</span>
<span>Resolver</span>
</div>

<div 
    v-if="!questao"
    class="loading"
  >
    Carregando questão...
</div>

<div 
  v-else
  class="resolver-layout"
  :class="classeLayout"
>

<section class="questao-container">

<HeaderQuestao/>

<Enunciado/>

<AlternativaItem/>

<QuestaoFooter/>


</section>

<aside class="painel-container">
<PainelResolucao/>
</aside>

</div>

</main>
</template>



<style scoped>

.resolver-page {
  padding: 24px;
  background: #fcfefd67;
  min-height: 100vh;
}
.painel-container {

background:white;

border:1px solid #e6e6e6;

border-radius:16px;

overflow:visible;

transition:width .35s ease;

}

.breadcrumb {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 24px;

  color: #5f6368;
  font-size: 14px;
}

.breadcrumb span:hover {
  text-decoration: underline;
}

.voltar {
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
}

.separator {
  color: #d0d0d0;
}

.resolver-layout {

  display:grid;

  grid-template-columns:
  minmax(0, 2.4fr)
  380px;

  gap:18px;

  transition:grid-template-columns .35s ease;

}

.loading{

  text-align:center;

  padding:40px;

  color:#6b7280;

}

.resolver-layout.barra-fechada {

  grid-template-columns:
  minmax(0, 1fr) 0px;


}

.questao-container {
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  overflow: hidden;
}

</style>