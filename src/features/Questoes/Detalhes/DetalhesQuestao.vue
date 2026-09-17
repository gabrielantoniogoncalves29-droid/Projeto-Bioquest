<script setup>

import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BookOpen, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next'

import { buscarDetalhesPorId } from '@/services/detalhes'
import { buscarQuestaoResolver } from '@/services/resolver'
import { buscarIdsQuestoes } from '@/services/questoes'

import Header from '@/components/layout/Header.vue'
import InfoQuestao from './InfoQuestao.vue'
import PreviaQuestao from './PreviaQuestao.vue'
import ExplicacaoQuestao from './ExplicacaoQuestao.vue'
import ForumQuestao from './ForumQuestao.vue'

const route = useRoute()
const router = useRouter()

const carregando = ref(true)
const detalhes = ref(null)
const questao = ref(null)
const idsQuestoes = ref([])

const abaAtiva = ref('explicacao')

const indiceAtual = computed(() =>

    idsQuestoes.value.indexOf(Number(route.params.id))

)

const idAnterior = computed(() =>

    indiceAtual.value > 0
        ? idsQuestoes.value[indiceAtual.value - 1]
        : null

)

const idProximo = computed(() =>

    indiceAtual.value !== -1 &&
    indiceAtual.value < idsQuestoes.value.length - 1
        ? idsQuestoes.value[indiceAtual.value + 1]
        : null

)

const posicaoNavegacao = computed(() => ({

    atual: indiceAtual.value === -1 ? 0 : indiceAtual.value + 1,
    total: idsQuestoes.value.length

}))

function irParaQuestao(){

    router.push(`/resolver/${route.params.id}`)

}

const imagemAreaHeader = computed(() => {

    const icone = detalhes.value?.conteudo?.area?.icone

    if(!icone) return ''

    return new URL(

        `../icons/${icone}.png`,

        import.meta.url

    ).href

})

function irParaDetalhes(id){

    if(!id) return

    router.push(`/resolver/${id}/detalhes`)

}

function goback(){

    window.history.back()

}

watch(

    () => route.params.id,

    async (novoId) => {

        if(!novoId) return

        carregando.value = true

        const id = Number(novoId)

        const [dadosDetalhes, dadosQuestao] = await Promise.all([

            buscarDetalhesPorId(id),
            buscarQuestaoResolver(id)

        ])

        detalhes.value = dadosDetalhes
        questao.value = dadosQuestao

        if(idsQuestoes.value.length === 0){

            idsQuestoes.value = await buscarIdsQuestoes()

        }

        carregando.value = false

    },

    { immediate: true }

)

</script>

<template>

<Header/>

<main class="detalhes-page">

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

<span
    v-if="questao"
    class="link-crumb link-acao"
    @click="irParaQuestao"
>
    Resolver questão {{ questao.id }}
</span>

<span
    v-if="questao"
    class="separator-barra"
>/</span>

<span
    v-if="questao"
    class="link-crumb atual"
>
    Saiba mais
</span>

</div>

<div
    v-if="carregando"
    class="loading"
>
    Carregando...
</div>

<div
    v-else
    class="conteudo-container"
>

    <div class="cabecalho-questao">

        <div class="cabecalho-info">

            <div class="cabecalho-icone">

                <img
                    v-if="imagemAreaHeader"
                    :src="imagemAreaHeader"
                    alt=""
                >

            </div>

            <div>

                <span class="rotulo-topo">Questão {{ detalhes?.numeroQuestao }} · {{ detalhes?.banca }} {{ detalhes?.ano }}</span>

                <h1>Saiba mais sobre a questão</h1>

                <p class="subtitulo">
                    {{ detalhes?.conteudo?.area?.nome }}
                    <span class="seta">›</span>
                    {{ detalhes?.conteudo?.assunto?.nome }}
                </p>

            </div>

        </div>

        <div class="cabecalho-acoes">

            <div class="navegacao-questoes">

                <button
                    class="btn-nav"
                    type="button"
                    :disabled="!idAnterior"
                    title="Questão anterior"
                    @click="irParaDetalhes(idAnterior)"
                >
                    <ChevronLeft :size="18" />
                </button>

                <span class="posicao">
                    {{ posicaoNavegacao.atual }} de {{ posicaoNavegacao.total }}
                </span>

                <button
                    class="btn-nav"
                    type="button"
                    :disabled="!idProximo"
                    title="Próxima questão"
                    @click="irParaDetalhes(idProximo)"
                >
                    <ChevronRight :size="18" />
                </button>

            </div>

            <button
                class="btn-voltar-questao"
                @click="irParaQuestao"
            >
                Voltar para a questão
            </button>

        </div>

    </div>

    <PreviaQuestao :questao="questao" />

    <InfoQuestao :detalhes="detalhes" />

    <div class="tabs">

        <button
            class="tab"
            :class="{ ativa: abaAtiva === 'explicacao' }"
            @click="abaAtiva = 'explicacao'"
        >
            <BookOpen :size="16" />
            Explicação e teoria
        </button>

        <button
            class="tab"
            :class="{ ativa: abaAtiva === 'forum' }"
            @click="abaAtiva = 'forum'"
        >
            <MessageCircle :size="16" />
            Fórum de dúvidas
        </button>

    </div>

    <ExplicacaoQuestao
        v-if="abaAtiva === 'explicacao'"
        :detalhes="detalhes"
        :questao="questao"
    />

    <ForumQuestao
        v-else
        :questao-id="Number(route.params.id)"
    />

</div>

</main>

</template>

<style scoped>

.detalhes-page {
  padding: 24px;
  background: var(--cor-fundo-pagina);
  min-height: 100vh;
  box-sizing: border-box;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  margin-bottom: 24px;

  color: var(--cor-texto-suave);
  font-size: 14px;
}

.link-crumb {

  color: inherit;
  text-decoration: none;
  cursor: pointer;

}

.link-crumb:hover {
  text-decoration: underline;
  color: var(--cor-primaria);
}

.link-crumb.atual {

  color: var(--cor-texto-suave);
  cursor: default;

}

.link-crumb.atual:hover{

  text-decoration:none;

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

.loading{

  text-align:center;

  padding:40px;

  color:var(--cor-texto-suave);

}

.conteudo-container{

  width: 100%;

  display:flex;

  flex-direction:column;

  gap:16px;

}

.cabecalho-questao{

  display:flex;

  align-items:flex-start;

  justify-content:space-between;

  flex-wrap:wrap;

  gap:16px;

  background:linear-gradient(135deg,var(--cor-fundo-card), var(--cor-primaria-fundo));

  border:1px solid var(--cor-borda);

  border-radius:16px;

  padding:24px 28px;

}

.cabecalho-info{

  display:flex;

  align-items:center;

  gap:16px;

  min-width:0;

}

.cabecalho-icone{

  display:flex;

  align-items:center;

  justify-content:center;

  width:56px;

  height:56px;

  min-width:56px;

  border-radius:14px;

  background: var(--cor-fundo-card);

  border:1px solid var(--cor-borda);

}

.cabecalho-icone img{

  width:36px;

  height:36px;

  object-fit:contain;

}

.rotulo-topo{

  display:block;

  font-size:13px;

  font-weight:600;

  color:var(--cor-primaria);

  margin-bottom:6px;

}

.cabecalho-questao h1{

  margin:0 0 6px;

  font-size:24px;

  font-weight:700;

  color:var(--cor-texto-principal);

}

.subtitulo{

  margin:0;

  font-size:14px;

  color:var(--cor-texto-suave);

}

.subtitulo .seta{

  color:var(--cor-primaria);

  font-weight:600;

}

.cabecalho-acoes{

  display:flex;

  flex-direction:column;

  align-items:flex-end;

  gap:10px;

  flex-shrink:0;

}

.navegacao-questoes{

  display:flex;

  align-items:center;

  gap:10px;

}

.btn-nav{

  display:flex;

  align-items:center;

  justify-content:center;

  width:34px;

  height:34px;

  border:1px solid var(--cor-borda);

  border-radius:9px;

  background: var(--cor-fundo-card);

  color:var(--cor-texto-secundario);

  cursor:pointer;

  transition:all .15s ease;

}

.btn-nav:hover:not(:disabled){

  border-color:var(--cor-primaria);

  color:var(--cor-primaria);

  background:var(--cor-primaria-fundo);

}

.btn-nav:disabled{

  opacity:.4;

  cursor:not-allowed;

}

.posicao{

  font-size:13px;

  color:var(--cor-texto-suave);

  white-space:nowrap;

}

.btn-voltar-questao{

  flex-shrink:0;

  height:42px;

  padding:0 18px;

  border:1px solid var(--cor-borda);

  border-radius:10px;

  background: var(--cor-fundo-card);

  color:var(--cor-texto-secundario);

  font-size:14px;

  font-weight:600;

  cursor:pointer;

  transition:all .15s ease;

}

.btn-voltar-questao:hover{

  border-color:var(--cor-primaria);

  color:var(--cor-primaria);

  background:var(--cor-primaria-fundo);

}

.tabs{

  display:flex;

  gap:8px;

}

.tab{

  flex:1;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:8px;

  height:48px;

  border:1px solid var(--cor-borda);

  border-radius:12px;

  background: var(--cor-fundo-card);

  color:var(--cor-texto-suave);

  font-size:14.5px;

  font-weight:600;

  cursor:pointer;

  transition:all .2s ease;

}

.tab:hover{

  border-color:var(--cor-primaria);

  color:var(--cor-primaria);

}

.tab.ativa{

  background:var(--cor-primaria);

  border-color:var(--cor-primaria);

  color: var(--cor-texto-invertido);

}

@media (max-width:600px){

  .detalhes-page{

    padding:12px;

  }

  .cabecalho-questao{

    padding:18px 16px;

  }

  .cabecalho-questao h1{

    font-size:19px;

  }

  .cabecalho-icone{

    width:44px;

    height:44px;

    min-width:44px;

  }

  .cabecalho-icone img{

    width:28px;

    height:28px;

  }

  .cabecalho-acoes{

    width:100%;

    align-items:stretch;

  }

  .navegacao-questoes{

    justify-content:space-between;

  }

  .btn-voltar-questao{

    width:100%;

    text-align:center;

  }

  .tabs{

    flex-direction:column;

  }

}

</style>
