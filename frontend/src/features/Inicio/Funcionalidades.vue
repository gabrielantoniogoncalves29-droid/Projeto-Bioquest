<script>
</script>

<template>
    <section class="secao-fucoes">
        <div class="funcoes">
            <h1 class="title">FUNCIONALIDADES</h1>
            <div class="cards-funcoes">
                <div class="card">
                    <span class="material-symbols-outlined">quick_reference_all</span>
                    <h1>Questoes</h1>
                    <p>Todas as questões ENEM de biologia (2014-2025). Filtre do seu jeito.</p>
                    <router-link to="/questoes">
                        <button type="button">Acessar</button>
                    </router-link>
                </div>
                <div class="card">
                    <span class="material-symbols-outlined">finance_mode</span>
                    <h1>Estatisticas</h1>
                    <p>Veja seu desempenho em gráficos. Acertos, tempo e evolução diária.</p>
                    <router-link to="/estatisticas">
                        <button type="button">Acessar</button>
                    </router-link>
                </div>
                <div class="card">
                    <span class="material-symbols-outlined">support_agent</span>
                    <h1>Ajuda</h1>
                    <p>Perguntas frequentes, tutoriais e suporte para você estudar sem dificuldades.</p>
                    <router-link to="/ajuda">
                        <button type="button">Acessar</button>
                    </router-link>
                </div>
                <div class="card">
                    <span class="material-symbols-outlined">manage_accounts</span>
                    <h1>Perfil</h1>
                    <p>Seus dados, configurações e histórico de estudos em um só lugar.</p>
                    <router-link to="/perfil">
                        <button type="button">Acessar</button>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.funcoes{
    padding: 4rem clamp(1rem, 4vw, 4rem);
    font-family: sans-serif;
}
.title{
    font-weight: 800;
    font-size: clamp(1.5rem, 6vw, 4rem);
    margin: 0;
    text-align: center;
    line-height: 1.2;
    color: var(--cor-primaria-texto);
    overflow-wrap: anywhere;
}
/* Grid em vez de flex-wrap: os 4 cards ficam sempre em linha e, quando
   falta espaço, caem em 2x2 (nunca 3 + 1 sozinho) e depois em 1 coluna. */
.cards-funcoes{
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 300px));
    justify-content: center;
    padding-top: 80px;
    gap: clamp(20px, 2.5vw, 40px);
}
.card{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    font-size: 1rem;
    color: var(--cor-primaria-texto);

    background-color: var(--cor-fundo-card);
    border-radius: 12px;
    width: 100%;
    min-height: 450px;
    padding: 2rem 1.5rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    transition: 500ms;
}
.card h1{
    font-size: clamp(1.25rem, 2.1vw, 2rem);
    overflow-wrap: anywhere;
}
.card:hover{
    transform: scale(1.05);
}
.card button{
    font-family: sans-serif;
    font-size: 16px;
    width: 100px;
    height: 45px;
    border: 0;
    border-radius: 10px;
    background-color: var(--cor-primaria);
    color: var(--cor-texto-invertido);
    margin-top: 40px;
    transition: 500ms;

    cursor: pointer;
}
.card button:hover{
    background-color: var(--cor-primaria-hover);
}
.material-symbols-outlined{
    font-size: 64px;
}

@media (max-width: 1100px){
    .cards-funcoes{
        grid-template-columns: repeat(2, minmax(0, 300px));
    }
}
@media (max-width: 640px){
    .funcoes{
        padding-top: 2.5rem;
        padding-bottom: 2.5rem;
    }
    .cards-funcoes{
        grid-template-columns: minmax(0, 300px);
        padding-top: 40px;
    }
    .card{
        min-height: 0;
    }
}
</style>