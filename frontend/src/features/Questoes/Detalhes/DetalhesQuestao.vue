<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    BookOpen,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    CornerUpLeft
} from 'lucide-vue-next'

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

function irParaQuestao() {
    router.push(`/resolver/${route.params.id}`)
}

function irParaDetalhes(id) {
    if (!id) return
    router.push(`/resolver/${id}/detalhes`)
}

function goback() {
    window.history.back()
}

watch(
    () => route.params.id,
    async (novoId) => {
        if (!novoId) return

        carregando.value = true

        const id = Number(novoId)

        const [dadosDetalhes, dadosQuestao] = await Promise.all([
            buscarDetalhesPorId(id),
            buscarQuestaoResolver(id)
        ])

        detalhes.value = dadosDetalhes
        questao.value = dadosQuestao

        if (idsQuestoes.value.length === 0) {
            idsQuestoes.value = await buscarIdsQuestoes()
        }

        carregando.value = false
    },
    { immediate: true }
)
</script>

<template>
    <Header />

    <main class="detalhes-page">
        <div class="breadcrumb">
            <span
                class="voltar"
                @click="goback()"
            >
                ← Voltar
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
            >
                /
            </span>

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
            >
                /
            </span>

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
                <div class="cabecalho-topo">
                  

  <div class="cabecalho-texto">
                        <h1>Saiba mais sobre a questão</h1>
                    </div>


                    <div class="navegacao-questoes">
                        <button
                            class="link-nav"
                            type="button"
                            :disabled="!idAnterior"
                            @click="irParaDetalhes(idAnterior)"
                        >
                            <ChevronLeft :size="16" />
                            <span class="link-nav-texto">Questão anterior</span>
                        </button>

                        <span class="posicao">
                            {{ posicaoNavegacao.atual }} de {{ posicaoNavegacao.total }}
                        </span>

                        <button
                            class="link-nav"
                            type="button"
                            :disabled="!idProximo"
                            @click="irParaDetalhes(idProximo)"
                        >
                            <span class="link-nav-texto">Próxima questão</span>
                            <ChevronRight :size="16" />
                        </button>
                    </div>
                </div>

                <div class="cabecalho-corpo">
                  
  <span class="rotulo-topo">
                        Questão {{ detalhes?.numeroQuestao }} · {{ detalhes?.banca }} {{ detalhes?.ano }}
                    </span>
                    <button
                        class="btn-voltar-questao"
                        @click="irParaQuestao"
                    >
                        <CornerUpLeft :size="16" />
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
                    Comentários e discussões
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
    width: 100%;
    min-height: 100vh;
    padding: 24px 32px 48px;
    box-sizing: border-box;
    background: var(--cor-fundo-pagina);
}

.breadcrumb {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto 28px;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;

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

.link-crumb.atual:hover {
    text-decoration: none;
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

.loading {
    text-align: center;
    padding: 60px 20px;
    color: var(--cor-texto-suave);
}

.conteudo-container {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    gap: 24px;
}

.cabecalho-questao {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding-bottom: 4px;
}

.cabecalho-topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;

    padding-bottom: 16px;
    border-bottom: 1px solid var(--cor-borda);
}

.rotulo-topo {
    font-size: 15px;
    font-weight: 600;
    color: var(--cor-primaria);
    margin-left: 10px;
}

.navegacao-questoes {
    display: flex;
    align-items: center;
    gap: 18px;
}

.link-nav {
    display: flex;
    align-items: center;
    gap: 5px;

    border: none;
    background: none;
    padding: 0;

    color: var(--cor-primaria);
    font-size: 13.5px;
    font-weight: 600;

    cursor: pointer;
    white-space: nowrap;
}

.link-nav:hover:not(:disabled) {
    text-decoration: underline;
}

.link-nav:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.posicao {
    padding: 0 2px;
    font-size: 13px;
    color: var(--cor-texto-suave);
    white-space: nowrap;
}

.cabecalho-corpo {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
}

.cabecalho-texto {
    min-width: 0;
    font-size: 15px;
}

.cabecalho-questao h1 {
    margin: 0 0 7px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    color: var(--cor-texto-principal);
}

.subtitulo {
    margin: 0;
    font-size: 14px;
    color: var(--cor-texto-suave);
}

.subtitulo .seta {
    margin: 0 4px;
    color: var(--cor-primaria);
    font-weight: 600;
}

.btn-voltar-questao {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;

    border: none;
    background: none;
    padding: 4px 0;

    color: var(--cor-primaria);
    font-size: 14px;
    font-weight: 600;

    cursor: pointer;
}

.btn-voltar-questao:hover {
    text-decoration: underline;
}

.tabs {
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--cor-borda);
}

.tab {
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    padding: 14px 8px;
    margin-bottom: -1px;

    border: none;
    border-bottom: 2px solid transparent;
    background: none;

    color: var(--cor-texto-suave);
    font-size: 14.5px;
    font-weight: 600;

    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
}

.tab:hover {
    color: var(--cor-primaria);
}

.tab.ativa {
    color: var(--cor-primaria);
    border-bottom-color: var(--cor-primaria);
}

@media (max-width: 900px) {
    .detalhes-page {
        padding: 20px 24px 40px;
    }

    .cabecalho-topo {
        align-items: flex-start;
    }

    .navegacao-questoes {
        margin-left: auto;
    }
}

@media (max-width: 600px) {
    .detalhes-page {
        padding: 14px 12px 32px;
    }

    .breadcrumb {
        margin-bottom: 20px;
        font-size: 13px;
    }

    .conteudo-container {
        gap: 20px;
    }

    .cabecalho-questao {
        gap: 18px;
    }

    .cabecalho-topo {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

    .navegacao-questoes {
        width: 100%;
        justify-content: space-between;
        margin-left: 0;
    }

    .link-nav-texto {
        display: none;
    }

    .cabecalho-corpo {
        align-items: flex-start;
    }

    .cabecalho-questao h1 {
        font-size: 22px;
    }

    .btn-voltar-questao {
        padding: 0;
    }

    .tabs {
        overflow-x: auto;
    }

    .tab {
        min-width: 180px;
        white-space: nowrap;
    }
}
</style>
