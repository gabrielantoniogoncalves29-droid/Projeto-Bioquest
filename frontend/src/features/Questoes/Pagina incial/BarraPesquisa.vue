
<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import { useQuestoesStore } from '@/store/questoes_card.js'
import { buscarSugestoes } from '@/utils/autocomplete.js'

const store = useQuestoesFiltrosStore()
const questoesStore = useQuestoesStore()

const mostrarSugestoes = ref(false)
const indiceAtivo = ref(-1)
const sugestoes = ref([])

let temporizador = null
let temporizadorBlur = null
let requisicaoAtual = 0
let controlador = null

watch(
  () => store.termoPesquisa,
  (termo) => {
    clearTimeout(temporizador)
    controlador?.abort()

    const requisicao = ++requisicaoAtual
    const texto = String(termo ?? '').trim()

    sugestoes.value = []
    indiceAtivo.value = -1

    if (!texto) {
      mostrarSugestoes.value = false
      return
    }

    temporizador = setTimeout(async () => {
      const novoControlador = new AbortController()
      controlador = novoControlador

      try {
        const lista = await buscarSugestoes(
          texto,
          8,
          novoControlador.signal
        )

        if (requisicao === requisicaoAtual) {
          sugestoes.value = Array.isArray(lista)
            ? lista
            : []
        }
      } catch (erro) {
        if (
          erro?.name !== 'AbortError' &&
          requisicao === requisicaoAtual
        ) {
          sugestoes.value = []
        }
      }
    }, 200)
  }
)

const telaPequena = ref(false)
let consultaTela = null

function atualizarTela(evento) {
  telaPequena.value = evento.matches
}

onMounted(() => {
  consultaTela = window.matchMedia('(max-width: 540px)')
  telaPequena.value = consultaTela.matches
  consultaTela.addEventListener('change', atualizarTela)
})

const placeholderPesquisa = computed(() =>
  telaPequena.value
    ? 'Assunto, palavra-chave ou código'
    : 'Pesquisar por assunto, conteúdo, palavra-chave, código da questão...'
)

onUnmounted(() => {
  consultaTela?.removeEventListener('change', atualizarTela)
  clearTimeout(temporizador)
  clearTimeout(temporizadorBlur)
  controlador?.abort()
})

function aoDigitar() {
  mostrarSugestoes.value = true
  indiceAtivo.value = -1
}

function aoFocar() {
  clearTimeout(temporizadorBlur)

  if (String(store.termoPesquisa ?? '').trim()) {
    mostrarSugestoes.value = true
  }
}

function aoDesfocar() {
  temporizadorBlur = setTimeout(() => {
    mostrarSugestoes.value = false
    indiceAtivo.value = -1
  }, 120)
}

function selecionarSugestao(sugestao) {
  store.termoPesquisa = sugestao
  mostrarSugestoes.value = false
  indiceAtivo.value = -1
}

function pesquisar() {
  store.buscaRealizada = true
  questoesStore.carregarQuestoes(true)
}

function aoTeclar(evento) {
  if (evento.key === 'Escape') {
    mostrarSugestoes.value = false
    indiceAtivo.value = -1
    return
  }

  if (evento.key === 'Enter') {
    if (evento.isComposing) return

    evento.preventDefault()

    if (mostrarSugestoes.value && indiceAtivo.value >= 0) {
      selecionarSugestao(sugestoes.value[indiceAtivo.value])
    }

    mostrarSugestoes.value = false
    indiceAtivo.value = -1

    pesquisar()

    return
  }

  if (
    !mostrarSugestoes.value ||
    sugestoes.value.length === 0
  ) {
    return
  }

  if (evento.key === 'ArrowDown') {
    evento.preventDefault()

    indiceAtivo.value =
      (indiceAtivo.value + 1) % sugestoes.value.length
  } else if (evento.key === 'ArrowUp') {
    evento.preventDefault()

    indiceAtivo.value =
      (indiceAtivo.value - 1 + sugestoes.value.length) %
      sugestoes.value.length
  }
}
</script>

<template>
  <section
    class="barra-pesquisa"
    aria-labelledby="pergunta-estudo"
  >

    <header class="cabecalho-pesquisa">
      <p id="pergunta-estudo" class="pergunta-estudo">
        O que você deseja estudar hoje?
      </p>
      
   
      <router-link
        to="/ajuda#questoes"
        class="botao-informacao"
        aria-label="Abrir página de ajuda"
        title="Ajuda sobre a pesquisa de questões"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      </router-link>
    </header>
   <br></br>
    <div class="linha-pesquisa">

      <div class="input-container">

        <span
          class="material-icons icone-pesquisa"
          aria-hidden="true"
        >
          search
        </span>

        <input
          v-model="store.termoPesquisa"
          type="text"
          aria-label="Pesquisar questões de Biologia"
          aria-autocomplete="list"
          aria-controls="sugestoes-biblioteca"
          :aria-expanded="mostrarSugestoes && sugestoes.length > 0"
          autocomplete="off"
          :placeholder="placeholderPesquisa"
          enterkeyhint="search"
          @input="aoDigitar"
          @focus="aoFocar"
          @blur="aoDesfocar"
          @keydown="aoTeclar"
        >

        <ul
          v-if="mostrarSugestoes && sugestoes.length"
          id="sugestoes-biblioteca"
          class="sugestoes-lista"
          role="listbox"
        >

          <li
            v-for="(sugestao, indice) in sugestoes"
            :key="sugestao"
            role="option"
            :aria-selected="indice === indiceAtivo"
            :class="{ ativa: indice === indiceAtivo }"
            @mousedown.prevent="selecionarSugestao(sugestao)"
          >
            <span
              class="material-icons"
              aria-hidden="true"
            >
              search
            </span>

            {{ sugestao }}
          </li>

        </ul>

      </div>

      <div class="acoes">

        <button
          type="button"
          class="btn-limpar"
          @click="store.limparFiltros()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055"
            />
            <path d="m22 3-5 5" />
            <path d="m17 3 5 5" />
          </svg>

          Limpar filtros
        </button>

      </div>

    </div>

  </section>
</template>

<style scoped>
.barra-pesquisa {
  width: auto;
  min-width: 0;

  margin: 18px 40px 10px;
  padding: 0;

  background: transparent;

  font-family: 'Inter', Arial, sans-serif;
  box-sizing: border-box;
}

.barra-pesquisa *,
.barra-pesquisa *::before,
.barra-pesquisa *::after {
  box-sizing: border-box;
}

.cabecalho-pesquisa {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 62px;
  margin-bottom: 18px;
}

.pergunta-estudo {
  margin: 0;
  padding: 0 48px;

  font-family: 'Merriweather', serif;
  font-size: 2.1rem;
  font-weight: 700;

  color: #0f4d3c;
  text-align: center;
}

.botao-informacao {
  position: absolute;
  right: 0;
  top: calc(50% - 16px);
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: var(--cor-primaria);
  text-decoration: none;
  transition: opacity .2s ease;
}

.botao-informacao:hover {
  background: transparent;
  opacity: .7;
}

.botao-informacao:focus-visible {
  outline: 2px solid var(--cor-primaria);
  outline-offset: 2px;
  border-radius: 6px;
}

.linha-pesquisa {
  display: grid;

  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;

  gap: clamp(16px, 3vw, 40px);

  width: 100%;
  min-width: 0;
}

.input-container {
  position: relative;

  display: flex;
  align-items: center;

  min-width: 0;
  min-height: 54px;

  gap: 14px;
  padding: 0 16px;

  background: var(--cor-fundo-sutil);

  border: 1px solid var(--cor-borda);
  border-radius: 14px;

  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    background-color .2s ease;
}

.input-container:focus-within {
  border-color: var(--cor-primaria);

  box-shadow: 0 0 0 3px var(--cor-foco);
}

.icone-pesquisa {
  flex-shrink: 0;

  color: var(--cor-texto-secundario);
  font-size: 21px;
}

.input-container input {
  flex: 1;
  min-width: 0;

  width: 100%;
  height: 52px;

  padding: 0;

  border: none;
  outline: none;

  background: transparent;

  color: var(--cor-texto-principal);

  font-family: 'Inter', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
}

.input-container input::placeholder {
  color: var(--cor-texto-suave);
  opacity: 1;
}

.sugestoes-lista {
  position: absolute;

  top: calc(100% + 6px);
  left: 0;
  right: 0;

  z-index: 30;

  margin: 0;
  padding: 6px;

  list-style: none;

  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-borda);
  border-radius: 12px;

  box-shadow: var(--sombra-popover);

  max-height: 260px;
  overflow-y: auto;
}

.sugestoes-lista li {
  display: flex;
  align-items: center;

  gap: 10px;
  padding: 11px 12px;

  border-radius: 8px;

  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;

  color: var(--cor-texto-secundario);

  cursor: pointer;

  transition:
    background-color .15s ease,
    color .15s ease;
}

.sugestoes-lista li .material-icons {
  font-size: 17px;
  color: var(--cor-texto-fraco);
}

.sugestoes-lista li:hover,
.sugestoes-lista li.ativa {
  background: var(--cor-primaria-fundo);
  color: var(--cor-primaria);
}

.sugestoes-lista li:hover .material-icons,
.sugestoes-lista li.ativa .material-icons {
  color: var(--cor-primaria);
}

.acoes {
  display: flex;
  align-items: center;

  gap: 8px;
}

.btn-limpar {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  height: 54px;
  padding: 0 20px;

  border: 1px solid var(--cor-borda);
  border-radius: 12px;

  background: var(--cor-fundo-card);
  color: var(--cor-texto-secundario);

  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;

  white-space: nowrap;
  cursor: pointer;

  transition:
    background-color .2s ease,
    color .2s ease,
    border-color .2s ease;
}

.btn-limpar:hover {
  border-color: var(--cor-primaria);
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
}

.btn-limpar:focus-visible {
  outline: 2px solid var(--cor-primaria);
  outline-offset: 3px;
}

[data-tema="escuro"] .pergunta-estudo {
  color: var(--cor-texto-principal);
}

[data-tema="escuro"] .sugestoes-lista li:hover,
[data-tema="escuro"] .sugestoes-lista li.ativa {
  color: var(--cor-texto-principal);
}

[data-tema="escuro"] .sugestoes-lista li:hover .material-icons,
[data-tema="escuro"] .sugestoes-lista li.ativa .material-icons {
  color: var(--cor-primaria);
}

@media (max-width: 900px) {
  .barra-pesquisa {
    margin: 18px 20px 24px;
  }

  .linha-pesquisa {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .acoes {
    justify-content: flex-end;
  }

}

@media (max-width: 768px) {
  .barra-pesquisa {
    margin: 0;
  }

  .barra-pesquisa br {
    display: none;
  }

  .cabecalho-pesquisa {
    justify-content: space-between;
    gap: 8px;
    min-height: 44px;
    margin-bottom: 12px;
  }

  .pergunta-estudo {
    padding: 0;
    font-size: clamp(20px, 5.6vw, 26px);
    line-height: 1.25;
    letter-spacing: -.02em;
    text-align: left;
    text-wrap: balance;
  }

  .botao-informacao {
    position: static;
    transform: none;
    width: 44px;
    height: 44px;
  }

  .input-container {
    min-height: 52px;
    padding: 0 14px;
    gap: 10px;
    border-radius: 12px;
  }

  .input-container input {
    height: 50px;
    font-size: 16px;
  }

  .sugestoes-lista {
    max-height: min(280px, 45vh);
  }

  .sugestoes-lista li {
    min-height: 44px;
    font-size: 15px;
  }

  .acoes {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .botao-informacao,
  .input-container,
  .sugestoes-lista li,
  .btn-limpar {
    transition: none;
  }

}

</style>