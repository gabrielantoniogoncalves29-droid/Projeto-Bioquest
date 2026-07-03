<script>
</script>

<template>
    <section class="container-questoes">
        <div class="container-left">
            <h1>Banco de questões <br>do ENEM</h1>
            <p class="sub-info">Se prepare corretamente para o Exame Nacional.</p>
            <p class="filtre">Filtre as questões</p>
            <div class="filtro-box">
                <p><span class="material-symbols-outlined">calendar_month</span>Por Ano</p>
                <p><span class="material-symbols-outlined">topic</span>Por Categoria</p>
                <p><span class="material-symbols-outlined">account_tree</span>Por Eixo temático</p>
                <p><span class="material-symbols-outlined">list_alt</span>Por Conteúdo</p>
                <p><span class="material-symbols-outlined">subdirectory_arrow_right</span>Por Subconteúdo</p>
            </div>
        </div>
        <div class="container-right">
            <p>Todas as questões de Biologia do ENEM em um só lugar! De 2014 a 2025, com filtros por ano, categoria, eixo temático, conteúdo e subconteúdo. Estude com organização, pratique com foco e chegue preparado no dia da prova. Venha fazer parte!</p>
            <router-link to="/questoes">
                <button type="button">Descubra as questões</button>
            </router-link>
        </div>
    </section>
</template>

<style scoped>
    .container-questoes{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        background-image: url('@/assets/Design-fundo.png');
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 400px;
        transition: all 0.3s ease;
        margin-top: 50px;
        padding: 80px;
        align-items: center;
    }
    .container-left{
        font-family: sans-serif;
        margin-left: 60px;
        color: white;
    }
    .container-left h1{
        font-weight: 700;
        font-size: 64px;
        text-align: left;
        line-height: 1.2;
        margin-bottom: 0;
    }
    .sub-info{
         font-size: 26px;
    }
    .filtre{
        font-size: 18px;
        margin-bottom: 0;
    }
    .filtro-box{
        display: flex;
        gap: 10px;
        font-size: 14px;
    }
    .filtro-box p:hover{
        transform: scale(1.05);
        background-color: rgba(255, 255, 255, 0.2);
    }
    .filtro-box p{
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 10px;
        gap: 5px;

        cursor: pointer;
    }
    .container-right{
        font-family: sans-serif;
        margin: 0;
        color: white;
        margin-right: 60px;
    }
    .container-right p{
        text-align: justify;
        font-size: 26px;
    }
    .container-right button{
        font-size: 17px;
        width: 250px;
        height: 45px;
        border: 0;
        border-radius: 10px;
        background-color: rgb(20, 184, 86);
        color: white;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        
        cursor: pointer;
    }
    .container-right button:hover{
        background-color: rgb(12, 214, 93);
    }
</style>