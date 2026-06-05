<template>
    <div class="resume">
        <h2>Tarefas realizadas</h2>
        <ul class="lista-info">
            <li>Questao 91 / 2025 - Finalizada</li>
            <li>Questao 91 / 2025 - Em progresso</li>
            <li>Questao 91 / 2025 - Em progresso</li>
        </ul>
    </div>
</template>

<style>
    .resume{
        border: 1px solid rgb(41, 111, 91);
        border-radius: 6px;
        padding: 10px;
        margin: 20px;
        text-align: left;
        color: white;
        background-color: rgb(41, 111, 91);
        margin-top: 0px;
        position: relative;
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
</style>