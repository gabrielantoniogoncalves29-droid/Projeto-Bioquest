<template>
    <section class="Banner">
        <div class="topo">
            <h1>FAQ</h1>
            <h2>Perguntas frequentes sobre o BioQuest</h2>
            <p>Aqui você encontra respostas para as duvidas mais comuns sobre <br>nossa plataforma.</p>
        </div>
    </section>
</template>

<style scoped>
    .Banner{
        display: block;
        background-image: url('@/assets/TopBanner.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        height: 380px;
        font-family: sans-serif;
        text-align: center;
    }
    .topo{
        display: block;
        padding-top: 70px;
    }
    .topo h1{
        margin: 0;
        color: white;
        font-size: 56px;
    }
    .topo h2{
        color: rgb(137, 197, 132);
    }
    .topo p{
        color: white;
        font-size: 18px;
    }
</style>