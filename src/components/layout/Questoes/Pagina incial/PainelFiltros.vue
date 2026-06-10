<script setup>

import FiltrosSelect from './filtros/FiltrosSelect.vue'
import FiltrosCheckbox from './filtros/FiltrosCheckbox.vue'
import FiltrosAcoes from './filtros/FiltrosAcoes.vue'

const anos = [
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014'
]

const eixos = [
  'Moléculas, células e tecidos',
  'Hereditariedade e diversidade da vida',
  'Identidade dos seres vivos',
  'Ecologia e Ciências Ambientais',
  'Origem e evolução da vida',
  'Qualidade de vida das populações humanas'
]

const conteudos = [
  'Citologia',
  'Histologia',
  'Embriologia',
  'Bioquímica',
  'Genética',
  'Evolução',
  'Botânica',
  'Zoologia',
  'Ecologia',
  'Fisiologia',
  'Parasitologia',
  'Microbiologia',
  'Biotecnologia'
]

const subconteudos = [
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'C7',
  'C8'
]

const textoIntro = [
  'Com texto',
  'Sem texto'
]

const recursosVisuais = [
  'Sem imagem',
  'Figura',
  'Gráfico',
  'Tabela' 
]

const importanciaImagem = [
  'Essencial',
  'Importante',
  'Complementar',
  'Irrelevante'
]
</script>

<template>

<div class="painel-filtros">

  <div class="linha-filtros">

    <FiltrosSelect
      titulo="Ano da prova"
      placeholder="Todos"
      :opcoes="anos"
    />

    <FiltrosSelect
      titulo="Banca"
      placeholder="Todas"
      :opcoes="bancas"
    />

    <FiltrosSelect
      titulo="Eixo temático"
      placeholder="Todos"
      :opcoes="eixos"
    />

    <FiltrosSelect
      titulo="Conteúdo"
      placeholder="Todos"
      :opcoes="conteudos"
    />

    <FiltrosSelect
      titulo="Subconteúdo"
      placeholder="Todos"
      :opcoes="subconteudos"
    />

<FiltrosSelect
  titulo="Texto introdutório"
  placeholder="Todos"
  :opcoes="textoIntro"
/>

<FiltrosSelect
  titulo="Recurso visual"
  placeholder="Todos"
  :opcoes="recursosVisuais"
/>

<FiltrosSelect
  titulo="Importância da imagem"
  placeholder="Todas"
  :opcoes="importanciaImagem"
/>
  </div>
  </div>

</template>
  <style scoped>

.painel-filtros {

  display: flex;

  flex-direction: column;

  gap: 24px;
  box-sizing: border-box;
  padding: 24px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

}

.linha-filtros {

  display: grid;

grid-template-columns:
  repeat(auto-fit, minmax(160px, 1fr));

  gap: 18px;

}



.linha-checkbox {

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(320px, 1fr));

  gap: 24px;

}

@media (max-width: 1400px) {

  .linha-filtros {

    grid-template-columns:
      repeat(3, minmax(180px, 1fr));

  }

}

@media (max-width: 900px) {

  .linha-filtros {

    grid-template-columns:
      repeat(2, minmax(180px, 1fr));

  }

}

@media (max-width: 600px) {

  .linha-filtros {

    grid-template-columns: 1fr;

  }

  .linha-checkbox {

    grid-template-columns: 1fr;

  }

}

</style>