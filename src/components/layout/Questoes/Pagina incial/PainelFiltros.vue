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
'Origem da vida',
'Bioquímica',
'Citologia',
'Metabolismo celular',
'Histologia',
'Reprodução e embriologia',
'Taxonomia e classificação dos seres vivos',
'Vírus',
'Seres procarióticos',
'Reino Protoctista',
'Fungos',
'Botânica',
'Zoologia',
'Fisiologia humana e comparada',
'Genética',
'Evolução',
'Ecologia'
]
 
const subconteudos = {

  "Origem da vida": [
    "Teorias sobre a origem da vida",
    "Metabolismo dos primeiros seres vivos"
  ],
  "Bioquímica": [
    "Água e sais minerais",
    "Carboidratos",
    "Lipídios",
    "Proteínas",
    "Vitaminas"
  ],
  "Citologia": [
    "Microscopia e teoria celular",
    "Membrana plasmática",
    "Citoplasma e organelas citoplasmáticas",
    "Núcleo celular e seus componentes",
    "Divisão celular"
  ],
  "Metabolismo celular": [
    "Respiração aeróbica / Produção de ATP",
    "Fermentação",
    "Quimiossíntese"
  ],
  "Histologia": [
    "Tecido epitelial",
    "Tecido conjuntivo",
    "Tecido muscular",
    "Tecido nervoso"
  ],
  "Reprodução e embriologia": [
    "Tipos de reprodução e ciclos de vida",
    "Reprodução humana ",
    "Desenvolvimento embrionário humano"
  ],
  "Taxonomia e classificação": [
    "Cladograma e análise evolutiva das espécies",
    "Classificação dos seres vivos"
  ],
  "Vírus": [
    "Estrutura geral dos vírus",
    "Reprodução dos vírus",
    "Vírus e saúde humana"
  ],
  "Seres procarióticos": [
    "Estrutura geral das células procariontes",
    "Reprodução das bactérias",
    "Relação das bactérias com a saúde humana"
  ],
  "Reino Protoctista": [
    "Importância econômica e ambiental das algas",
    "Importância médica dos protozoários"
  ],
  "Fungos": [
    "Características gerais",
    "Reprodução dos fungos",
    "Importância médica, econômica e ambiental"
  ],
  "Botânica": [
    "Filos das plantas (Briófitas, Pteridófitas, Gimnospermas e Angiospermas)",
    "Reprodução das plantas",
    "Anatomia das angiospermas (raiz, caule, folha, flor, fruto)",
    "Fisiologia das angiospermas (nutrição, fotossíntese e hormônios vegetais)"
  ],
  "Zoologia": [
    "Características dos animais e dos principais filos",
    "Aspectos evolutivos dos animais"
  ],
  "Fisiologia humana e comparada": [
    "Sistema digestório",
    "Sistema respiratório",
    "Sistema circulatório",
    "Sistema urinário",
    "Sistema imunológico",
    "Sistema esquelético",
    "Sistema nervoso",
    "Sistema endócrino",
    "Sistema sensorial"
  ],
  "Genética": [
    "Genética molecular (DNA, RNA e síntese de proteínas)",
    "Genética clássica (leis de Mendel, heredogramas, herança ligada ao sexo)",
    "Genética e biotecnologia"
  ],
  "Evolução": [
    "Teorias evolucionistas (Darwin e Lamarck)",
    "Evidências evolutivas",
    "Teoria sintética da evolução",
    "Evolução humana",
    "Tempo geológico e formação das espécies",
    "Genética de populações"
  ],
  "Ecologia": [
    "Conceitos de Ecologia",
    "Cadeias e teias alimentares",
    "Fluxo de energia e ciclos biogeoquímicos",
    "Ecologia de populações",
    "Relações ecológicas",
    "Sucessão ecológica",
    "Biomas e suas características",
    "Interferência antrópica nos ecossistemas"
  ],
  "Biologia e aspectos sociais humanos": [
    "Primeiros socorros",
    "Importância das atividades físicas e vida saudável",
    "Questões socioambientais e de saúde pública (pobreza, obesidade, violência, drogas, etc.)"
  ]
}

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