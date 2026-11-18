<template>
<div>
  <Header />
  <main class="biblioteca-page">

    <BarraPesquisa />

    <div class="barra-filtros-mobile">

      <div class="barra-filtros-mobile__linha">

        <button
          ref="botaoAbrir"
          type="button"
          class="botao-filtros"
          aria-haspopup="dialog"
          :aria-expanded="filtrosAbertos"
          @click="abrir"
        >
          <SlidersHorizontal :size="20" aria-hidden="true" />
          Filtros
          <span
            v-if="filtrosStore.totalFiltrosAtivos > 0"
            class="botao-filtros__contador"
            :aria-label="`${filtrosStore.totalFiltrosAtivos} filtros ativos`"
          >
            {{ filtrosStore.totalFiltrosAtivos }}
          </span>
        </button>

        <button
          v-if="filtrosStore.totalFiltrosAtivos > 0 || filtrosStore.termoPesquisa"
          type="button"
          class="botao-limpar-tudo"
          @click="filtrosStore.limparFiltros()"
        >
          Limpar tudo
        </button>

      </div>

      <ul
        v-if="chips.length"
        class="chips-filtros"
        aria-label="Filtros selecionados"
      >
        <li
          v-for="chip in chips"
          :key="`${chip.chave}-${chip.id}`"
        >
          <button
            type="button"
            class="chip-filtro"
            :title="chip.nome"
            :aria-label="`Remover filtro ${chip.nome}`"
            @click="remover(chip)"
          >
            <span class="chip-filtro__texto">{{ chip.nome }}</span>
            <X :size="16" aria-hidden="true" />
          </button>
        </li>
      </ul>

    </div>

    <div
      class="folha-filtros"
      :class="{ 'folha-filtros--aberta': filtrosAbertos }"
    >

      <div
        class="folha-filtros__fundo"
        aria-hidden="true"
        @click="fechar"
      ></div>

      <div
        ref="painel"
        class="folha-filtros__painel"
        :role="modoMobile ? 'dialog' : null"
        :aria-modal="modoMobile && filtrosAbertos ? 'true' : null"
        :aria-labelledby="modoMobile ? 'titulo-folha-filtros' : null"
        @keydown="aoTeclarNaFolha"
      >

        <header class="folha-filtros__topo">

          <h2 id="titulo-folha-filtros">
            Filtros
            <span
              v-if="filtrosStore.totalFiltrosAtivos > 0"
              class="folha-filtros__total"
            >
              {{ filtrosStore.totalFiltrosAtivos }} ativos
            </span>
          </h2>

          <button
            ref="botaoFechar"
            type="button"
            class="folha-filtros__fechar"
            aria-label="Fechar filtros"
            @click="fechar"
          >
            <X :size="22" aria-hidden="true" />
          </button>

        </header>

        <div class="folha-filtros__corpo">
          <PainelFiltros />
        </div>

        <footer class="folha-filtros__rodape">

          <button
            type="button"
            class="folha-filtros__limpar"
            :disabled="filtrosStore.totalFiltrosAtivos === 0"
            @click="filtrosStore.limparFiltros()"
          >
            Limpar
          </button>

          <FiltrosAcoes @buscou="fechar" />

        </footer>

      </div>

    </div>

    <Ordenacao />

    <ListaQuestoes />

  </main>
</div>
</template>

<script setup>

import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { SlidersHorizontal, X } from 'lucide-vue-next'
import Header from '@/components/layout/Header.vue'
import BarraPesquisa from '@/features/Questoes/Pagina incial/BarraPesquisa.vue'
import PainelFiltros from '@/features/Questoes/Pagina incial/PainelFiltros.vue'
import Ordenacao from '@/features/Questoes/Pagina incial/Ordenacao.vue'
import ListaQuestoes from '@/features/Questoes/Pagina incial/ListaQuestoes.vue'
import FiltrosAcoes from '@/features/Questoes/Pagina incial/FiltrosAcoes.vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

const filtrosStore = useQuestoesFiltrosStore()

const filtrosAbertos = ref(false)
const modoMobile = ref(false)
const botaoAbrir = ref(null)
const botaoFechar = ref(null)
const painel = ref(null)

let consulta = null

function atualizarModo(evento) {
  modoMobile.value = evento.matches

  if (!evento.matches) filtrosAbertos.value = false
}

onMounted(() => {
  consulta = window.matchMedia('(max-width: 768px)')
  modoMobile.value = consulta.matches
  consulta.addEventListener('change', atualizarModo)
})

onUnmounted(() => {
  consulta?.removeEventListener('change', atualizarModo)
  document.body.style.overflow = ''
})

watch(filtrosAbertos, async aberto => {
  document.body.style.overflow = aberto ? 'hidden' : ''

  if (aberto) {
    await nextTick()
    botaoFechar.value?.focus()
  }
})

function abrir() {
  filtrosAbertos.value = true
}

function fechar() {
  if (!filtrosAbertos.value) return

  filtrosAbertos.value = false
  nextTick(() => botaoAbrir.value?.focus())
}

function aoTeclarNaFolha(evento) {
  if (!filtrosAbertos.value || !modoMobile.value) return

  if (evento.key === 'Escape') {
    evento.stopPropagation()
    fechar()
    return
  }

  if (evento.key !== 'Tab') return

  const focaveis = [...painel.value.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )].filter(elemento => elemento.offsetParent !== null)

  if (!focaveis.length) return

  const primeiro = focaveis[0]
  const ultimo = focaveis[focaveis.length - 1]

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault()
    ultimo.focus()
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault()
    primeiro.focus()
  }
}

const grupos = [
  { chave: 'eixosSelecionados', opcoes: () => filtrosStore.eixosOpcoes, todos: 'Todos os eixos' },
  { chave: 'conteudosSelecionados', opcoes: () => filtrosStore.conteudosOpcoes, todos: 'Todos os conteúdos' },
  { chave: 'subconteudosSelecionados', opcoes: () => filtrosStore.subconteudosDisponiveis, todos: 'Todos os subconteúdos' },
  { chave: 'anosSelecionados', opcoes: () => filtrosStore.anosOpcoes, todos: 'Todos os anos' },
  { chave: 'niveisSelecionados', opcoes: () => filtrosStore.niveisOpcoes, todos: 'Todas as categorias' },
  { chave: 'estadoSelecionado', opcoes: () => filtrosStore.estadoOpcoes, todos: 'Todos os estados' }
]

const chips = computed(() => {
  const lista = []

  grupos.forEach(grupo => {
    const selecionados = filtrosStore[grupo.chave]
    const opcoes = grupo.opcoes()

    if (selecionados.length === 0) return

    if (selecionados.length > 1 && selecionados.length === opcoes.length) {
      lista.push({ chave: grupo.chave, id: 'todos', nome: grupo.todos, grupo: true })
      return
    }

    selecionados.forEach(id => {
      const opcao = opcoes.find(item => item.id === id)

      if (opcao) lista.push({ chave: grupo.chave, id, nome: opcao.nome })
    })
  })

  return lista
})

function remover(chip) {
  filtrosStore[chip.chave] = chip.grupo
    ? []
    : filtrosStore[chip.chave].filter(id => id !== chip.id)
}

</script>

<style scoped>

.biblioteca-page {
  min-height: 100vh;
  padding: 28px;

  display: flex;

  flex-direction: column;

  gap: 15px;

}

.barra-filtros-mobile,
.folha-filtros__fundo,
.folha-filtros__topo,
.folha-filtros__limpar {
  display: none;
}

.folha-filtros,
.folha-filtros__painel,
.folha-filtros__corpo,
.folha-filtros__rodape {
  display: contents;
}

@media (max-width: 768px) {

  .biblioteca-page {

    padding: 16px 20px 32px;

    gap: 16px;

  }

  .barra-filtros-mobile {

    display: flex;

    flex-direction: column;

    gap: 12px;

  }

  .barra-filtros-mobile__linha {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 12px;

  }

  .botao-filtros {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    min-height: 48px;

    padding: 0 20px;

    border: 1px solid var(--cor-primaria);

    border-radius: 12px;

    background: var(--cor-fundo-card);

    color: var(--cor-primaria);

    font-family: inherit;

    font-size: 15px;

    font-weight: 700;

    cursor: pointer;

  }

  .botao-filtros[aria-expanded="true"] {

    background: var(--cor-primaria-fundo);

  }

  .botao-filtros__contador {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    min-width: 24px;

    height: 24px;

    padding: 0 7px;

    border-radius: 12px;

    background: var(--cor-primaria);

    color: var(--cor-fundo-pagina);

    font-size: 13px;

    font-weight: 700;

    line-height: 1;

  }

  .botao-limpar-tudo {

    min-height: 44px;

    padding: 0 8px;

    border: 0;

    background: none;

    color: var(--cor-texto-secundario);

    font-family: inherit;

    font-size: 14px;

    font-weight: 600;

    text-decoration: underline;

    text-underline-offset: 3px;

    cursor: pointer;

  }

  .chips-filtros {

    display: flex;

    gap: 8px;

    margin: 0;

    padding: 0 0 4px;

    list-style: none;

    overflow-x: auto;

    overscroll-behavior-x: contain;

    scrollbar-width: thin;

  }

  .chips-filtros li {

    flex: 0 0 auto;

    max-width: 78%;

  }

  .chip-filtro {

    display: inline-flex;

    align-items: center;

    gap: 6px;

    max-width: 100%;

    min-height: 40px;

    padding: 0 12px;

    border: 1px solid var(--cor-borda);

    border-radius: 20px;

    background: var(--cor-primaria-fundo);

    color: var(--cor-texto-principal);

    font-family: inherit;

    font-size: 13px;

    font-weight: 600;

    cursor: pointer;

  }

  .chip-filtro__texto {

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

  }

  .folha-filtros {

    display: none;

    position: fixed;

    inset: 0;

    z-index: 1000;

  }

  .folha-filtros--aberta {

    display: block;

  }

  .folha-filtros__fundo {

    display: block;

    position: absolute;

    inset: 0;

    background: var(--cor-overlay);

  }

  .folha-filtros__painel {

    display: flex;

    flex-direction: column;

    position: absolute;

    left: 0;

    right: 0;

    bottom: 0;

    max-height: 88vh;

    max-height: 88dvh;

    border-radius: 20px 20px 0 0;

    background: var(--cor-fundo-card);

    box-shadow: var(--sombra-modal);

    animation: folha-subir .26s ease-out;

  }

  .folha-filtros__topo {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 12px;

    flex: 0 0 auto;

    padding: 8px 8px 8px 20px;

    border-bottom: 1px solid var(--cor-borda-suave);

  }

  .folha-filtros__topo h2 {

    display: flex;

    align-items: baseline;

    gap: 10px;

    margin: 0;

    color: var(--cor-texto-principal);

    font-size: 18px;

    font-weight: 700;

  }

  .folha-filtros__total {

    color: var(--cor-texto-suave);

    font-size: 13px;

    font-weight: 500;

  }

  .folha-filtros__fechar {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    width: 48px;

    height: 48px;

    border: 0;

    border-radius: 12px;

    background: none;

    color: var(--cor-texto-secundario);

    cursor: pointer;

  }

  .folha-filtros__corpo {

    display: block;

    flex: 1 1 auto;

    min-height: 0;

    padding: 12px 16px;

    overflow-y: auto;

    overscroll-behavior: contain;

  }

  .folha-filtros__corpo :deep(.painel-filtros) {

    margin: 0;

    padding: 0;

    gap: 12px;

    border: 0;

    border-radius: 0;

    background: transparent;

  }

  .folha-filtros__corpo :deep(.coluna) {

    gap: 12px;

  }

  .folha-filtros__rodape {

    display: grid;

    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);

    gap: 12px;

    flex: 0 0 auto;

    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));

    border-top: 1px solid var(--cor-borda-suave);

    background: var(--cor-fundo-card);

  }

  .folha-filtros__limpar {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    min-height: 48px;

    border: 1px solid var(--cor-borda);

    border-radius: 12px;

    background: var(--cor-fundo-card);

    color: var(--cor-texto-secundario);

    font-family: inherit;

    font-size: 15px;

    font-weight: 600;

    cursor: pointer;

  }

  .folha-filtros__limpar:disabled {

    opacity: .5;

    cursor: default;

  }

  .folha-filtros__rodape :deep(.acoes-filtros) {

    margin: 0;

  }

  .folha-filtros__rodape :deep(.btn-aplicar) {

    height: 48px;

    margin-left: 0;

    font-size: 15px;

  }

  .botao-filtros:focus-visible,
  .botao-limpar-tudo:focus-visible,
  .chip-filtro:focus-visible,
  .folha-filtros__fechar:focus-visible,
  .folha-filtros__limpar:focus-visible {

    outline: 2px solid var(--cor-primaria);

    outline-offset: 2px;

  }

}

@media (max-width: 429px) {

  .biblioteca-page {

    padding-inline: 16px;

  }

}

@keyframes folha-subir {

  from {

    transform: translateY(24px);

    opacity: 0;

  }

  to {

    transform: none;

    opacity: 1;

  }

}

@media (prefers-reduced-motion: reduce) {

  .folha-filtros__painel {

    animation: none;

  }

}

</style>
