<script setup>
import Header from '@/components/layout/Header.vue'
import Rodape from '@/components/layout/Rodape.vue'
</script>

<template>
  <Header />
  <main class="nao-encontrada">
    <h1>Página não encontrada</h1>
    <p>O endereço acessado não existe ou foi movido.</p>
    <router-link to="/" class="nao-encontrada__link">Voltar ao início</router-link>
    <router-link to="/questoes" class="nao-encontrada__link">Ver questões</router-link>
  </main>
  <Rodape />
</template>

<style scoped>
.nao-encontrada {
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  text-align: center;
  color: var(--cor-texto-principal);
}

.nao-encontrada h1 {
  margin: 0;
  font-size: 28px;
  color: var(--cor-primaria-texto);
}

.nao-encontrada p {
  margin: 0 0 8px;
  color: var(--cor-texto-suave);
}

.nao-encontrada__link {
  color: var(--cor-primaria);
  font-weight: 600;
  text-decoration: none;
}

.nao-encontrada__link:hover,
.nao-encontrada__link:focus-visible {
  text-decoration: underline;
}

[data-tema="escuro"] .nao-encontrada h1,
[data-tema="escuro"] .nao-encontrada__link {
  color: var(--cor-primaria-texto);
}
</style>
