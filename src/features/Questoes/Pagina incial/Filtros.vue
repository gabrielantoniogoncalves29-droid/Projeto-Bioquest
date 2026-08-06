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

const aberto = ref(false)

const props = defineProps({

  titulo:{
    type:String,
    required:true
  },

  opcoes:{
    type:Array,
    default:()=>[]
  }

})

const selecionados = defineModel({

  type:Array,

  default:()=>[]

})

const todosSelecionados = computed(()=>{

  return props.opcoes.length > 0 &&
         selecionados.value.length === props.opcoes.length

})

const resumo = computed(()=>{

  if(todosSelecionados.value){

    return 'Todos'

  }

  const nomes = props.opcoes
    .filter(opcao=>selecionados.value.includes(opcao.id))
    .map(opcao=>opcao.nome)

  if(nomes.length===0){

    return ''

  }

  if(nomes.length===1){

    return nomes[0]

  }

  if(nomes.length===2){

    return `${nomes[0]}, ${nomes[1]}`

  }

  return `${nomes[0]}, ${nomes[1]} +${nomes.length-2}`

})

function alternarOpcao(id){

  const index = selecionados.value.indexOf(id)

  if(index>=0){

    selecionados.value.splice(index,1)

  }

  else{

    selecionados.value.push(id)

  }

}

function selecionarTodos(){

  if(todosSelecionados.value){

    selecionados.value=[]

    return

  }

  selecionados.value=props.opcoes.map(opcao=>opcao.id)

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

</style>