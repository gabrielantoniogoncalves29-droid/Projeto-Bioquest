<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { buscarQuestaoPorId, buscarMinhaResposta } from '@/services/questoes'

import { useResolverStore } from '@/store/resolver/resolver'
import { useDetalhesStore } from '@/store/resolver/detalhes'
import { useUiStore } from '@/store/resolver/ui'
import { usePerfilStore } from '@/store/perfil'

import HeaderQuestao from '@/features/Questoes/Painel Resolucao/HeaderQuestao.vue'
import Enunciado from '@/features/Questoes/Painel Resolucao/Enunciado.vue'
import AlternativaItem from '@/features/Questoes/Painel Resolucao/AlternativaItem.vue'
import QuestaoFooter from '@/features/Questoes/Painel Resolucao/QuestaoFooter.vue'
import PainelResolucao from '@/features/Questoes/Painel Resolucao/PainelResolucao.vue'
import Header from '@/components/layout/Header.vue'

const route = useRoute()
const router = useRouter()

const resolver = useResolverStore()
const detalhesStore = useDetalhesStore()
const painel = useUiStore()
const perfil = usePerfilStore()

const { questao } = storeToRefs(resolver)

function goback() {
    window.history.back()
}

const classeLayout = computed(() =>
    painel.aberto
        ? ''
        : 'barra-fechada'
)

// Pré-carrega em segundo plano a questão (e a imagem) vizinha, para a navegação
// ser instantânea. Usa o cache de services/questoes.js.
function precarregar(id) {
    if (!id) return

    buscarQuestaoPorId(id)
        .then(dados => {
            const imagem = dados?.enunciado?.imagem
            if (imagem) new Image().src = imagem
        })
        .catch(() => {})
}

// Se o usuário já respondeu esta questão antes, restaura o estado respondido.
async function restaurarResposta(id) {
    try {
        const anterior = await buscarMinhaResposta(id)

        if (!anterior || Number(route.params.id) !== id) return

        painel.selecionarAlternativa(anterior.alternativa)
        painel.definirResultado({
            correta: anterior.correta,
            resposta: anterior.resposta,
            comentario: anterior.comentario
        })
    } catch {
        // sem resposta anterior ou sem rede: a tela fica no estado inicial
    }
}

watch(
    () => route.params.id,
    async (novoId) => {
        if (!novoId) return

        const id = Number(novoId)

        painel.limparAlternativa()

        let dadosQuestao = null

        try {
            ;[dadosQuestao] = await Promise.all([
                buscarQuestaoPorId(id),
                resolver.garantirVetor(id).catch(() => {}),
                perfil.carregarPerfil().catch(() => {})
            ])
        } catch {
            dadosQuestao = null
        }

        // O usuário já navegou para outra questão enquanto esta carregava.
        if (Number(route.params.id) !== id) return

        if (!dadosQuestao) {
            router.replace('/questoes')
            return
        }

        resolver.carregarQuestao(dadosQuestao)
        detalhesStore.carregarDetalhes(dadosQuestao)

        if (dadosQuestao.alternativas.length) restaurarResposta(id)

        precarregar(resolver.proximaQuestao)
        precarregar(resolver.questaoAnterior)
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

<span
    class="voltar"
    @click="goback()"
>
    ⟵ Voltar
</span>

<span class="separator">|</span>

<router-link
    to="/questoes"
    class="link-crumb"
>
    Biblioteca de Questões
</router-link>

<span
    v-if="questao"
    class="separator-barra"
>/</span>

<router-link
    v-if="questao"
    :to="`/resolver/${questao.id}`"
    class="link-crumb atual"
>
    Resolver questão {{ questao.id }}
</router-link>

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
  background: var(--cor-fundo-pagina);
  min-height: 100vh;
}

.painel-container {

  background: var(--cor-fundo-card);

  border:1px solid var(--cor-borda);

  border-radius:16px;

  overflow:visible;

  transition:width .35s ease;

  min-width:0;

}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  margin-bottom: 14px;

  color: var(--cor-texto-suave);
  font-size: 14px;
}

.link-crumb {

  color: inherit;
  text-decoration: none;

}

.link-crumb:hover {
  text-decoration: underline;
  color: var(--cor-primaria);
}

.link-crumb.atual {

  color: var(--cor-texto-suave);

}

.voltar {
  color: var(--cor-primaria);
  font-weight: 600;
  cursor: pointer;
}

.voltar:hover {
  text-decoration: underline;
}

.separator,
.separator-barra {
  color: var(--cor-borda);
}

.resolver-layout {

  display:grid;

  grid-template-columns:
  minmax(0, 2.4fr)
  380px;

  align-items:start;

  gap:18px;

  container-type: inline-size;
  container-name: layout-resolver;

  transition:grid-template-columns .35s ease;

}

.loading{

  text-align:center;

  padding:40px;

  color:var(--cor-texto-suave);

}

.resolver-layout.barra-fechada {

  grid-template-columns:
  minmax(0, 1fr) 0px;


}

.questao-container {
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 16px;
  overflow: hidden;

  min-width:0;

  container-type: inline-size;
  container-name: questao;
}

@media (max-width:900px){

  .resolver-page{

    padding:16px;

  }

  .resolver-layout,
  .resolver-layout.barra-fechada{

    grid-template-columns: minmax(0,1fr);

    gap:16px;

  }

  .resolver-layout.barra-fechada .painel-container{

    display:block;

  }

}

@media (max-width:480px){

  .resolver-page{

    padding:8px;

  }

  .resolver-layout,
  .resolver-layout.barra-fechada{

    gap:12px;

  }

  .painel-container,
  .questao-container{

    border-radius:12px;

  }

  .breadcrumb{

    font-size:12.5px;

    gap:5px;

    margin-bottom:16px;

  }

}

</style>
