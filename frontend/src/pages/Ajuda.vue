<script setup>
import { Rocket, FileText, ChartNoAxesCombined, UserRound } from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Rodape from '../components/layout/Rodape.vue'
import CabecalhoAjuda from '@/features/Ajuda/CabecalhoAjuda.vue'
import SecaoAjuda from '@/features/Ajuda/SecaoAjuda.vue'
import Perguntas from '@/features/Ajuda/Perguntas.vue'
import GuiaFiltros from '@/features/Ajuda/GuiaFiltros.vue'
import GuiaResolver from '@/features/Ajuda/GuiaResolver.vue'
import GuiaConteudos from '@/features/Ajuda/GuiaConteudos.vue'
import GuiaEstatisticas from '@/features/Ajuda/GuiaEstatisticas.vue'
import GuiaPerfil from '@/features/Ajuda/GuiaPerfil.vue'
import {
  perguntasGeral,
  perguntasQuestoes,
  perguntasEstatisticas,
  perguntasPerfil
} from '@/features/Ajuda/ajudaData.js'
</script>

<template>
  <div>
    <Header />

    <main class="ajuda-page">
      <CabecalhoAjuda />

    <SecaoAjuda
      id="geral"
    >
      <Perguntas :itens="perguntasGeral" titulo="Dúvidas gerais" />
    </SecaoAjuda>

    <SecaoAjuda
      id="questoes"
      :icone="FileText"
      faixa
      titulo="Questões"
      subtitulo="Como buscar, filtrar e resolver questões, e como elas estão organizadas."
    >
      <GuiaFiltros />
      <GuiaResolver />
      <GuiaConteudos />
      <Perguntas :itens="perguntasQuestoes" titulo="Dúvidas sobre questões" />
    </SecaoAjuda>

    <SecaoAjuda
      id="estatisticas"
      :icone="ChartNoAxesCombined"
      titulo="Estatísticas"
      subtitulo="Acompanhe seus acertos, seu desempenho por conteúdo e sua constância nos estudos."
    >
      <GuiaEstatisticas />
      <Perguntas :itens="perguntasEstatisticas" titulo="Dúvidas sobre estatísticas" />
    </SecaoAjuda>

    <SecaoAjuda
      id="perfil"
      :icone="UserRound"
      faixa
      titulo="Perfil e"
      destaque="LGPD"
      subtitulo="Gerencie seus dados, suas listas de estudo e entenda como suas informações são protegidas."
    >
      <GuiaPerfil />
      <Perguntas :itens="perguntasPerfil" titulo="Dúvidas sobre perfil e dados" />
    </SecaoAjuda>
    </main>

    <Rodape />
  </div>
</template>

<style scoped>
.ajuda-page {
  background: var(--cor-fundo-pagina);
  color: var(--cor-texto-principal);
}

.fechamento {
  max-width: 820px;
  margin: 0 auto;
  padding: 72px 24px 80px;
  text-align: center;
  font-family: 'Inter', Arial, sans-serif;
}

.fechamento h2 {
  margin: 0;
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 800;
  letter-spacing: -1.2px;
  color: var(--cor-primaria-texto);
}

.fechamento h2 span { color: var(--cor-primaria); }

.fechamento p {
  margin: 14px 0 26px;
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--cor-texto-secundario);
}

.fechamento-botoes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.botao-principal,
.botao-secundario {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 27px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 11px;
  transition: transform .2s ease, background-color .2s ease;
}

.botao-principal {
  color: var(--cor-texto-invertido);
  background: var(--cor-primaria);
  border: 2px solid var(--cor-primaria);
}

.botao-principal:hover {
  background: var(--cor-primaria-hover);
  border-color: var(--cor-primaria-hover);
  transform: translateY(-2px);
}

.botao-secundario {
  color: var(--cor-primaria-texto);
  background: rgba(120, 120, 120, .08);
  border: 1.5px solid currentColor;
}

.botao-secundario:hover {
  background: rgba(120, 120, 120, .18);
  transform: translateY(-2px);
}

.botao-principal:focus-visible,
.botao-secundario:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .botao-principal, .botao-secundario { transition: none; }
  .botao-principal:hover, .botao-secundario:hover { transform: none; }
}
</style>
