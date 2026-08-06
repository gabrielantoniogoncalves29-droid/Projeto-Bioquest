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

        <span>Subconteúdos</span>

      </div>

    </button>

    <Transition name="accordion">

      <div
        v-if="aberto"
        class="conteudo"
      >

        <div
          v-if="conteudosSelecionados.length === 0"
          class="vazio"
        >

          Selecione um conteúdo primeiro.

        </div>

        <template v-else>

          <label
            v-if="grupos.length"
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
              v-for="conteudo in grupos"
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
                  :checked="selecionados.includes(`${conteudo.id}-${index}`)"
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

const aberto = ref(false)

const props = defineProps({

  conteudos: {
    type: Array,
    default: () => []
  },

  conteudosSelecionados: {
    type: Array,
    default: () => []
  }

})

const grupos = computed(() => {

  return props.conteudos.filter(conteudo =>
    props.conteudosSelecionados.includes(conteudo.id)
  )

})

const selecionados = defineModel({

  type: Array,

  default: () => []

})

function alternar(id){

  const index = selecionados.value.indexOf(id)

  if(index >= 0){

    selecionados.value.splice(index,1)

  }

  else{

    selecionados.value.push(id)

  }

}
function selecionarTodos() {

  if (todosSelecionados.value) {

    selecionados.value = selecionados.value.filter(
      id => !todosSubconteudos.value.includes(id)
    )

    return

  }

  const novos = [...selecionados.value]

  todosSubconteudos.value.forEach(id => {

    if (!novos.includes(id)) {

      novos.push(id)

    }

  })

  selecionados.value = novos

}
const todosSubconteudos = computed(() => {

  const lista = []

  grupos.value.forEach(conteudo => {

    conteudo.subconteudos.forEach((_, index) => {

      lista.push(`${conteudo.id}-${index}`)

    })

  })

  return lista

})

const todosSelecionados = computed(() => {

  return (
    todosSubconteudos.value.length > 0 &&
    todosSubconteudos.value.every(id => selecionados.value.includes(id))
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

  font-weight:600;

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

</style>