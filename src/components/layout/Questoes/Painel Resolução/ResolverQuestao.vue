<script setup>
import HeaderQuestao from '@/components/layout/Questoes/Painel Resolução/HeaderQuestão.vue'
import Enunciado from '@/components/layout/Questoes/Painel Resolução/Enunciado.vue'
import AlternativaItem from '@/components/layout/Questoes/Painel Resolução/AlternativaItem.vue'
import QuestaoFooter from '@/components/layout/Questoes/Painel Resolução/QuestaoFooter.vue'
import PainelResolucao from '@/components/layout/Questoes/Painel Resolução/PainelResolucao.vue'
import Header from '@/components/layout/Header.vue'

function goback() {
  window.history.back();
}
</script>

<template>
<Header />
  <main class="resolver-page">

    <div class="breadcrumb">
      <span @click="goback()" style='cursor: pointer;' class="voltar">⟵ Voltar </span>
      <br>
      <span class="separator">|</span>
      <br>
      <span>Biblioteca de Questões</span>
      <span>/</span>
      <span>Pesquisa</span>
      <span>/</span>
      <span>Questão 91</span>
      <span>/</span>
      <span>Resolver</span>
    </div>

    <div class="resolver-layout">

      <section class="questao-container">

        <HeaderQuestao />

        <Enunciado />

        <AlternativaItem />

        <QuestaoFooter />

      </section>

      <aside class="painel-container">
        <PainelResolucao />
      </aside>

    </div>

  </main>
</template>

<style scoped>

.resolver-page {
  padding: 24px;
  background: #fcfefd67;
  min-height: 100vh;
}

.breadcrumb {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 24px;

  color: #5f6368;
  font-size: 14px;
}

.breadcrumb span:hover {
  text-decoration: underline;
}

.voltar {
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
}

.separator {
  color: #d0d0d0;
}

.resolver-layout {
  display: grid;
  grid-template-columns: 2.4fr 0.9fr;
  gap: 16px;
}

.questao-container {
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  overflow: hidden;
}

.painel-container {
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  overflow: hidden;
}

@media (max-width: 1200px) {

  .resolver-layout {
    grid-template-columns: 1fr;
  }

}

</style>