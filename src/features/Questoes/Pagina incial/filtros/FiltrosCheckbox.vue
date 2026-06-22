<script setup>

import { ref } from 'vue'


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



function alternarOpcao(opcao){


  const index = selecionados.value.indexOf(opcao.id)



  if(index !== -1){


    selecionados.value.splice(index,1)


  } else {


    selecionados.value.push(opcao.id)


  }


}



function selecionarTodos(){


  const todosIds = props.opcoes.map(
    opcao => opcao.id
  )


  if(
    selecionados.value.length === props.opcoes.length
  ){


    selecionados.value = []


  } else {


    selecionados.value = [...todosIds]


  }


}


</script>


<template>

<div class="filtro-checkbox">


  <label class="titulo">
    {{ titulo }}
  </label>



  <div
    class="campo"
    @click="aberto = !aberto"
  >


    <span v-if="selecionados.length === 0">
      Todos
    </span>


    <span v-else>
      {{ selecionados.length }} selecionado(s)
    </span>



    <span class="seta">
      ▼
    </span>


  </div>



  <div
    v-if="aberto"
    class="lista"
  >



    <label class="opcao todos">


      <input

        type="checkbox"

        :checked="selecionados.length === opcoes.length"

        @change.stop="selecionarTodos"

      >


      Todos


    </label>




    <label

      v-for="opcao in opcoes"

      :key="opcao.id"

      class="opcao"

    >



      <input

        type="checkbox"

        :checked="selecionados.includes(opcao.id)"

        @change.stop="alternarOpcao(opcao)"

      >



      {{ opcao.nome }}



    </label>




  </div>



</div>

</template>

<style scoped>

.filtro-checkbox {

  display: flex;

  flex-direction: column;

  gap: 6px;

  position: relative;

}


.titulo {

  font-size: 13px;

  font-weight: 600;

  color: #374151;

}


.campo {

  height: 42px;

  padding: 0 12px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: space-between;

  cursor: pointer;

  font-size: 14px;

  color: #374151;

}


.campo:hover {

  border-color: #9ca3af;

}


.seta {

  font-size: 11px;

}


.lista {

  position: absolute;

  top: 70px;

  left: 0;

  width: 100%;

  max-height: 280px;

  overflow-y: auto;

  background: white;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  padding: 10px;

  z-index: 10;

  box-shadow: 0 10px 20px rgba(0,0,0,.08);

}


.opcao {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 8px;

  cursor: pointer;

  font-size: 14px;

  color: #374151;

}


.opcao:hover {

  background: #f3f4f6;

}


.opcao input {

  width: 16px;

  height: 16px;

}


.todos {

  font-weight: 600;

  border-bottom: 1px solid #e5e7eb;

  margin-bottom: 5px;

}


</style>