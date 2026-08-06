<template>
    <section class="top">
        <div class="content-top">
            <h1><span class="material-symbols-outlined">finance_mode</span>Suas estatisticas</h1>
            <p>
                Acompanhe seu desempenho e evolução nos estudos e siga <br>em direção à sua <strong class="green">melhor versão</strong> no ENEM!
            </p>
        </div>
    </section>
</template>

<style scoped>
    .top{
        background-image: url('@/assets/Background.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        border-radius: 18px;
        width: 1820px;
        height: 250px;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;

    }
    
    .top h1{
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        color: white;
        font-size: 35px;
        align-items: center;
        margin-bottom: 0;
    }

    .top p{
        color: white;
        font-size: 17px;
        font-family: sans-serif;
        margin-top: 10px;
        margin-left: 14px;
    }

    .content-top{
        padding: 40px;
    }

    .material-symbols-outlined{
        font-size: 36px;
        padding: 10px;
        color: rgb(74, 175, 65);
    }

    .green{
        color: rgb(74, 175, 65);
    }

</style>