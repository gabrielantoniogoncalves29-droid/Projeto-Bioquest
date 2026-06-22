<template>
    <div class="resume">
        <div class="tarefas">
            <span class="material-icons">check_box</span>
            <h2 class="title">TAREFAS REALIZADAS</h2>
        </div>
        <ul class="lista-info">
            <li>Questao 91 / 2025 - <strong>Finalizada</strong></li>
            <li>Questao 91 / 2025 - <strong>Finalizada</strong></li>
            <li>Questao 91 / 2025 - <strong>Finalizada</strong></li>
        </ul>
    </div>
</template>

<style>
    .resume{
        border: 1px solid rgb(41, 111, 91);
        border-radius: 6px;
        padding: 10px;
        margin-left: 50px;
        text-align: left;
        color: white;
        background-color: rgb(41, 111, 91);
        margin-top: 10px;
        position: relative;
        width: 400px;
    }
    .resume::after{
        content: '';
        position: absolute;
        top: -15px;
        left: 20px;
        border-width: 0 15px 15px;
        border-style: solid;
        border-color: transparent transparent rgb(41, 111, 91);
    }
    .title{
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
    }
    .tarefas{
        display: flex;
        align-items: center;
    }
    .lista-info{
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.5;
    }
</style>