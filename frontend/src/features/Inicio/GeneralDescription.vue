<script>
</script>

<template>
    <section class="secao-cards">
        <h1 class="title">BEM-VINDO AO <br>BIOQUEST</h1>
        <div class="cards-flex">
            <div class="card-conteiner">
                <span class="material-symbols-outlined">import_contacts</span>
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

<style scoped>
.title{
    font-family: sans-serif;
    font-size: clamp(1.75rem, 6vw, 3rem);
    font-weight: 800;
    text-align: center;
    line-height: 1.2;
    color: var(--cor-primaria-texto); 
}
.card-conteiner{
    border: 1px solid var(--cor-borda);
    border-radius: 10px;
    background-color: var(--cor-fundo-card);
    color: var(--cor-primaria-texto);
    padding: 20px;
    width: 100%;
    min-height: 150px;
    font-family: sans-serif;
    transition: 500ms ease; 
}
.card-conteiner h3{
    overflow-wrap: anywhere;
}
.card-conteiner:hover{
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
}
.cards-flex{
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 320px));
    justify-content: center;
    gap: clamp(48px, 5vw, 80px);
    padding: 20px;
}
.secao-cards{
    padding: clamp(24px, 5vw, 60px);
    text-align: center;
}
.material-symbols-outlined{
    font-size: 48px;
}

@media (max-width: 1000px){
    .cards-flex{
        grid-template-columns: minmax(0, 320px);
        gap: 48px;
    }
    .card-conteiner:hover{
        transform: scale(1.05);
    }
}

@media (max-width: 480px){
    .secao-cards{
        padding: 1.5rem 0.75rem;
    }
    .cards-flex{
        padding: 10px 0;
        gap: 24px;
    }
    .card-conteiner{
        box-sizing: border-box;
        min-height: 0;
    }
}
</style>