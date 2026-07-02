<script>
</script>

<template>
    <section class="secao-cards">
        <h1 class="title">BEM-VINDO AO <br>BIOQUEST</h1>
        <div class="cards-grid">
            <div class="card-conteiner">
                <span class="material-symbols-outlined livro">import_contacts</span>
                <h3>+120 Questoes</h3>
                <p>Questoes de biologia do ENEM mais recentes</p>
            </div>
            <div class="card-conteiner">
                <span class="material-symbols-outlined">track_changes</span>
                <h3>Estude com foco</h3>
                <p>Filtre por assunto, ano, dificuldade e mais</p>
            </div>
            <div class="card-conteiner">
                <span class="material-symbols-outlined">bar_chart</span>
                <h3>Acompanhe seu progresso</h3>
                <p>Estatisticas detalhadas sobre seu progresso todos os dias</p>
            </div>
        </div>
    </section>  
</template>

<style>
.title{
    font-family: sans-serif;
    font-size: 44px;
    font-weight: 800;
    text-align: center;
    line-height: 1.2;
    color: rgb(28, 75, 47);

    transition: all 0.3s ease;
}
.card-conteiner{
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #ffffff;
    color: rgb(28, 75, 47);
    padding: 20px;
    width: 320px;
    height: 150px;
    font-family: sans-serif;

    transition: all 0.2s ease;
}
.card-conteiner:hover{
    transform: scale(1.2);
}
.cards-grid{
    display: flex;
    gap: 60px;
    padding: 20px;
    justify-content: center;
}
.secao-cards{
    padding: 60px;
    text-align: center;
}
</style>