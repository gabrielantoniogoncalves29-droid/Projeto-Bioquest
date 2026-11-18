
<script setup>
import { Info } from 'lucide-vue-next'
import { useTemaStore } from '@/store/tema.js'

const tema = useTemaStore()
</script>

<template>
  <section
    class="stats-hero"
    :class="{ 'stats-hero--escuro': tema.tema === 'escuro' }"
    aria-labelledby="stats-page-title"
  >
    <div class="stats-hero__content">
      <h1 id="stats-page-title">
        Suas estatísticas
      </h1>

      <p class="stats-hero__descricao">
        Acompanhe seu desempenho, reconheça sua evolução
        e continue avançando nos estudos para o ENEM.
      </p>
    </div>

    <router-link
      to="/ajuda#estatisticas"
      class="stats-hero__info"
      title="Central de ajuda"
      aria-label="Acessar a central de ajuda"
    >
      <Info
        :size="21"
        :stroke-width="2"
        aria-hidden="true"
      />
    </router-link>
  </section>
</template>

<style scoped>
.stats-hero {
  position: relative;
  isolation: isolate;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  box-sizing: border-box;
  width: 100%;
  min-height: 250px;
  margin: 0;

  padding: 34px clamp(28px, 3.8vw, 58px);

  overflow: hidden;

  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;

  --hero-titulo: #123f2d;
  --hero-descricao: #426354;
  --hero-info: #14543a;
  --hero-info-hover: #08734b;

  color: var(--hero-titulo);

  background-color: #eef7f0;
  background-image:
    url('@/assets/banner_estatisticas_modo_claro_1672x286.png');

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  border: 1px solid rgba(34, 112, 72, 0.10);
}

.stats-hero.stats-hero--escuro {
  --hero-titulo: #ffffff;
  --hero-descricao: #e5f0e9;
  --hero-info: #ffffff;
  --hero-info-hover: #b0f0cd;

  color: var(--hero-titulo);

  background-color: #062c1e;
  background-image: url('@/assets/Background.png');

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  border-color: rgba(111, 219, 166, 0.15);
}

.stats-hero__content {
  position: relative;
  z-index: 1;

  min-width: 0;
  max-width: 690px;
}

.stats-hero h1 {
  margin: 0 0 13px;

  color: var(--hero-titulo);

  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: clamp(28px, 2.4vw, 36px);
  font-weight: 750;

  line-height: 1.18;
  letter-spacing: -0.035em;
}

.stats-hero .stats-hero__descricao {
  max-width: 590px;
  margin: 0;

  color: var(--hero-descricao);

  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 14.5px;
  font-weight: 400;

  line-height: 1.75;
  letter-spacing: -0.005em;
}

.stats-hero--escuro .stats-hero__descricao {
  color: #ffffff !important;
}

.stats-hero__info {
  position: absolute;
  right: 25px;
  bottom: 18px;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;
  flex-shrink: 0;

  padding: 0;
  border: none;
  border-radius: 50%;

  background: transparent;
  color: white;

  text-decoration: none;
  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.stats-hero__info :deep(svg) {
  color: inherit;
  stroke: currentColor;
}

.stats-hero__info:hover {
  background: transparent;
  color: aliceblue;
  transform: scale(1.1);
}

.stats-hero--escuro .stats-hero__info {
  color: #ffffff;
}

.stats-hero--escuro .stats-hero__info:hover {
  color: #98bea9;
}

.stats-hero__info:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .stats-hero {
    min-height: 235px;
    padding: 32px 35px;
  }

  .stats-hero__content {
    max-width: 600px;
  }

  .stats-hero h1 {
    font-size: clamp(28px, 3.5vw, 34px);
  }

  .stats-hero .stats-hero__descricao {
    font-size: 14px;
    max-width: 520px;
  }
}

@media (max-width: 768px) {
  .stats-hero {
    background-image:
      linear-gradient(
        to bottom,
        rgba(226, 246, 230, 0.92) 0%,
        rgba(226, 246, 230, 0.62) 52%,
        rgba(226, 246, 230, 0) 100%
      ),
      url('@/assets/responsive/mobile/banner_estatisticas_modo_claro_1672x286__mobile_topo_720x320.webp');

    background-position: center, 80% bottom;
    background-size: 100% 100%, cover;
  }

  .stats-hero.stats-hero--escuro {
    background-image:
      linear-gradient(
        to bottom,
        rgba(4, 38, 26, 0.9) 0%,
        rgba(4, 38, 26, 0.55) 52%,
        rgba(4, 38, 26, 0) 100%
      ),
      url('@/assets/responsive/mobile/Background__mobile_topo_720x320.webp');

    background-position: center, 80% bottom;
    background-size: 100% 100%, cover;
  }

  .stats-hero {
    min-height: 0;
    padding: 28px 24px 76px;
    align-items: flex-start;
  }

  .stats-hero__info {
    right: 12px;
    bottom: 12px;

    width: 44px;
    height: 44px;

    color: var(--hero-info);
    background: rgba(255, 255, 255, 0.82);
  }

  .stats-hero--escuro .stats-hero__info {
    background: rgba(4, 38, 26, 0.6);
  }

  .stats-hero__info:hover,
  .stats-hero--escuro .stats-hero__info:hover {
    color: var(--hero-info-hover);
    background: rgba(255, 255, 255, 0.95);
  }

  .stats-hero--escuro .stats-hero__info:hover {
    background: rgba(4, 38, 26, 0.8);
  }
}

@media (max-width: 640px) {
  .stats-hero {
    padding: 24px 16px 72px;
    border-radius: 16px;
  }

  .stats-hero h1 {
    margin-bottom: 8px;

    font-size: clamp(26px, 7.4vw, 30px);
    line-height: 1.2;
    text-wrap: balance;
  }

  .stats-hero .stats-hero__descricao {
    max-width: 34em;

    font-size: 14px;
    line-height: 1.6;
    text-wrap: pretty;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stats-hero__info {
    transition: none;
  }
}
</style>
