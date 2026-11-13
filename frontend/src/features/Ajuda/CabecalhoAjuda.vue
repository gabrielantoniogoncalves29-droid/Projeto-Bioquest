
<script setup>
import {
  CircleHelp,
  FileText,
  ChartNoAxesCombined,
  UserRound
} from 'lucide-vue-next'

const atalhos = [
  { id: 'geral', rotulo: 'Dúvidas gerais', icone: CircleHelp },
  { id: 'questoes', rotulo: 'Questões', icone: FileText },
  { id: 'estatisticas', rotulo: 'Estatísticas', icone: ChartNoAxesCombined },
  { id: 'perfil', rotulo: 'Perfil e LGPD', icone: UserRound }
]

function irPara(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
</script>

<template>
  <header class="cabecalho">
    <div class="miolo">
      <h1>Central de <span>ajuda</span></h1>

      <p class="preservar-cor">
        Guias e respostas para cada parte do BioQuest. Escolha uma seção
        para ir direto ao que você precisa.
      </p>

      <nav class="atalhos" aria-label="Seções da página de ajuda">
        <button
          v-for="atalho in atalhos"
          :key="atalho.id"
          type="button"
          class="atalho"
          @click="irPara(atalho.id)"
        >
          <component
            :is="atalho.icone"
            :size="18"
            :stroke-width="1.9"
            aria-hidden="true"
          />
          {{ atalho.rotulo }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.cabecalho {
  position: relative;
  isolation: isolate;

  width: 100%;
  min-height: 500px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 70px 28px 95px;

  font-family: 'Inter', Arial, sans-serif;

  --conteudo-deslocamento-x: -25px;
  --conteudo-deslocamento-y: -5px;

  background-color: var(--cor-fundo-pagina, #f8faf9);

  overflow: hidden;
}

.cabecalho::before {
  content: '';

  position: absolute;
  inset: 0;

  z-index: 0;
  pointer-events: none;

  background-image: url('@/assets/Banner_Ajuda_c.png');

  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.cabecalho::after {
  content: '';

  position: absolute;
  inset: 0;

  z-index: 1;
  pointer-events: none;

  background-image:

    linear-gradient(
      to bottom,
      rgba(248, 250, 249, 0.32) 0%,
      transparent 16%
    ),

    linear-gradient(
      to bottom,
      transparent 67%,
      var(--cor-fundo-pagina, #f8faf9) 100%
    ),

    radial-gradient(
      ellipse at 48% 42%,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.12) 45%,
      transparent 80%
    );
}

[data-tema="escuro"] .cabecalho {
  background-color: var(--cor-fundo-pagina, #0e1110);
}

[data-tema="escuro"] .cabecalho::before {
  background-image: url('@/assets/Banner_Ajuda_e.png');
}

[data-tema="escuro"] .cabecalho::after {
  background-image:

    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0) 14%
    ),

    linear-gradient(
      to bottom,
      transparent 66%,
      var(--cor-fundo-pagina, #0e1110) 100%
    ),

    radial-gradient(
      ellipse at 48% 42%,
      rgba(0, 0, 0, 0.58) 0%,
      rgba(0, 0, 0, 0.40) 55%,
      rgba(0, 0, 0, 0.18) 100%
    );
}

.miolo {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 960px;

  margin: 0 auto;

  text-align: center;

  transform: translate(
    var(--conteudo-deslocamento-x),
    var(--conteudo-deslocamento-y)
  );
}

h1 {
  margin: 0 0 20px;

  font-size: clamp(40px, 4.6vw, 68px);
  font-weight: 800;

  line-height: 1.12;
  letter-spacing: -1.5px;

  color: var(--cor-primaria-texto);
}

h1 span {
  color: var(--cor-primaria);
}

p {
  max-width: 760px;

  margin: 0 auto 36px;

  font-size: clamp(15px, 1.15vw, 19px);
  line-height: 1.7;

  color: var(--cor-texto-secundario);
}

.atalhos {
  display: flex;
  flex-wrap: wrap;

  justify-content: center;
  align-items: center;

  gap: 12px;
}

.atalho {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 11px 20px;

  font-family: inherit;
  font-size: 14.5px;
  font-weight: 650;

  color: var(--cor-primaria);

  background: var(--cor-fundo-card);

  border: 1.5px solid var(--cor-primaria);
  border-radius: 12px;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    color 0.2s ease;
}

.atalho:hover {
  color: var(--cor-texto-invertido);
  background: var(--cor-primaria);
  transform: translateY(-2px);
}

.atalho:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .cabecalho {
    min-height: 460px;
    padding: 60px 24px 85px;

    --conteudo-deslocamento-x: 0px;
    --conteudo-deslocamento-y: 0px;
  }

  h1 {
    font-size: clamp(38px, 5.5vw, 58px);
  }

  p {
    max-width: 600px;
  }
}

@media (max-width: 900px) {
  .cabecalho::before {
    background-image: url('@/assets/responsive/tablet_horizontal/Banner_Ajuda_c__tablet_horizontal_1280x800.webp');
  }

  [data-tema="escuro"] .cabecalho::before {
    background-image: url('@/assets/responsive/tablet_horizontal/Banner_Ajuda_e__tablet_horizontal_1280x800.webp');
  }
}

@media (max-width: 600px) {
  .cabecalho {
    min-height: 0;
    padding: 48px 16px 72px;
  }

  .miolo {
    max-width: 100%;
  }

  h1 {
    font-size: clamp(30px, 8.6vw, 36px);
    letter-spacing: -0.03em;
    margin-bottom: 12px;
    text-wrap: balance;
  }

  p {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 24px;
    text-wrap: pretty;
  }

  .atalhos {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    max-width: 420px;
    margin: 0 auto;
  }

  .atalho {
    min-height: 48px;
    padding: 8px 10px;
    font-size: 14px;
    line-height: 1.2;
  }

  .cabecalho::after {
    background-image:
      linear-gradient(
        to bottom,
        rgba(248, 250, 249, 0.08) 0%,
        rgba(248, 250, 249, 0.34) 50%,
        var(--cor-fundo-pagina, #f8faf9) 100%
      );
  }

  [data-tema="escuro"] .cabecalho::after {
    background-image:
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.18) 0%,
        rgba(0, 0, 0, 0.42) 50%,
        var(--cor-fundo-pagina, #0e1110) 100%
      );
  }
}

@media (max-width: 540px) {
  .cabecalho::before {
    background-image: url('@/assets/responsive/mobile/Banner_Ajuda_c__mobile_720x960.webp');
  }

  [data-tema="escuro"] .cabecalho::before {
    background-image: url('@/assets/responsive/mobile/Banner_Ajuda_e__mobile_720x960.webp');
  }
}

[data-tema="escuro"] .cabecalho h1 {
  color: #edf5f1;
}

[data-tema="escuro"] .cabecalho h1 span {
  color: var(--cor-primaria);
}

[data-tema="escuro"] .cabecalho p {
  color: #d7e2dc;
}

@media (prefers-reduced-motion: reduce) {
  .atalho {
    transition: none;
  }

  .atalho:hover {
    transform: none;
  }
}
</style>
