<template>

  <div class="accordion">

    <button
      class="cabecalho"
      @click="aberto = !aberto"
    >

<div class="titulo">

  <span class="material-icons seta">
    {{ aberto ? 'expand_more' : 'chevron_right' }}
  </span>

  <div class="texto">

    <span class="nome">
      Subconteúdos
    </span>

  </div>

</div>

    </button>

    <Transition name="accordion">

      <div
        v-if="aberto"
        class="conteudo"
      >

        <div
          v-if="store.conteudosSelecionados.length === 0"
          class="vazio"
        >

          Selecione um conteúdo primeiro.

        </div>

        <template v-else>

          <label
            v-if="gruposDisponiveis.length"
            class="opcao todos"
          >

            <input
              type="checkbox"
              :checked="todosSelecionados"
              @change="selecionarTodos"
            >

            Todos os subconteúdos

          </label>

          <div class="lista-subconteudos">

            <div
              v-for="conteudo in gruposDisponiveis"
              :key="conteudo.id"
              class="grupo"
            >

              <div class="nome-conteudo">

                {{ conteudo.nome }}

              </div>

              <label
                v-for="(sub, index) in conteudo.subconteudos"
                :key="index"
                class="opcao"
              >

                <input
                  type="checkbox"
                  :checked="store.subconteudosSelecionados.includes(`${conteudo.id}-${index}`)"
                  @change="alternar(`${conteudo.id}-${index}`)"
                >

                {{ sub }}

              </label>

            </div>

          </div>

        </template>

      </div>

    </Transition>

  </div>

</template>

<script setup>

import { ref, computed } from 'vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

const aberto = ref(false)

const store = useQuestoesFiltrosStore()

const gruposDisponiveis = computed(() => {

  return store.conteudosOpcoes.filter(conteudo =>
    store.conteudosSelecionados.includes(conteudo.id)
  )

})

function alternar(id) {

  const index = store.subconteudosSelecionados.indexOf(id)

  if (index >= 0) {

    const novos = [...store.subconteudosSelecionados]
    novos.splice(index, 1)
    store.subconteudosSelecionados = novos

  }
  else {

    store.subconteudosSelecionados = [...store.subconteudosSelecionados, id]

  }

}

function selecionarTodos() {

  if (todosSelecionados.value) {

    store.subconteudosSelecionados = store.subconteudosSelecionados.filter(
      id => !todosSubconteudosDisponiveis.value.includes(id)
    )

    return

  }

  const novos = [...store.subconteudosSelecionados]

  todosSubconteudosDisponiveis.value.forEach(id => {

    if (!novos.includes(id)) {

      novos.push(id)

    }

  })

  store.subconteudosSelecionados = novos

}

const todosSubconteudosDisponiveis = computed(() => {

  const lista = []

  gruposDisponiveis.value.forEach(conteudo => {

    conteudo.subconteudos.forEach((_, index) => {

      lista.push(`${conteudo.id}-${index}`)

    })

  })

  return lista

})

const todosSelecionados = computed(() => {

  return (
    todosSubconteudosDisponiveis.value.length > 0 &&
    todosSubconteudosDisponiveis.value.every(id => store.subconteudosSelecionados.includes(id))
  )

})

</script>

<style scoped>
.lista-subconteudos{

  margin-top:16px;

  max-height:520px;

  overflow-y:auto;

  display:flex;

  flex-direction:column;

  gap:14px;

  padding-right:6px;

}

.accordion{

  border:1px solid #d1d5db;

  border-radius:10px;

  background:white;

  overflow:hidden;

}

.todos{

  display:flex;

  align-items:center;

  gap:12px;

  padding:8px 4px 12px;


}

.cabecalho{

  width:100%;
  border:1px solid #d1d5db;

  border-radius:10px;

  background:white;

  padding:14px 16px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  cursor:pointer;

}

.cabecalho:hover{

  background:#f9fafb;

}

.titulo{

  display:flex;

  align-items:center;

  gap:8px;


}

.titulo{

  display:flex;

  align-items:center;

  gap:12px;

}

.texto{

  display:flex;

  flex-direction:column;

  align-items:flex-start;

  flex:1;

  min-width:0;

}

.nome{

  font-size:15px;

  font-weight:700;

  color:#1f2937;

}

.seta{

  color:#6b7280;

}

.grupo{

    border:1px solid #edf0f2;

    border-radius:10px;

    background:#fafafa;

    padding:14px;

}


.conteudo{

    padding:18px;

    display:flex;
    flex-direction:column;
    gap:14px;

    max-height:550px;
    overflow-y:auto;

}

.grupo:last-child{

  margin-bottom:0;

  border-bottom:none;

}

.nome-conteudo{

  font-weight:700;

  color:#0d6b4d;

  margin-bottom:12px;

  padding-bottom:8px;

  border-bottom:1px solid #e5e7eb;

  font-size:15px;

}
.opcao{

  display:flex;

  align-items:center;

  gap:12px;

  padding:8px 10px;

  border-radius:8px;

  cursor:pointer;

  transition:.2s;

}

.opcao input{

  width:18px;

  height:18px;

  accent-color:#0d6b4d;

  cursor:pointer;

}

.opcao + .opcao{

  margin-top:2px;

}

.opcao:hover{

  background:#f3f4f6;

}

.vazio{

  color:#6b7280;

  text-align:center;

  padding:24px;

  font-size:14px;

}

.accordion-enter-active,
.accordion-leave-active{

  transition:.25s;

}

.accordion-enter-from,
.accordion-leave-to{

  opacity:0;

  transform:translateY(-8px);

}

@media (max-width: 768px) {

  .cabecalho {

    padding: 12px 14px;

  }

  .conteudo {

    padding: 14px;

  }

  .lista-subconteudos {

    max-height: 400px;

  }

}

@media (max-width: 480px) {

  .opcao {

    font-size: 14px;

    padding: 10px 8px;

  }

  .nome-conteudo {

    font-size: 14px;

  }

}

</style>
