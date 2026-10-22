<script setup>
import { ChartNoAxesCombined, Sprout } from 'lucide-vue-next'
</script>

<template>
  <section class="stats-hero" aria-labelledby="stats-page-title">
    <div class="stats-hero__content">
      <h1 id="stats-page-title">Suas estatísticas</h1>
      <p>Acompanhe seu desempenho, reconheça sua evolução e continue avançando nos estudos para o ENEM.</p>
    </div>

    <div class="stats-hero__art" aria-hidden="true">
      <div class="stats-hero__orbit stats-hero__orbit--outer"></div>
      <div class="stats-hero__orbit stats-hero__orbit--inner"></div>
      <div class="stats-hero__emblem">
       
      </div>
      <span class="stats-hero__art-label">BIOQUEST <span>•</span> BIOLOGIA</span>
    </div>
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
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  min-height: 240px;
  margin: 0;
  padding: 34px clamp(28px, 3.8vw, 58px);
  border: 1px solid rgba(111, 219, 166, .15);
  background-image:  
      url('@/assets/background.png');

  background-position:  center;
  color: #fff;
}

.stats-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .24;
  background-image: linear-gradient(90deg, transparent 97%, rgba(148, 233, 187, .25) 100%);
}
.stats-hero__content {
  position: relative;
  z-index: 1;
  min-width: 0;
  max-width: 690px;
}
.stats-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 15px;
  color: #9ee0bf;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .13em;
}
.stats-hero h1 {
  margin: 0 0 11px;
  color: #fff;
  font-size: clamp(28px, 2.5vw, 37px);
  font-weight: 750;
  line-height: 1.15;
  letter-spacing: -.038em;
}
.stats-hero p {
  max-width: 570px;
  margin: 0;
  color: #c7ded1;
  font-size: 14px;
  line-height: 1.7;
}


.stats-hero__art-label {
  position: absolute;
  left: 88%;
  bottom: 1px;
  color: #8dbfa7;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .22em;
  white-space: nowrap;
}
.stats-hero__art-label span { color: #3ec48a; }
@media (max-width: 900px) {
  .stats-hero { gap: 12px; }
  .stats-hero__art { flex-basis: 158px; width: 158px; transform: scale(.8); }
}
@media (max-width: 640px) {
  .stats-hero { min-height: 0; padding: 25px 23px; border-radius: 16px; }
  .stats-hero h1 { font-size: 28px; }
  .stats-hero p { font-size: 13px; }
  .stats-hero__art { display: none; }
}
</style>