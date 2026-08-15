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
            {{ titulo }}
          </span>

          <span
            v-if="resumo"
            class="resumo"
          >
            {{ resumo }}
          </span>

        </div>

      </div>

    </button>

    <Transition name="accordion">
      <div
        v-if="aberto"
        class="conteudo"
      >

        <label class="opcao destaque">

          <input
            type="checkbox"
            :checked="todosSelecionados"
            @change="selecionarTodos"
          >

          Todos

        </label>

        <div class="lista-opcoes">

          <div class="grupo">

            <label
              v-for="opcao in opcoes"
              :key="opcao.id"
              class="opcao"
            >

              <input
                type="checkbox"
                :checked="selecionados.includes(opcao.id)"
                @change="alternarOpcao(opcao.id)"
              >

              {{ opcao.nome }}

            </label>

          </div>

        </div>

      </div>
    </Transition>

  </div>

</template>

<script setup>

import { ref, computed } from 'vue'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

const aberto = ref(false)

const props = defineProps({

  titulo: {
    type: String,
    required: true
  },

  filtro: {
    type: String,
    required: true
  }

})

const store = useQuestoesFiltrosStore()

const opcoesPorFiltro = {
  anosSelecionados: 'anosOpcoes',
  niveisSelecionados: 'niveisOpcoes',
  eixosSelecionados: 'eixosOpcoes',
  conteudosSelecionados: 'conteudosOpcoes',
  estadoSelecionado: 'estadoOpcoes'
}

const opcoes = computed(() => store[opcoesPorFiltro[props.filtro]])

const selecionados = computed({

  get: () => store[props.filtro],

  set: (valor) => { store[props.filtro] = valor }

})

const todosSelecionados = computed(() => {

  return opcoes.value.length > 0 &&
         selecionados.value.length === opcoes.value.length

})

const resumo = computed(() => {

  if (todosSelecionados.value) {

    return 'Todos'

  }

  const nomes = opcoes.value
    .filter(opcao => selecionados.value.includes(opcao.id))
    .map(opcao => opcao.nome)

  if (nomes.length === 0) {

    return ''

  }

  if (nomes.length === 1) {

    return nomes[0]

  }

  if (nomes.length === 2) {

    return `${nomes[0]}, ${nomes[1]}`

  }

  return `${nomes[0]}, ${nomes[1]} +${nomes.length - 2}`

})

function alternarOpcao(id) {

  const index = selecionados.value.indexOf(id)

  if (index >= 0) {

    const novos = [...selecionados.value]
    novos.splice(index, 1)
    selecionados.value = novos

  }
  else {

    selecionados.value = [...selecionados.value, id]

  }

}

function selecionarTodos() {

  if (todosSelecionados.value) {

    selecionados.value = []

    return

  }

  selecionados.value = opcoes.value.map(opcao => opcao.id)

}

</script>

<style scoped>

.accordion{
    position:relative;
    border:1px solid #d1d5db;
    border-radius:10px;
    background:#fff;
    overflow:visible;
}

.cabecalho{

  width:100%;

  border:1px solid #d1d5db;

  border-radius:10px;

  background:white;

  padding:16px 18px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  cursor:pointer;

  transition:.2s;

}

.cabecalho:hover{

  background:#f9fafb;

}

.titulo{

  display:flex;

  align-items:center;

  gap:12px;

}

.seta{

  color:#6b7280;

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

.resumo{

  margin-top:3px;

  font-size:13px;

  color:#6b7280;

  overflow:hidden;

  white-space:nowrap;

  text-overflow:ellipsis;

  max-width:100%;

}

.conteudo{
    padding:18px;
}

.grupo{

    border:1px solid #dadde0;
    border-radius:10px;
    background:#fafafa;

    padding:14px;

}

.lista-opcoes{

    margin-top:12px;

    max-height:340px;

    overflow-y:auto;

    border-radius:10px;

}


.destaque{



    padding:10px 4px;

    margin-bottom:12px;

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

.opcao:hover{

  background:#f3f4f6;

}

.opcao+.opcao{

  margin-top:2px;

}

.opcao input{

  width:18px;

  height:18px;

  cursor:pointer;

  accent-color:#0d6b4d;

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

    padding: 14px;

  }

  .nome {

    font-size: 14px;

  }

  .conteudo {

    padding: 14px;

  }

}

@media (max-width: 480px) {

  .lista-opcoes {

    max-height: 260px;

  }

  .opcao {

    font-size: 14px;

    padding: 10px 8px;

  }

}

</style>
