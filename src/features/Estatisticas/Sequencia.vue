<script setup>
import { ref } from 'vue';
import Resume_card from '../../features/Estatisticas/Resume_card.vue';
import iconeBioquimica from '../Questoes/icons/2.png'
import iconeCitologia from '../Questoes/icons/3.png'
import iconeEcologia from '../Questoes/icons/12.png'
import iconeVirus from '../Questoes/icons/4.png'

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

const atividades = [
    {   
        nome: "Bioquimica",
        descricao: "Metabolismo",
        icone: iconeBioquimica,
        questoes: 26,
        progresso: 62
    },
    {   
        nome: "Citologia",
        descricao: "Organelas celulares",
        icone: iconeCitologia,
        questoes: 14,
        progresso: 43
    },
    {   
        nome: "Ecologia",
        descricao: "Caracteristicas reino animalia",
        icone: iconeEcologia,
        questoes: 7,
        progresso: 18
    },
    {   
        nome: "Virus",
        descricao: "Caracteristicas dos virus",
        icone: iconeVirus,
        questoes: 20,
        progresso: 55
    }
]

function corProgresso(valor){
    if(valor>=60){
        return "rgb(10, 153, 10)"
    }
    else if(valor<60 && valor>=30){
        return "rgb(224, 185, 10)"
    }
    else{
        return "rgb(182, 1, 1)"
    }
}


</script>

<template>
    <div class="content">
        <div class="resumo">
            <div class="sequencia">
                <div class="topo">
                    <span class="material-icons calendar">event</span>
                    <h1 class="titulo">RESUMO DO MES</h1>
                </div>
                <div class="lista-completa">
                    <ul class="lista-dias">
                        <li>Dom</li>
                        <li>Seg</li>
                        <li>Ter</li>
                        <li>Qua</li>
                        <li>Qui</li>
                        <li>Sex</li>
                        <li>Sáb</li>
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
    
        <div class="lado-direito">
            <div class="info-geral">
                    <div class="container questoes">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">import_contacts</span>
                            <h3 class="high">Questões resolvidas</h3>
                        </div>
                        <p class="info-container">34</p>
                        <p class="melhoria">+12% este mês</p>
                    </div>
                    <div class="container desempenho">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">track_changes</span>
                            <h3 class="high">Desempenho</h3>
                        </div>
                        <p class="info-container">78%</p>
                        <p class="melhoria">+5% este mês</p>
                    </div>
                    <div class="container simulados">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">bar_chart</span>
                            <h3 class="high">Dias praticados</h3>
                        </div>
                        <p class="info-container">15</p>
                        <p class="melhoria">+26% este mês</p>
                    </div>
                    <div class="container ranking">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">emoji_events</span>
                            <h3 class="high">Questoes acertadas</h3>
                        </div>
                        <p class="info-container">28</p>
                        <p class="melhoria">+7% este mês</p>
                    </div>
            </div>

            <div class="atividades">
                <div class="atividades-info">
                    <span class="material-symbols-outlined livro">import_contacts</span>
                    <h2 class="high-title">Continue seus estudos</h2>
                    <div class="Ver-questoes">
                        <router-link to="/questoes" class="link-questoes">Ver todas as questoes <span class="material-icons">arrow_forward</span></router-link>
                    </div>
                </div>

                <div class="conteiner-atividades"
                     v-for="atividade in atividades"
                     :key="atividade.nome"
                >
                    <img :src="atividade.icone" :alt="atividade.nome" class="icone">
                    <div class="activites-description">
                        <h2> {{ atividade.nome }}</h2>
                        <p>{{ atividade.descricao }}</p>
                    </div>
                    <div class="direita">
                        <p> {{ atividade.questoes }} questões</p>
                        <div class="barra">
                            <div class="progresso"
                                 :style="{
                                    width: atividade.progresso + '%',
                                    background: corProgresso(atividade.progresso)
                                 }"
                            ></div>
                        </div>
                        <p :style="{
                            color: corProgresso(atividade.progresso)
                        }"
                        >{{ atividade.progresso }}%</p>
                        <router-link to="/questoes" class="btn-continuar">Continuar</router-link>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style>
    .content{
        display: flex;
    }
    .resumo{
        display: flex;
        flex-direction: column;
    }
    .sequencia{
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        align-items: center;
        text-align: center;
        margin: 50px;
        margin-bottom: 0px;
        overflow: hidden;
        width: 420px;
        height: 300px;
    }
    .titulo{
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        color: #202020;
    }
    .topo{
        color: #296f5b;
        display: flex;
        align-items: center;
        padding: 10px;
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
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
    }
    .lista-dias{
        margin-bottom: 10px;
        font-weight: bold;
        color: #296f5b;
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
        color: #202020;

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
    .calendar{
        font-size: 32px;
    }
    .info-geral{
        display: grid;
        grid-template-columns: repeat(4, 300px);
        gap: 20px;
        margin-top: 50px;
        height: 180px;
    }
    .container{
        display: flex;
        flex-direction: column;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;

        cursor: pointer;
    }
    .container:hover{
        transform: scale(1.1);
        z-index: 2;
    }
    .circle{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        color: white;
        font-size: 32px;
        margin: 20px 10px 10px 20px;
    }
    .questoes .circle{
        background-color: green;
    }
    .desempenho .circle{
        background-color: rgb(255, 187, 0);
    }
    .simulados .circle{
        background-color: purple;
    }
    .ranking .circle{
        background-color: rgb(0, 132, 255);
    }
    .high{
        padding-top: 15px;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 17px;
    }
    .conteiner-line{
        display: flex;
    }
    .info-container{
        text-align: center;
        margin: 0;
        font-size: 34px;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-weight: bold;
    }
    .melhoria{
        text-align: center;
        color: rgb(0, 201, 0);
        font-family: sans-serif;
    }
    .link-questoes{
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        text-decoration: none;
        color: #296f5b;
        font-weight: bold;
    }
    .atividades{
        margin-top: 20px;
        border-radius: 12px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        padding: 20px;
    }
    .conteiner-atividades{
        display: flex;
        border-radius: 12px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        padding: 20px;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        margin: 20px;
        background-color: white;
    }
    .conteiner-atividades:hover{
        transform: scale(1.05);
    }
    .icone{
        width: 75px;
        height: 75px;
    }
    .atividades-info{
        display: flex;
        align-items: center;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
    }
    .Ver-questoes{
        display: flex;
        margin-left: auto;
        flex-direction: row;
        align-items: center;
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10px;
        color: #296f5b;
        cursor: pointer;
    }
    .livro{
        font-size: 32px;
        color: #296f5b;
    }
    .material-symbols-outlined{
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    }
    .high-title{
        padding-left: 10px;
    }
    .activites-description{
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        margin-top: 20px;
    }
    .activites-description p{
        margin: 0;
    }
    .activites-description h2{
        margin: 0;
    }
    .barra{
        width: 120px;
        height: 8px;
        border-radius: 10px;
        overflow: hidden;
        background-color: #ececec;
    }
    .progresso{
        height: 100%;
        transition: 0.3s;
    }
    .direita{
        display: flex;
        margin-left: auto;
        align-items: center;
        gap: 20px;
    }
    .btn-continuar{
        text-decoration: none;
        border: 1px solid #296f5b;
        border-radius: 8px;
        background-color: #296f5b;
        padding: 10px;
        color: white;
        
        cursor: pointer;
    }
</style>