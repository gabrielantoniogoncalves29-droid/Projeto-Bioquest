
<script setup>
import { ref, onMounted } from 'vue'

const tituloBioquest = ref(null)

onMounted(() => {
  const tituloBanner = document.querySelector(
    '.banner_description h1'
  )

  const tituloDestino = tituloBioquest.value

  if (!tituloBanner || !tituloDestino) return

  const fonteBanner = window.getComputedStyle(tituloBanner)

  const propriedades = [
    'font-family',
    'font-weight',
    'font-style',
    'font-stretch',
    'font-variation-settings',
    'font-feature-settings',
    'font-optical-sizing',
    'font-synthesis'
  ]

  propriedades.forEach((propriedade) => {
    const valor = fonteBanner.getPropertyValue(propriedade)

    if (valor) {
      tituloDestino.style.setProperty(
        propriedade,
        valor,
        'important'
      )
    }
  })
})
</script>

<template>
  <section
    class="secao-cards"
    aria-labelledby="titulo-bioquest"
  >
    <div class="secao-conteudo">

      <header class="secao-cabecalho">

<h2 id="titulo-bioquest" class="title">
  Bem-vindo ao <span>BioQuest</span> !
</h2>

        <p class="secao-subtitulo">
          Tudo o que você precisa para estudar Biologia para o ENEM,
          em um só lugar.
        </p>
      </header>

      <div class="cards-flex">

        <article class="card-conteiner">
          <div class="card-icone" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <rect
                x="9" y="7" width="46" height="50"
                rx="9" class="icone-fundo"
              />
              <path
                d="M19 20h16M19 29h11M19 38h8"
                class="icone-linha"
              />
              <circle
                cx="42" cy="39" r="10"
                class="icone-circulo"
              />
              <path
                d="m38 39 3 3 5-6"
                class="icone-linha"
              />
            </svg>
          </div>

          <h3>Questões do ENEM</h3>

          <p>
            Pratique com questões reais de Biologia,
            organizadas para facilitar seus estudos.
          </p>
        </article>

        <article class="card-conteiner">
          <div class="card-icone" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <circle
                cx="32" cy="32" r="25"
                class="icone-fundo"
              />
              <circle
                cx="32" cy="32" r="17"
                class="icone-contorno"
              />
              <circle
                cx="32" cy="32" r="8"
                class="icone-contorno"
              />
              <circle
                cx="32" cy="32" r="3"
                class="icone-preenchido"
              />
              <path
                d="m32 32 19-20M45 12h6v6"
                class="icone-linha"
              />
            </svg>
          </div>

          <h3>Estude com foco</h3>

          <p>
            Encontre questões por assunto, ano e
            dificuldade para direcionar sua preparação.
          </p>
        </article>

        <article class="card-conteiner">
          <div class="card-icone" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <rect
                x="7" y="7" width="50" height="50"
                rx="9" class="icone-fundo"
              />
              <rect
                x="16" y="37" width="7" height="12"
                rx="2" class="icone-barra"
              />
              <rect
                x="28" y="30" width="7" height="19"
                rx="2" class="icone-barra"
              />
              <rect
                x="40" y="20" width="7" height="29"
                rx="2" class="icone-preenchido"
              />
              <path
                d="m17 29 13-8 8 3 10-12"
                class="icone-linha"
              />
            </svg>
          </div>

          <h3>Acompanhe sua evolução</h3>

          <p>
            Visualize seus acertos, acompanhe seu
            desempenho e descubra onde melhorar.
          </p>
        </article>

      </div>
    </div>
  </section>
</template>

<style scoped>
.secao-cards {
  --destaque: var(--cor-primaria);
  --texto: var(--cor-primaria-texto);
  --fundo-card: var(--cor-fundo-card);
  --borda-card: var(--cor-borda);

  box-sizing: border-box;
  width: 100%;
  padding: 65px 28px 95px;
  background-color: var(--cor-fundo-pagina);
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
}

.secao-cards *,
.secao-cards *::before,
.secao-cards *::after {
  box-sizing: border-box;
}

.secao-conteudo {
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
}

.secao-cabecalho {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto 48px;
  text-align: center;
}

.secao-etiqueta {
  margin-bottom: 16px;
  color: var(--destaque);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
  text-transform: uppercase;
}

.secao-cards .secao-cabecalho .title {
  max-width: 1000px;
  margin: 0;
  color: var(--texto);

  font-family: 'Inter', Arial, sans-serif;
  font-size: clamp(36px, 4.2vw, 56px);
  font-weight: 800;
  font-style: normal;
  line-height: 1.16;
  letter-spacing: -1.5px;
  text-transform: none;
  text-align: center;
}

.secao-cards .secao-cabecalho .title span {
  display: inline;
  color: var(--destaque);

  font-family: inherit;
  font-weight: inherit;
  font-style: inherit;
  font-stretch: inherit;
  font-variation-settings: inherit;
  font-feature-settings: inherit;
  font-optical-sizing: inherit;
  font-synthesis: inherit;
}

.secao-subtitulo {
  max-width: 650px;
  margin: 20px 0 0;
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.7;
  opacity: .75;
}

.cards-flex {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.card-conteiner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  min-height: 290px;
  padding: 34px 30px 38px;
  overflow: hidden;
  border: 1px solid var(--borda-card);
  border-radius: 18px;
  background-color: var(--fundo-card);
  text-align: left;

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.card-conteiner:hover {
  transform: translateY(-5px);
  border-color: color-mix(
    in srgb,
    var(--destaque) 45%,
    var(--borda-card)
  );
  box-shadow: 0 12px 30px rgba(0, 0, 0, .1);
}

.card-conteiner::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--destaque);
  opacity: .65;
  transition: opacity .25s ease;
}

.card-conteiner:hover::after {
  opacity: 1;
}

.card-icone {
  width: 66px;
  height: 66px;
  flex-shrink: 0;
  margin-bottom: 28px;
}

.card-icone svg {
  display: block;
  width: 100%;
  height: 100%;
}

.icone-fundo {
  fill: color-mix(
    in srgb,
    var(--destaque) 10%,
    transparent
  );
  stroke: var(--destaque);
  stroke-width: 1.5;
}

.icone-linha {
  stroke: var(--destaque);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icone-circulo {
  fill: var(--fundo-card);
  stroke: var(--destaque);
  stroke-width: 2;
}

.icone-contorno {
  stroke: var(--destaque);
  stroke-width: 2;
}

.icone-preenchido {
  fill: var(--destaque);
}

.icone-barra {
  fill: color-mix(
    in srgb,
    var(--destaque) 65%,
    transparent
  );
}

.secao-cards .card-conteiner h3 {
  margin: 0 0 14px;
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -.4px;
}

.secao-cards .card-conteiner p {
  margin: 0;
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.75;
  opacity: .74;
}

@media (max-width: 1000px) {
  .secao-cards {
    padding: 55px 24px 75px;
  }

  .cards-flex {
    gap: 16px;
  }

  .card-conteiner {
    min-height: 275px;
    padding: 28px 24px 34px;
  }
}

@media (max-width: 768px) {
  .secao-cards {
    padding: 48px 20px 65px;
  }

  .secao-cabecalho {
    margin-bottom: 34px;
  }

  .secao-etiqueta {
    margin-bottom: 12px;
    font-size: 10px;
  }

  .secao-cards .secao-cabecalho .title {
    font-size: clamp(30px, 7vw, 42px);
    line-height: 1.15;
  }

  .secao-subtitulo {
    margin-top: 16px;
    font-size: 15px;
  }

  .cards-flex {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin: 0 auto;
    gap: 15px;
  }

  .card-conteiner {
    min-height: 225px;
    padding: 28px 25px 34px;
  }

  .card-icone {
    width: 58px;
    height: 58px;
    margin-bottom: 20px;
  }

  .secao-cards .card-conteiner h3 {
    font-size: 19px;
  }

  .secao-cards .card-conteiner p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .secao-cards .secao-cabecalho .title {
    font-size: clamp(28px, 8vw, 36px);
  }

  .card-conteiner {
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-conteiner,
  .card-conteiner::after {
    transition: none;
  }

  .card-conteiner:hover {
    transform: none;
  }
}
</style>
