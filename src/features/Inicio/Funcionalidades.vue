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
    padding: 4rem;
    font-family: sans-serif;
}
.title{
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 4rem);
    margin: 0;
    text-align: center;
    line-height: 1.2;
    color: rgb(28, 75, 47);
}
.cards-funcoes{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 80px;
    gap: 40px;
}
.card{
    display: flex;
    flex-grow: 1;
    flex-basis: 200;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    font-size: 1rem;
    color: rgb(28, 75, 47);

    background-color: white;
    border-radius: 12px;
    width: 100%;
    max-width: 300px;
    min-height: 500px;
    padding: 2rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    transition: 500ms;
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
    background-color: rgb(28, 75, 47);
    color: white;
    margin-top: 40px;
    transition: 500ms;

    cursor: pointer;
}
.card button:hover{
    background-color: rgb(39, 109, 67);
}
.material-symbols-outlined{
    font-size: 64px;
}
</style>