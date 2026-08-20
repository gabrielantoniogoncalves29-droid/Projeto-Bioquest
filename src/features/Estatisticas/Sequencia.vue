<script setup>
import { ref } from 'vue';
import iconeBioquimica from '../Questoes/icons/2.png'
import iconeCitologia from '../Questoes/icons/3.png'
import iconeEcologia from '../Questoes/icons/12.png'
import iconeVirus from '../Questoes/icons/4.png'

const lista = ref(["", "", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"])

const diaSelecionado = ref(null)


function diaVazio(dia){
    return dia === ""
}

function selecionado(dia){
    if(diaVazio(dia)){
        return
    }
    if(diaSelecionado.value === dia){
        diaSelecionado.value = null
    }
    else{
        diaSelecionado.value = dia
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
        <div>
            <div class="sequencia">
                <div class="topo">
                    <span class="material-symbols-outlined calendar">calendar_month</span>
                    <h1 class="titulo">RESUMO DO MES</h1>
                </div>
                <div class="mes">
                    <span class="material-symbols-outlined seta1">
                        keyboard_arrow_down
                    </span>
                    <p>Maio</p>
                    <span class="material-symbols-outlined seta2">
                        keyboard_arrow_down
                    </span>
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
                <div class="ofensiva">
                <span class="material-icons fire">local_fire_department</span>
                <div class="ofensiva-info">
                    <h2>Sequência atual</h2>
                    <h1>7 dias</h1>
                    <p>Continue assim</p>
                </div>
                </div>
            </div>
            <div class="ajuda">
                <span class="material-symbols-outlined">e911_emergency</span>
                <div class="help">
                    <p>Para mais informacões acesse <br>a pagina de ajuda</p>
                    <button type="button">Ajuda</button>
                </div>
            </div>
        </div>
        <div class="lado-direito">
            <div class="info-geral">
                    <div class="container questoes">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">import_contacts</span>
                            <h3 class="high">Questões resolvidas</h3>
                        </div>
                        <p class="info-container">34</p>
                        <p class="melhoria">+12% este mês <span class="material-symbols-outlined">trending_up</span></p>
                    </div>
                    <div class="container desempenho">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">track_changes</span>
                            <h3 class="high">Desempenho</h3>
                        </div>
                        <p class="info-container">78%</p>
                        <p class="melhoria">+5% este mês <span class="material-symbols-outlined">trending_up</span></p>
                    </div>
                    <div class="container simulados">
                        <div class="conteiner-line">
                            <span class="material-symbols-outlined circle">bar_chart</span>
                            <h3 class="high">Dias praticados</h3>
                        </div>
                        <p class="info-container">15</p>
                        <p class="melhoria">+26% este mês<span class="material-symbols-outlined">trending_up</span></p>
                    </div>
            </div>

            <div class="atividades">
                <div class="atividades-info">
                    <span class="material-symbols-outlined livro">import_contacts</span>
                    <h2 class="high-title">Continue seus estudos</h2>
                    <div class="Ver-questoes">
                        <router-link to="/questoes" class="link-questoes">Ver todas as questões <span class="material-icons">arrow_forward</span></router-link>
                    </div>
                </div>

                <div class="conteiner-atividades"
                     v-for="atividade in atividades"
                     :key="atividade.nome"
                >
                    <div class="esquerda">
                        <img :src="atividade.icone" :alt="atividade.nome" class="icone">
                        <div class="activites-description">
                            <h2> {{ atividade.nome }}</h2>
                            <p>{{ atividade.descricao }}</p>
                        </div>
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
        <div class="lado-esquerdo">
            <div class="grafico">
                <div class="title-grafico">
                    <span class="material-symbols-outlined circle">track_changes</span>
                    <h1>Desempenho geral</h1>
                </div>
                <div class="circulo">
                    <div class="centro">
                        <h2>78%</h2>
                        <p>Desempenho <br>medio</p>
                    </div>
                </div>
                <div class="acertos">
                    <div class="acertos-esquerda">
                        <p>28 <br>Acertos</p>
                    </div>
                    <div class="acertos-direita">
                        <p>6<br>Erros</p>
                    </div>
                </div>
            </div>
            <div class="evolucao">
                <img src="@/assets/plant.png" alt="">
                <h1>Você está evoluindo!</h1>
                <p>Continue praticando e acompanhe seu progresso.</p>
            </div>
        </div>
    </div>

</template>

<style>
    .ajuda{
        display: flex;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        align-items: center;
        text-align: center;
        margin: 50px;
        margin-bottom: 0px;
        overflow: hidden;
        width: 420px;
        min-height: 120px;
        height: fit-content;
        font-family: sans-serif;
    }
    .help {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    }
    .help p{
        margin: 0;
        color: rgb(28, 75, 47);
        font-size: 16px;
        text-align: left;
        font-weight: bold;
    }
    .help button{
        font-family: sans-serif;
        font-size: 14px;
        width: 75px;
        height: 35px;
        border: 0;
        border-radius: 10px;
        background-color: rgb(28, 75, 47);
        color: white;
        cursor: pointer;
        transition: 500ms ease;
    }
    .help button:hover{
        background-color: rgb(39, 109, 67);
    }
    .ajuda span{
        font-size: 46px;
        color: rgb(28, 75, 47);
        border-radius: 50%;
        background-color: rgba(186, 255, 186, 0.5);
        padding: 10px;
        margin-left: 30px;
        margin-right: 30px;

    }
    .evolucao{
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        margin: 50px 40px;
        width: 310px;
        height: 245px;
        border-radius: 12px;
        font-family: sans-serif;
        text-align: center;
        align-items: center;
        font-size: 16px;
        padding: 20px;
    }
    .evolucao img{
        width: 110px;
        padding: 0;
        margin: 0;
    }
    .evolucao h1{
        color: rgb(28, 75, 47);
        font-size: 22px;
    }
    .content{
        display: flex;
    }
    .ofensiva{
        display: flex;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        margin: 30px;
        font-family: sans-serif;
        align-items: center;
        padding: 10px 40px;
    }
    .fire{
        font-size: 96px;
        color: rgb(255, 145, 0);
        animation: fogo 2s ease-in-out infinite;
    }
    @keyframes fogo{
        from, to{
            transform: scale(1);
        }
        50%{
            transform: scale(1.04);
        }
    }
    .ofensiva-info{
        font-weight: bold;
        padding: 0;
        margin: 0;
        text-align: left;
    }
    .ofensiva h2{
        font-size: 16px;
    }
    .ofensiva p{
        font-size: 16px;
        color: rgb(28, 75, 47);
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
        min-height: 550px;
        height: fit-content;
    }
    .mes{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: sans-serif;
        font-size: 17px;
        font-weight: bold;
        margin: 0;
        padding-left: 50px;
        padding-right: 50px;
    }
    .seta1{
        rotate: 90deg;
        cursor: pointer;
    }
    .seta2{
        rotate: -90deg;
        cursor: pointer;
    }
    .titulo{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 17px;
        color: #000000;
        font-weight: bold;
        padding-bottom: 0;
    }
    .topo{
        color: rgb(28, 75, 47);
        display: flex;
        align-items: center;
        padding: 10px;
        padding-bottom: 0;
    }
    .lista-completa{
        padding: 10px;
        padding-top: 10px;
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
        color: rgb(28, 75, 47);
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
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: flex;
        color: rgb(28, 75, 47);
        background-color: rgba(186, 255, 186, 0.5);
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .calendar{
        font-size: 30px;
        padding: 6px;
    }
    .info-geral{
        display: grid;
        grid-template-columns: repeat(4, 305px);
        gap: 20px;
        margin-top: 50px;
        height: 180px;
    }
    .container{
        display: flex;
        flex-direction: column;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        transition: 300ms ease;

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
        color: rgb(40, 209, 40);
        font-family: sans-serif;
        font-weight: bold;
    }
    .link-questoes{
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        text-decoration: none;
        color: rgb(28, 75, 47);
        font-weight: bold;
    }
    .atividades{
        margin-top: 20px;
        border-radius: 12px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        padding: 20px;
        height: fit-content;
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
        transition: 400ms ease;
        height: 45px;
    }
    .conteiner-atividades:hover{
        transform: scale(1.05);
    }
    .icone{
        width: 65px;
        height: 65px;
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
        color: rgb(28, 75, 47);
        cursor: pointer;
    }
    .Ver-questoes:hover{
        color: rgb(39, 109, 67);
    }
    .livro{
        font-size: 32px;
        color: rgb(28, 75, 47);
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
    .esquerda{
        display: flex;
        align-items: center;
    }
    .activites-description{
        display: flex;
        flex-direction: column;
        padding-left: 10px;
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
        border: 1px solid rgb(28, 75, 47);
        border-radius: 8px;
        background-color: rgb(28, 75, 47);
        padding: 10px;
        color: white;
        transition: 500ms ease;
        
        cursor: pointer;
    }
    .btn-continuar:hover{
        background-color: rgb(44, 112, 71);
    }
    .lado-direito{
        margin-bottom: 80px;
        width: 960px;
    }
    .grafico{
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        margin: 50px 40px;
        width: 350px;
        height: 400px;
    }
    .title-grafico{
        display: flex;
        align-items: center;
    }
    .title-grafico span{
        color: rgb(44, 112, 71);
        font-size: 2rem;
    }
    .title-grafico h1{
        font-family: sans-serif;
        font-size: 1.5rem;
    }
    .acertos{
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        margin: 20px 40px;
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
    }
    .acertos-esquerda{
        font-family: sans-serif;
        font-weight: bold;
        border-right: 2px solid #3b3b3b1a ;
        padding-right: 38px;
        text-align: center;
    }
    .acertos-direita{
        font-family: sans-serif;
        font-weight: bold;
        text-align: center;
    }
    .circulo{
        width: 180px;
        height: 180px;
        border-radius: 50%;

        background: conic-gradient(
        #2e9d45 0% 78%,
        #e5e5e5 78% 100%
        );

        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }
    .centro{
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
    }
    .centro h2{
        margin: 0;
        font-size: 2rem;
    }
    .centro p{
        text-align: center;
        margin: 0;
    }
</style>