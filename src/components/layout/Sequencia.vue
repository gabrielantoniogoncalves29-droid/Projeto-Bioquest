<script setup>
import { ref } from 'vue';
import Resume_card from './Resume_card.vue';

const lista = ref(["", "", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"])

const diaSelecionado = ref(null)

const diaInfo = ref(false)


function diaVazio(dia){
    return dia === ""
}

function selecionado(dia){
    if(diaVazio(dia)){
        diaInfo.value = false
        return
    }
    if(diaSelecionado.value === dia){
        diaSelecionado.value = null
        diaInfo.value = false
    }
    else{
        diaSelecionado.value = dia
        diaInfo.value = true
    }
}

</script>

<template>
    <div class="resumo">
        <div class="sequencia">
            <div class="topo">
                <h1 class="titulo">RESUMO DO MES</h1>
            </div>
            <div class="lista-completa">
                <ul class="lista-dias">
                    <li>Domingo</li>
                    <li>Segunda-feira</li>
                    <li>Terça-feira</li>
                    <li>Quarta-feira</li>
                    <li>Quinta-feira</li>
                    <li>Sexta-feira</li>
                    <li>Sábado</li>
                </ul>
                <ul class="lista-datas">
                    <li v-for="dia in lista" :key="dia" 
                    @click="selecionado(dia)"
                    :class="{ativo: diaSelecionado === dia}"
                    >
                    {{ dia }}
                    </li>
                </ul>
            </div>
        </div>
        <br>
        <transition name="fade">
        <Resume_card v-show="diaInfo"></Resume_card>
        </transition>
    </div>

</template>

<style>
    .resumo{
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
    .sequencia{
        display: grid;
        grid-template-rows: auto auto auto;
        border: 1px solid #296f5b;
        border-radius: 12px;
        align-items: center;
        text-align: center;
        margin: 20px;
        color: #296f5b;
        overflow: hidden;
    }
    .titulo{
        color: white;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 23px;
    }
    .topo{
        background-color: rgb(41, 111, 91);
    }
    .lista-completa{
        padding: 10px;
    }
    .lista-dias, .lista-datas{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        list-style-type: none;
        padding: 0;
        margin: 0;
        text-align: center;
    }
    .lista-dias{
        margin-bottom: 10px;
        font-weight: bold;
    }
    .lista-datas li{
        display: flex;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-weight: bold;
        font-size: 14px;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        padding: 10px;

        cursor: pointer;
    }
    .lista-datas li:hover{
        transform: scale(1.2);
    }
    .lista-datas li.ativo{
        width: 10px;
        height: 10px;
        border: 1.5px solid #296f5b;
        border-radius: 50%;
        display: flex;
        color: white;
        background-color: #296f5b;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>