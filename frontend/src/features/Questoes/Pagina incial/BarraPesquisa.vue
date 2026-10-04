<template>

  <section class="barra-pesquisa">

    <div class="input-container">

      <span class="material-icons">
        search
      </span>

      <input
        v-model="store.termoPesquisa"
        type="text"
        placeholder="Pesquisar por assunto, conteudo, palavra-chave, código da questão..."
        @input="aoDigitar"
        @focus="aoFocar"
        @blur="aoDesfocar"
        @keydown="aoTeclar"
      >

      <ul
        v-if="mostrarSugestoes && sugestoes.length"
        class="sugestoes-lista"
      >

        <li
          v-for="(sugestao, indice) in sugestoes"
          :key="sugestao"
          :class="{ ativa: indice === indiceAtivo }"
          @mousedown.prevent="selecionarSugestao(sugestao)"
        >

          <span class="material-icons">search</span>

          {{ sugestao }}

        </li>

      </ul>

    </div>

    <div class="acoes">

      <button
        class="btn-filtro"
        @click="store.toggleFiltros()"
      >

        <span class="material-icons">

          {{
            store.mostrarFiltros
              ? 'expand_less'
              : 'expand_more'
          }}

        </span>

        {{ store.mostrarFiltros
          ? 'Ocultar filtros'
          : 'Mostrar filtros'
        }}

      </button>

      <button
        class="btn-limpar"
        @click="store.limparFiltros()"
      >

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter-x text-sub-text stroke-sub-text group-hover:text-headings group-focus:text-action group-disabled:text-disabled group-hover:stroke-headings group-disabled:stroke-disabled "><path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055"></path><path d="m22 3-5 5"></path><path d="m17 3 5 5"></path></svg>

        Limpar filtros

      </button>

    </div>

  </section>

</template>

<script setup>

import { ref, computed } from 'vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import { buscarSugestoes } from '@/utils/autocomplete.js'

const store = useQuestoesFiltrosStore()

const mostrarSugestoes = ref(false)
const indiceAtivo = ref(-1)

const sugestoes = computed(() =>

    buscarSugestoes(store.termoPesquisa)

)

function aoDigitar() {

    mostrarSugestoes.value = true
    indiceAtivo.value = -1

}

function aoFocar() {

    if (store.termoPesquisa.trim()) {

        mostrarSugestoes.value = true

    }

}

function aoDesfocar() {

    // pequeno atraso para o clique (mousedown) na sugestão ser processado antes de fechar a lista
    setTimeout(() => {

        mostrarSugestoes.value = false
        indiceAtivo.value = -1

    }, 120)

}

function selecionarSugestao(sugestao) {

    store.termoPesquisa = sugestao
    mostrarSugestoes.value = false
    indiceAtivo.value = -1

}

function aoTeclar(evento) {

    if (!mostrarSugestoes.value || sugestoes.value.length === 0) return

    if (evento.key === 'ArrowDown') {

        evento.preventDefault()
        indiceAtivo.value = (indiceAtivo.value + 1) % sugestoes.value.length

    } else if (evento.key === 'ArrowUp') {

        evento.preventDefault()
        indiceAtivo.value = (indiceAtivo.value - 1 + sugestoes.value.length) % sugestoes.value.length

    } else if (evento.key === 'Enter' && indiceAtivo.value >= 0) {

        evento.preventDefault()
        selecionarSugestao(sugestoes.value[indiceAtivo.value])

    } else if (evento.key === 'Escape') {

        mostrarSugestoes.value = false

    }

}

</script>

<style scoped>

.btn-limpar {

  height: 44px;


  padding: 0 15px;

  border: 1px solid color-mix(in srgb, var(--cor-borda) 80%, transparent);

  border-radius: 8px;

  background: var(--cor-fundo-card);

  color: var(--cor-texto-secundario);

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-weight: 500;

  transition: .2s;

}
.btn-filtro:hover,
.btn-limpar:hover {

  border-color: var(--cor-primaria);

  color: var(--cor-primaria);

}
.barra-pesquisa {

  background: var(--cor-fundo-card);
  margin: 0px 40px;
  border-radius: 8px;

  padding: 0px;
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 150px;

}

.input-container {

  position: relative;

  flex: 1;

  display: flex;

  align-items: center;

  gap: 15px;

  background: var(--cor-fundo-sutil);

  border: 1px solid var(--cor-borda);

  border-radius: 15px;

  padding: 0 14px;

}

.sugestoes-lista {

  position: absolute;

  top: calc(100% + 6px);

  left: 0;

  right: 0;

  z-index: 20;

  margin: 0;

  padding: 6px;

  list-style: none;

  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-borda);

  border-radius: 12px;

  box-shadow: 0 12px 28px rgba(0,0,0,.08);

  max-height: 260px;

  overflow-y: auto;

}

.sugestoes-lista li {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 10px 12px;

  border-radius: 8px;

  font-size: 14px;

  color: var(--cor-texto-secundario);

  cursor: pointer;

}

.sugestoes-lista li .material-icons {

  font-size: 16px;

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

[data-tema="escuro"] .sugestoes-lista li:hover,
[data-tema="escuro"] .sugestoes-lista li.ativa {

  color: var(--cor-texto-principal);

}

[data-tema="escuro"] .sugestoes-lista li:hover .material-icons,
[data-tema="escuro"] .sugestoes-lista li.ativa .material-icons {

  color: var(--cor-texto-principal);

}

.input-container input {

  flex: 1;

  height: 48px;

  border: none;

  background: transparent;

  outline: none;
  color: var(--cor-texto-principal);
  font-size: 16px;

}

.acoes {

  display: flex;

  gap: 5px;

}

.btn-buscar,
.btn-filtro,
.btn-limpar {

  height: 48px;

  padding: 0 26px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  transition: .2s;

  font-weight: 600;

}


.btn-buscar:hover {

  opacity: .95;

}

.btn-filtro {
  color: var(--cor-texto-secundario);
  background: var(--cor-fundo-card);
  border: none;

}

.material-icons {

  font-size: 20px;

}

@media (max-width: 900px) {

  .barra-pesquisa {

    flex-direction: column;

    align-items: stretch;

    margin: 0px 20px;

    gap: 14px;

  }

  .acoes {

    width: 100%;

    flex-wrap: wrap;

  }

}

@media (max-width: 480px) {

  .barra-pesquisa {

    margin: 0px 12px;

    border-radius: 12px;

    padding: 10px;

  }

  .input-container {

    border-radius: 12px;

  }

  .input-container input {

    height: 44px;

    font-size: 15px;

  }

  .acoes {

    gap: 8px;

  }

  .btn-filtro,
  .btn-limpar {

    flex: 1 1 auto;

    justify-content: center;

    height: 44px;

    padding: 0 14px;

    font-size: 14px;

  }

}

</style>
