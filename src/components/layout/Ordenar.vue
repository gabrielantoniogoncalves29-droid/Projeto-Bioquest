<script setup>
import { ref } from 'vue'

const aberta = ref(null);
const opcaoSelecionada = ref("Ordenar por");

function barra(id){
    if(aberta.value === id){
      aberta.value = null
    }
    else{
      aberta.value = id
    }
  }

function selecionar(opcao){
    opcaoSelecionada.value = opcao
    aberta.value = null

    console.log(opcao)
}

</script>

<template>
    <div>
    <div class="dropdown">
    <div @click="barra(1)" id="ordenar">
        {{ opcaoSelecionada }}
        <span class="material-icons">arrow_drop_down</span>
    </div>
    <div v-if="aberta === 1">
        <div class="item" @click="selecionar('Mais recentes')">
            Mais recentes
        </div>
        <div class="item" @click="selecionar('Ordem alfabetica')">
            Ordem alfabetica
        </div>
        <div class="item" @click="selecionar('Nivel de dificuldade')">
            Nivel de dificuldade
        </div>
    </div>
    </div>
    </div>
</template>

<style>
    .dropdown{
        position: relative;
        width: 200px;
        margin-left: auto;
        top: 0px;
    }
    #ordenar{
        border: solid 1px #ddd;
        border-radius: 3px;
        padding: 12px;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;
    }
    .item{
        border: solid 1px #ddd;
        padding: 10px;

        cursor: pointer;
    }
</style>