
<script setup>
</script>

<template>
  <section
    class="container-questoes"
    aria-labelledby="titulo-banco-questoes"
  >
    <div class="questoes-conteudo">

      <div class="container-left">

        <h2 id="titulo-banco-questoes">
          Banco de questões
          <span>do ENEM</span>
        </h2>

        <p class="sub-info">
          Prepare-se de forma organizada para o
          Exame Nacional do Ensino Médio.
        </p>

        <p class="filtre">
          Filtre as questões por:
        </p>

        <div class="filtro-box">

          <span class="filtro-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              calendar_month
            </span>
            Por Ano
          </span>

          <span class="filtro-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              topic
            </span>
            Por Categoria
          </span>

          <span class="filtro-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              account_tree
            </span>
            Por Eixo temático
          </span>

          <span class="filtro-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              list_alt
            </span>
            Por Conteúdo
          </span>

          <span class="filtro-item">
            <span
              class="material-symbols-outlined"
              aria-hidden="true"
            >
              subdirectory_arrow_right
            </span>
            Por Subconteúdo
          </span>

        </div>
      </div>

      <div class="container-right">

        <p class="descricao-questoes">
          Todas as questões de Biologia do ENEM em
          um só lugar! De 2014 a 2025, com filtros
          por ano, categoria, eixo temático,
          conteúdo e subconteúdo.
          Estude com organização, pratique com
          foco e chegue preparado no dia da prova.
          Venha fazer parte!
        </p>

        <router-link
          to="/questoes"
          class="botao-questoes"
        >
          Descubra as questões

          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </router-link>

      </div>
    </div>
  </section>
</template>

<style scoped>
.container-questoes {
  font-family: 'Inter', Arial, sans-serif;
  color: #ffffff;

  background-image:
    url('@/assets/Design-fundo.png');

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  width: 100%;

  min-height: calc(
    400px + clamp(4rem, 12vw, 10rem)
  );

  box-sizing: border-box;

  margin-top: 3rem;

  padding: clamp(2rem, 6vw, 5rem);

  display: flex;
  align-items: center;
}

.questoes-conteudo {
  display: grid;

  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(0, .95fr);

  align-items: center;

  gap: clamp(48px, 6vw, 90px);

  width: 100%;
  max-width: 1160px;

  margin: 0 auto;
}

.container-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  min-width: 0;
  margin: 0;

  color: #ffffff;
}

.container-left h2 {
  font-family: 'Inter', Arial, sans-serif;

  font-size: clamp(38px, 4.2vw, 56px);
  font-weight: 800;
  font-style: normal;

  line-height: 1.16;
  letter-spacing: -1.5px;

  margin: 0;
  text-align: left;

  color: #ffffff;
}

.container-left h2 span {
  display: block;

  font: inherit;
  color: #ffffff;
}

.sub-info {
  font-family: 'Inter', Arial, sans-serif;

  max-width: 470px;

  font-size: 17px;
  font-weight: 400;
  line-height: 1.7;

  margin: 22px 0 0;

  color: #f0f5f1;
}

.filtre {
  font-family: 'Inter', Arial, sans-serif;

  font-size: 15px;
  font-weight: 700;
  letter-spacing: .2px;

  margin: 38px 0 17px;

  color: #ffffff;
}

.filtro-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 12px;

  width: 100%;
}

.filtro-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  min-height: 44px;
  padding: 10px 15px;

  box-sizing: border-box;

  background-color:
    rgba(255, 255, 255, .10);

  border: 1px solid
    rgba(255, 255, 255, .22);

  border-radius: 11px;

  color: #f5faf7;

  font-family: 'Inter', Arial, sans-serif;
  font-size: 13px;
  font-weight: 500;

  white-space: nowrap;

  transition:
    background-color .2s ease,
    border-color .2s ease,
    transform .2s ease;
}

.filtro-item:hover {
  background-color:
    rgba(255, 255, 255, .17);

  border-color:
    rgba(255, 255, 255, .38);

  transform: translateY(-2px);
}

.filtro-item .material-symbols-outlined {
  font-size: 20px;
  color: #c5f4db;

  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.container-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 32px;

  min-width: 0;
  max-width: 520px;

  margin: 0;

  color: #ffffff;
}

.descricao-questoes {
  font-family: 'Inter', Arial, sans-serif;

  font-size: clamp(17px, 1.45vw, 19px);
  font-weight: 400;

  line-height: 1.85;

  text-align: left;

  margin: 0;

  color: #f0f5f1;
  opacity: 1;
}

.botao-questoes {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 13px;

  min-height: 51px;
  padding: 0 27px;

  box-sizing: border-box;

  background-color: #119264;
  color: #ffffff;

  border: 1px solid
    rgba(255, 255, 255, .15);

  border-radius: 11px;

  font-family: 'Inter', Arial, sans-serif;
  font-size: 15px;
  font-weight: 700;

  text-decoration: none;
  cursor: pointer;

  box-shadow:
    0 6px 20px rgba(0, 0, 0, .12);

  transition:
    background-color .2s ease,
    transform .2s ease,
    box-shadow .2s ease;
}

.botao-questoes:hover {
  background-color: #0eab72;

  transform: translateY(-2px);

  box-shadow:
    0 10px 25px rgba(0, 0, 0, .18);
}

.botao-questoes svg {
  flex-shrink: 0;
  transition: transform .2s ease;
}

.botao-questoes:hover svg {
  transform: translateX(4px);
}

.botao-questoes:focus-visible {
  outline: 3px solid #b6f7d4;
  outline-offset: 4px;
}

@media (max-width: 1000px) {
  .questoes-conteudo {
    gap: 35px;
  }

  .container-left h2 {
    font-size: clamp(34px, 4.5vw, 48px);
  }

  .filtro-item {
    padding: 9px 12px;
    font-size: 12px;
  }

  .descricao-questoes {
    font-size: 16px;
    line-height: 1.8;
  }
}

@media (max-width: 768px) {
  .container-questoes {
    background-image:
      url('@/assets/responsive/mobile/Design-fundo-mobile__mobile_720x960.webp');

    background-size: cover;
    background-position: center;

    min-height: 0;

    margin-top: 2rem;

    padding: 48px 20px 55px;
  }

  .questoes-conteudo {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .container-left h2 {
    font-size: clamp(32px, 7vw, 42px);
    line-height: 1.15;
  }

  .sub-info {
    font-size: 15px;
    margin-top: 18px;
  }

  .filtre {
    margin-top: 30px;
    margin-bottom: 14px;
  }

  .filtro-box {
    gap: 9px;
  }

  .filtro-item {
    padding: 10px 12px;
    white-space: normal;
  }

  .container-right {
    max-width: 100%;
    gap: 26px;
  }

  .descricao-questoes {
    font-size: 16px;
    line-height: 1.75;
  }

  .botao-questoes {
    width: 100%;
    max-width: 340px;
  }
}

@media (max-width: 480px) {
  .container-questoes {
    background-image:
      url('@/assets/responsive/mobile_tela_cheia/Design-fundo-mobile__mobile_tela_cheia_720x1280.webp');
    padding: 40px 16px 48px;
  }

  .container-left h2 {
    font-size: clamp(30px, 8vw, 36px);
  }

  .filtro-item {
    font-size: 12px;
    border-radius: 9px;
  }

  .botao-questoes {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filtro-item,
  .botao-questoes,
  .botao-questoes svg {
    transition: none;
  }

  .filtro-item:hover,
  .botao-questoes:hover,
  .botao-questoes:hover svg {
    transform: none;
  }
}
</style>
