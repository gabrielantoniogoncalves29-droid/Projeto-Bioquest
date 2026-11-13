
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function resolverQuestoes() {
  router.push('/questoes')
}

function criarConta() {
  router.push('/login')
}
</script>

<template>
  <section class="banner">
    <div class="banner_description">

      <div class="banner_decoracao" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <h1>
        Estude Biologia
        <span>resolvendo questões</span>
      </h1>

      <p class="banner_subtitulo">
        Pratique com questões organizadas, acompanhe seu
        desempenho, tire dúvidas no fórum e evolua nos
        principais temas de Biologia. Crie sua conta gratuita
          para salvar questões, marcá-las para revisão e acompanhar
          seu progresso.
        </p>

      <div class="banner_botoes">

        <button
          type="button"
          class="botao_resolver"
          @click="resolverQuestoes"
        >

          Resolver questões
        </button>

        <button
          type="button"
          class="botao_criar"
          @click="criarConta"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M16 11h6" />
          </svg>

          Criar conta
        </button>

      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  font-family: 'Inter', Arial, sans-serif;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 500px;
  box-sizing: border-box;
  padding: 0 32px;

  --banner-topo: #f8faf982;
  --banner-base: #f8faf9;
  --banner-mascara: transparent;

  --conteudo-deslocamento-x: -35px;
  --conteudo-deslocamento-y: 5px;

  background-image:
    linear-gradient(
      to bottom,
      var(--banner-topo) 0%,
      transparent 5%
    ),
    linear-gradient(
      to bottom,
      transparent 90%,
      var(--banner-base) 100%
    ),
    linear-gradient(
      var(--banner-mascara),
      var(--banner-mascara)
    ),
    url('@/assets/Banner_top.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;
}

[data-tema="escuro"] .banner {
  isolation: isolate;
  background-image: none;
  background-color: var(--cor-fundo-pagina);
}

[data-tema="escuro"] .banner::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;

  background:
    url('@/assets/Banner_top_escuro.png')
    center / cover no-repeat;
}

[data-tema="escuro"] .banner::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;

  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, .35) 0%,
      rgba(0, 0, 0, 0) 14%
    ),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 70%,
      var(--cor-fundo-pagina) 100%
    ),
    radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, .62) 0%,
      rgba(0, 0, 0, .5) 55%,
      rgba(0, 0, 0, .38) 100%
    );
}

 .banner_decoracao {
  position: absolute;

  display: block;
  top: -35px;
  left: calc(50% + 215px);

  width: 65px;
  height: 55px;

  pointer-events: none;
}

.banner_description {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(100%, 900px);
  max-width: 900px;

  gap: 0;
  margin: 0 auto;

  position: relative;
  z-index: 1;

  transform: translate(
    var(--conteudo-deslocamento-x),
    var(--conteudo-deslocamento-y)
  );
}

.banner_description h1 {
  font-family: 'Inter', Arial, sans-serif;
  font-size: clamp(36px, 4.2vw, 56px);
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: -1.5px;

  text-align: center;
  max-width: 740px;
  margin: 0 0 24px;

  color: var(--cor-primaria-texto);
}

.banner_description h1 span {
  display: block;
  margin-top: 4px;
  color: var(--cor-primaria);
}

.banner_subtitulo {
  font-family: 'Inter', Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.7;

  max-width: 730px;
  margin: 0 0 20px;

  text-align: center;
  color: var(--cor-primaria-texto);
  opacity: .95;
}

[data-tema="escuro"] .banner_description h1,
[data-tema="escuro"] .banner_subtitulo {
  text-shadow: 0 2px 18px rgba(0, 0, 0, .55);
}

.banner_botoes {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 58px;
  width: 100%;
}

.banner_botoes button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  min-height: 50px;
  padding: 0 27px;

  font-family: 'Inter', Arial, sans-serif;
  font-size: 15px;
  font-weight: 700;

  border-radius: 11px;
  cursor: pointer;

  transition:
    background-color .2s ease,
    border-color .2s ease,
    transform .2s ease,
    box-shadow .2s ease;
}

.banner_botoes button:hover {
  transform: translateY(-2px);
}

.banner_botoes button:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: 4px;
}

.botao_resolver {
  background-color: rgba(120, 120, 120, .08);
  color: var(--cor-primaria);
  border: 2px solid var(--cor-primaria);
}

.botao_resolver:hover {
  background-color: rgba(120, 120, 120, .18);
}

.botao_criar {
  background-color: rgba(120, 120, 120, .08);
  color: var(--cor-primaria-texto);
  border: 1.5px solid currentColor;
}

.botao_criar:hover {
  background-color: rgba(120, 120, 120, .18);
}



.banner_decoracao span {
  position: absolute;
  display: block;

  width: 4px;
  height: 24px;

  background-color: #a4f65a;
  border-radius: 10px;

  box-shadow: 0 0 10px rgba(164, 246, 90, .15);
}

.banner_decoracao span:nth-child(1) {
  top: 0;
  left: 8px;
  transform: rotate(18deg);
}

.banner_decoracao span:nth-child(2) {
  top: 10px;
  left: 32px;
  transform: rotate(45deg);
}

.banner_decoracao span:nth-child(3) {
  top: 34px;
  left: 46px;
  height: 18px;
  transform: rotate(75deg);
}

@media (max-width: 900px) {
  .banner {
    height: auto;
    min-height: 440px;
    padding: 56px 24px;

    --conteudo-deslocamento-x: 0px;
    --conteudo-deslocamento-y: 0px;

    background-image:
      linear-gradient(
        to bottom,
        var(--banner-topo) 0%,
        transparent 5%
      ),
      linear-gradient(
        to bottom,
        transparent 90%,
        var(--banner-base) 100%
      ),
      linear-gradient(
        var(--banner-mascara),
        var(--banner-mascara)
      ),
      url('@/assets/responsive/tablet_horizontal/Banner_top__tablet_horizontal_1280x800.webp');

    background-size: cover;
    background-position: center;
  }

  [data-tema="escuro"] .banner::before {
    background:
      url('@/assets/responsive/tablet_horizontal/Banner_top_escuro__tablet_horizontal_1280x800.webp')
      center / cover no-repeat;
  }

  .banner_description {
    width: 100%;
    max-width: 640px;
    transform: none;
  }

  .banner_description h1 {
    font-size: clamp(32px, 5vw, 40px);
    letter-spacing: -0.03em;
    margin-bottom: 20px;
    text-wrap: balance;
  }

  .banner_subtitulo {
    font-size: 16px;
    line-height: 1.65;
    max-width: 560px;
    margin-bottom: 24px;
    text-wrap: pretty;
  }

  .banner_botoes {
    gap: 16px;
    margin-top: 0;
  }

  .banner_botoes button {
    font-size: 15px;
    min-height: 48px;
    padding: 0 24px;
  }

  .banner_decoracao {
    top: -28px;
    left: auto;
    right: 3%;
    transform: scale(.75);
  }
}

@media (max-width: 540px) {
  .banner {
    min-height: 0;
    padding: 44px 16px 48px;

    background-image:
      linear-gradient(
        to bottom,
        var(--banner-topo) 0%,
        transparent 5%
      ),
      linear-gradient(
        to bottom,
        transparent 90%,
        var(--banner-base) 100%
      ),
      linear-gradient(
        var(--banner-mascara),
        var(--banner-mascara)
      ),
      linear-gradient(
        rgba(248, 250, 249, 0.34),
        rgba(248, 250, 249, 0.34)
      ),
      url('@/assets/responsive/mobile/Banner_top__mobile_720x960.webp');

    background-position: center top;
  }

  [data-tema="escuro"] .banner::before {
    background:
      url('@/assets/responsive/mobile/Banner_top_escuro__mobile_720x960.webp')
      center top / cover no-repeat;
  }

  .banner_description h1 {
    font-size: clamp(26px, 7.8vw, 36px);
    line-height: 1.18;
    margin-bottom: 16px;
  }

  .banner_subtitulo {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .banner_botoes {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    width: 100%;
    max-width: 360px;
  }

  .banner_botoes button {
    width: 100%;
    min-height: 48px;
  }

  .banner_decoracao {
    right: 0;
    top: -35px;
    transform: scale(.6);
  }
}

@media (min-width: 430px) and (max-width: 540px) {
  .banner {
    padding-inline: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .banner_botoes button {
    transition: none;
  }

  .banner_botoes button:hover {
    transform: none;
  }
}
</style>