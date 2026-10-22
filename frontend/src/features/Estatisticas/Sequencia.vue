<script setup>
import { ref } from 'vue'
import { conteudos } from '../Questoes/data/filtros.js'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  Flame,
  Target,
} from 'lucide-vue-next'

const indicadores = [
  { titulo: 'Questões resolvidas', valor: '34', icone: BookOpenCheck, classe: 'questoes' },
  { titulo: 'Taxa de acerto', valor: '78%', icone: Target, classe: 'acerto' },
  { titulo: 'Dias praticados', valor: '15', icone: CalendarDays, classe: 'dias' },
  { titulo: 'Sequência atual', valor: '7 dias', icone: Flame, classe: 'sequencia' },
]

// Os ícones seguem o ID de cada conteúdo na pasta Questoes/icons.
const iconesConteudos = import.meta.glob('../Questoes/icons/[0-9]*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const dadosDemonstrativos = {
  2: { questoes: 26, progresso: 62 },
  3: { questoes: 14, progresso: 43 },
  8: { questoes: 20, progresso: 55 },
  17: { questoes: 7, progresso: 18 },
}

const atividades = conteudos.map(conteudo => ({
  id: conteudo.id,
  nome: conteudo.nome.trim(),
  icone: iconesConteudos[`../Questoes/icons/${conteudo.id}.png`],
  questoes: dadosDemonstrativos[conteudo.id]?.questoes ?? null,
  progresso: dadosDemonstrativos[conteudo.id]?.progresso ?? null,
}))

const dias = ['', '', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
const diaSelecionado = ref(null)

function selecionarDia(dia) {
  if (!dia) return
  diaSelecionado.value = diaSelecionado.value === dia ? null : dia
}

function classeProgresso(valor) {
  if (valor >= 60) return 'alto'
  if (valor >= 30) return 'medio'
  return 'baixo'
}
</script>

<template>
  <main class="stats-dashboard">
    <section class="stats-metrics" aria-label="Resumo das suas estatísticas">
      <article v-for="indicador in indicadores" :key="indicador.titulo" class="stats-metric" :class="`stats-metric--${indicador.classe}`">
        <div class="stats-metric__top">
          <span class="stats-metric__icon"><component :is="indicador.icone" :size="21" :stroke-width="1.9" aria-hidden="true" /></span>
          <span class="stats-metric__label">{{ indicador.titulo }}</span>
        </div>
        <strong class="stats-metric__number">{{ indicador.valor }}</strong>
      </article>
    </section>

    <div class="stats-content-grid">
      <div class="stats-main-column">
      <section class="stats-panel stats-subjects" aria-labelledby="stats-subjects-title">
        <header class="stats-section-heading">
          <div class="stats-section-heading__main">
            
            <div>
              <h2 id="stats-subjects-title">Continue seus estudos</h2>
              <p>Acompanhe seu progresso nos conteúdos de Biologia.</p>
            </div>
          </div>
          <router-link to="/questoes" class="stats-text-link">Ver questões <ArrowRight :size="16" aria-hidden="true" /></router-link>
        </header>

        <div class="stats-subjects__table" role="table" aria-label="Progresso dos conteúdos">
          <div class="stats-subjects__labels" role="row">
            <span role="columnheader">Conteúdo</span>
            <span role="columnheader">Questões</span>
            <span role="columnheader">Desempenho</span>
          </div>
          <div v-for="atividade in atividades" :key="atividade.nome" class="stats-subject" role="row">
            <div class="stats-subject__identity" role="cell">
              <span class="stats-subject__icon"><img v-if="atividade.icone" :src="atividade.icone" :alt="`Ícone de ${atividade.nome}`" loading="lazy" /></span>
              <div class="stats-subject__description">
                <strong>{{ atividade.nome }}</strong>
              </div>
            </div>
            <span class="stats-subject__count" role="cell">{{ atividade.questoes ?? "—" }} <span>{{ atividade.questoes === null ? "sem dados" : "questões" }}</span></span>
            <div class="stats-subject__progress" role="cell" :class="atividade.progresso === null ? 'stats-subject__progress--empty' : `stats-subject__progress--${classeProgresso(atividade.progresso)}`">
              <div class="stats-subject__progress-top"><span>{{ atividade.progresso === null ? "Sem dados" : `${atividade.progresso}%` }}</span></div>
              <div class="stats-progress-track" role="progressbar" :aria-label="`Desempenho em ${atividade.nome}`" :aria-valuenow="atividade.progresso ?? 0" aria-valuemin="0" aria-valuemax="100">
                <span :style="{ width: `${atividade.progresso ?? 0}%` }"></span>
              </div>
            </div>
            <router-link to="/questoes" class="stats-continue" :aria-label="`Continuar estudando ${atividade.nome}`" role="cell">Continuar <ArrowRight :size="15" aria-hidden="true" /></router-link>
          </div>
        </div>
      </section>

      <section class="stats-footer-card stats-footer-card--help">
        <span class="stats-footer-card__icon"><CircleHelp :size="22" :stroke-width="1.8" aria-hidden="true" /></span>
        <div><h2>Precisa de ajuda?</h2><p>Encontre orientações para aproveitar melhor o BioQuest.</p></div>
        <router-link to="/ajuda" class="stats-help-link">Central de ajuda <ArrowUpRight :size="15" aria-hidden="true" /></router-link>
      </section>
      </div>

      <div class="stats-side-column">
        <section class="stats-panel stats-performance" aria-labelledby="stats-performance-title">
          <header class="stats-section-heading">
            <div class="stats-section-heading__main">
              <span class="stats-heading-icon"><ChartNoAxesCombined :size="20" :stroke-width="1.85" aria-hidden="true" /></span>
              <div>
                <h2 id="stats-performance-title">Desempenho geral</h2>
                <p>Visão geral das suas respostas.</p>
              </div>
            </div>
          </header>
          <div class="stats-performance__main">
            <div class="stats-donut" role="img" aria-label="Desempenho geral de 78 por cento">
              <div class="stats-donut__inside">
                <strong>78%</strong>
                <span>Desempenho<br />médio</span>
              </div>
            </div>
            <div class="stats-performance__legend">
              <div class="stats-legend-item">
                <span class="stats-legend-item__dot stats-legend-item__dot--correct"></span>
                <span><strong>28</strong><small>Acertos</small></span>
              </div>
              <div class="stats-legend-item">
                <span class="stats-legend-item__dot stats-legend-item__dot--incorrect"></span>
                <span><strong>6</strong><small>Erros</small></span>
              </div>
            </div>
          </div>
        </section>

        <section class="stats-panel stats-calendar" aria-labelledby="stats-calendar-title">
          <header class="stats-section-heading stats-section-heading--calendar">
            <div class="stats-section-heading__main">
              <span class="stats-heading-icon"><CalendarDays :size="20" :stroke-width="1.85" aria-hidden="true" /></span>
              <div><h2 id="stats-calendar-title">Calendário de estudos</h2><p>Organize seus dias de prática.</p></div>
            </div>
            <span class="stats-calendar__month">Maio</span>
          </header>
          <div class="stats-calendar__weekdays" aria-hidden="true"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div>
          <div class="stats-calendar__days" role="group" aria-label="Dias de maio">
            <template v-for="(dia, indice) in dias" :key="indice">
              <span v-if="!dia" class="stats-calendar__empty" aria-hidden="true"></span>
              <button v-else type="button" class="stats-calendar__day" :class="{ 'stats-calendar__day--active': diaSelecionado === dia }" :aria-label="`Dia ${Number(dia)} de maio`" :aria-pressed="diaSelecionado === dia" @click="selecionarDia(dia)">{{ Number(dia) }}</button>
            </template>
          </div>
          <div class="stats-calendar__note"><span class="stats-calendar__note-mark"></span>{{ diaSelecionado ? `Dia ${Number(diaSelecionado)} selecionado` : 'Selecione um dia no calendário' }}</div>
        </section>
      </div>
    </div>
    <br>
  </main>
</template>

<style scoped>
.stats-dashboard {
  padding: 3px 30px 3px 30px ;
  --stats-card-bg: var(--cor-fundo-card);
  --stats-border: var(--cor-borda-suave);
  --stats-muted: var(--cor-texto-suave);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  color: var(--cor-texto-principal);
  font-family: inherit;
}
.stats-dashboard *, .stats-dashboard *::before, .stats-dashboard *::after { box-sizing: border-box; }
.stats-dashboard h2, .stats-dashboard p { margin: 0; }
.stats-dashboard a { text-decoration: none; }
.stats-dashboard button { font-family: inherit; }
.stats-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.stats-metric {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  min-height: 155px;
  padding: 22px 24px 19px;
  background: var(--stats-card-bg);
  border: 1px solid var(--stats-border);
  border-radius: 15px;
  box-shadow: 0 3px 14px rgba(8, 27, 16, .025);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.stats-metric:hover { border-color: var(--cor-primaria-translucida-fraca); box-shadow: var(--sombra-card); }
.stats-metric__top { display: flex; align-items: center; gap: 12px; width: 100%; }
.stats-metric__icon { display: grid; place-items: center; width: 42px; height: 42px; flex: none; border-radius: 12px; color: var(--cor-primaria); background: var(--cor-primaria-fundo); }
.stats-metric--acerto .stats-metric__icon { color: var(--cor-aviso); background: var(--cor-acento-amarelo-fundo); }
.stats-metric--dias .stats-metric__icon { color: var(--cor-acento-roxo); background: var(--cor-acento-roxo-fundo); }
.stats-metric--sequencia .stats-metric__icon { color: #df8628; background: rgba(223, 134, 40, .10); }
.stats-metric__label { min-width: 0; font-size: 13px; font-weight: 650; line-height: 1.35; color: var(--cor-texto-secundario); }
.stats-metric__number { display: block; font-variant-numeric: tabular-nums; margin: 15px 0 4px; font-size: clamp(27px, 2.3vw, 34px); font-weight: 750; line-height: 1.1;margin:auto; letter-spacing: -.04em; color: var(--cor-texto-principal); }
.stats-metric__foot { display: flex; align-items: center; gap: 4px; color: var(--stats-muted); font-size: 12px;margin:auto; font-weight: 550; }
.stats-metric__foot--trend { color: var(--cor-acerto); }
.stats-content-grid { display: grid; grid-template-columns: minmax(0, 1.62fr) minmax(min(100%, 315px), 1fr); align-items: stretch; gap: 20px; }
/* A coluna direita define a altura total; a esquerda não pode aumentá-la. */
.stats-main-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  min-height: 0;
  contain: size;
}
.stats-subjects { flex: 1 1 0%; }
.stats-footer-card--help { flex: 0 0 auto; }
.stats-panel { min-width: 0; background: var(--stats-card-bg); border: 1px solid var(--stats-border); border-radius: 16px; box-shadow: 0 3px 14px rgba(8, 27, 16, .025); }
.stats-section-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 26px 28px 22px; }
.stats-section-heading__main { display: flex; min-width: 0; align-items: flex-start; gap: 13px; }
.stats-heading-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 10px; color: var(--cor-primaria); background: none; }
.stats-section-heading h2 { color: var(--cor-texto-principal); font-size: 17px; font-weight: 720; line-height: 1.4; letter-spacing: -.018em; }
.stats-section-heading p { color: var(--stats-muted); font-size: 12.5px; line-height: 1.65; margin-top: 3px; }
.stats-text-link { display: inline-flex; align-items: center; gap: 7px; color: var(--cor-primaria); font-size: 12.5px; font-weight: 650; text-decoration: none; white-space: nowrap; }
.stats-text-link:hover { text-decoration: underline; }
/* O cartão mantém sua altura enquanto os 18 conteúdos rolam internamente. */
.stats-subjects {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.stats-subjects__table {
  flex: 1 1 0%;
  min-height: 0;
  padding: 0 19px 2px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--cor-borda-suave) transparent;
}
.stats-subjects__labels {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--stats-card-bg);
}
.stats-subject__icon img {
  width: 50px;
  height: 50px;
  margin-right: 6px;
  object-fit: contain;
}
.stats-subject__progress--empty {
  color: var(--stats-muted);
}
.stats-subjects__labels, .stats-subject { display: grid; grid-template-columns: minmax(190px, 1.55fr) minmax(70px, .55fr) minmax(115px, 1fr) 112px; align-items: center; gap: 16px; }
.stats-subjects__labels { min-height: 36px; padding: 0 18px; color: var(--stats-muted); font-size: 11px; font-weight: 650; border-bottom: 1px solid var(--stats-border); }
.stats-subjects__action-label { text-align: center; }
.stats-subject { min-height: 93px; padding: 14px 18px; border-bottom: 1px solid var(--stats-border); transition: background-color .18s ease; }
.stats-subject:last-child { border-bottom: 0; }
.stats-subject:hover { background: var(--cor-fundo-sutil-translucida); border-radius: 8px; }
.stats-subject__identity { display: flex; align-items: center; min-width: 0; gap: 12px; }
.stats-subject__icon { flex: none; display: grid; place-items: center; width: 43px; height: 43px; border-radius: 12px; color: var(--cor-primaria); background: var(--cor-primaria-fundo); }
.stats-subject__description { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.stats-subject__description strong, .stats-subject__description span { overflow-wrap: anywhere; }
.stats-subject__description strong { font-size: 13.5px; line-height: 1.35; font-weight: 700; }
.stats-subject__description span { color: var(--stats-muted); font-size: 11.5px; line-height: 1.45; }
.stats-subject__count { font-size: 13px; font-weight: 700; color: var(--cor-texto-principal); white-space: nowrap; }
.stats-subject__count span { font-weight: 450; color: var(--stats-muted); font-size: 11px; }
.stats-subject__progress { min-width: 0; color: var(--cor-acerto); }
.stats-subject__progress--medio { color: var(--cor-aviso); }
.stats-subject__progress--baixo { color: var(--cor-erro); }
.stats-subject__progress-top { display: flex; justify-content: flex-end; margin-bottom: 8px; font-size: 12px; font-weight: 750; }
.stats-progress-track { height: 7px; overflow: hidden; border-radius: 99px; background: var(--cor-fundo-sutil); }
.stats-progress-track > span { display: block; height: 100%; border-radius: inherit; background: var(--cor-acerto); }
.stats-subject__progress--medio .stats-progress-track > span { background: var(--cor-aviso); }
.stats-subject__progress--baixo .stats-progress-track > span { background: var(--cor-erro); }
.stats-continue { display: inline-flex; justify-content: center; align-items: center; gap: 7px; padding: 10px 8px; border: 1px solid var(--cor-primaria-translucida-fraca); border-radius: 8px; background: var(--cor-primaria-fundo); color: var(--cor-primaria); font-size: 12px; font-weight: 680; text-decoration: none; transition: background-color .2s ease, border-color .2s ease; }
.stats-continue:hover { background: var(--cor-primaria); color: #fff; border-color: var(--cor-primaria); }
.stats-subjects__bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin: 8px 19px 20px; padding: 15px 18px; border-radius: 10px; background: var(--cor-fundo-sutil); }
.stats-subjects__bottom > span { display: flex; align-items: center; gap: 9px; color: var(--cor-texto-secundario); font-size: 12px; }
.stats-subjects__bottom > span :deep(svg) { color: var(--cor-primaria); flex: none; }
.stats-subjects__bottom > a { display: inline-flex; align-items: center; gap: 3px; color: var(--cor-primaria); font-size: 12px; font-weight: 700; text-decoration: none; }
.stats-subjects__bottom > a:hover { text-decoration: underline; }
.stats-side-column { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 20px; min-width: 0; }
.stats-performance__main { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(18px, 3vw, 46px); padding: 0 28px 28px; }
.stats-donut { position: relative; flex: none; display: grid; place-items: center; width: 177px; height: 177px; border-radius: 50%; background: conic-gradient(var(--cor-acerto) 0 78%, var(--cor-borda) 78% 100%); }
.stats-donut::before { position: absolute; inset: -1px; border-radius: 50%; content: ''; background: conic-gradient(transparent 0 77.5%, var(--stats-card-bg) 77.5% 79%, transparent 79% 99.5%, var(--stats-card-bg) 99.5% 100%); }
.stats-donut__inside { position: relative; z-index: 1; width: 139px; height: 139px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; background: var(--stats-card-bg); text-align: center; }
.stats-donut__inside strong { font-size: 30px; font-weight: 750; letter-spacing: -.04em; line-height: 1.2; }
.stats-donut__inside span { font-size: 11.5px; line-height: 1.5; color: var(--stats-muted); margin-top: 4px; }
.stats-performance__legend { display: flex; flex-direction: column; gap: 18px; }
.stats-legend-item { display: flex; align-items: flex-start; gap: 10px; }
.stats-legend-item__dot { display: block; width: 9px; height: 9px; flex: none; margin-top: 8px; border-radius: 50%; }
.stats-legend-item__dot--correct { background: var(--cor-acerto); }
.stats-legend-item__dot--incorrect { background: var(--cor-erro); }
.stats-legend-item strong { font-size: 19px; line-height: 1.2; font-weight: 750; }
.stats-legend-item small { display: block; margin-top: 3px; color: var(--stats-muted); font-size: 11.5px; }
.stats-section-heading--calendar { padding-bottom: 15px; }
.stats-calendar__month { flex: none; padding: 6px 10px; background: var(--cor-fundo-sutil); border-radius: 6px; color: var(--cor-texto-secundario); font-size: 12px; font-weight: 600; }
.stats-calendar__weekdays, .stats-calendar__days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; margin: 0 28px; }
.stats-calendar__weekdays { margin-bottom: 7px; }
.stats-calendar__weekdays span { color: var(--stats-muted); text-align: center; font-size: 11px; font-weight: 650; }
.stats-calendar__day, .stats-calendar__empty { display: grid; place-items: center; width: 100%; max-width: 38px; aspect-ratio: 1; height: auto; margin-inline: auto; padding: 0; }
.stats-calendar__day { border: 1px solid transparent; border-radius: 10px; color: var(--cor-texto-secundario); background: transparent; font-family: inherit; font-size: 12px; font-weight: 550; cursor: pointer; transition: background-color .16s ease, color .16s ease; }
.stats-calendar__day:hover { color: var(--cor-primaria); background: var(--cor-primaria-fundo); }
.stats-calendar__day--active { color: #fff !important; background: var(--cor-primaria) !important; }
.stats-calendar__day:focus-visible, .stats-continue:focus-visible, .stats-help-link:focus-visible, .stats-text-link:focus-visible { outline: 2px solid var(--cor-primaria); outline-offset: 3px; }
.stats-calendar__note { display: flex; align-items: center; gap: 8px; margin: 16px 28px 23px; padding-top: 14px; border-top: 1px solid var(--stats-border); color: var(--stats-muted); font-size: 11.5px; }
.stats-calendar__note-mark { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--cor-primaria); }
.stats-bottom-grid { display: grid; gap: 20px; margin-top: 0px; }
.stats-footer-card { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; min-width: 0; padding: 22px 25px; background: var(--stats-card-bg); border: 1px solid var(--stats-border); border-radius: 15px; }
.stats-footer-card--motivation { background: var(--cor-primaria-fundo); border-color: var(--cor-primaria-translucida-fraca); }
.stats-footer-card__icon { flex: none; display: grid; place-items: center; width: 43px; height: 43px; border-radius: 13px; background: var(--cor-primaria-fundo); color: var(--cor-primaria); }
.stats-footer-card--motivation .stats-footer-card__icon { background: var(--cor-fundo-card); }
.stats-footer-card > div { flex: 1 1 200px; min-width: 0; }
.stats-footer-card h2 { font-size: 14px; font-weight: 700; margin: 0 0 4px; }
.stats-footer-card p { color: var(--stats-muted); font-size: 12px; line-height: 1.55; }
.stats-help-link { margin-left: auto; display: inline-flex; align-items: center; gap: 4px; color: var(--cor-primaria); font-size: 12px; font-weight: 700; white-space: nowrap; text-decoration: none; }
.stats-help-link:hover { text-decoration: underline; }
@media (max-width: 1250px) {
  .stats-subjects__labels, .stats-subject { grid-template-columns: minmax(145px, 1.3fr) 70px minmax(90px, 1fr) 95px; gap: 9px; }
  .stats-subjects__labels { padding-inline: 9px; }
  .stats-subject { padding-inline: 9px; }
  .stats-performance__main { gap: 22px; }
  .stats-donut { width: 157px; height: 157px; }
  .stats-donut__inside { width: 122px; height: 122px; }
}
@media (max-width: 1050px) {
  .stats-content-grid { grid-template-columns: minmax(0, 1fr); }
  .stats-main-column { contain: none; }
  .stats-subjects { flex: none; }
  .stats-subjects__table { flex: none; max-height: 430px; }
  .stats-side-column { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto; }
  .stats-subjects__labels, .stats-subject { grid-template-columns: minmax(160px, 1.5fr) minmax(85px, .6fr) minmax(105px, 1fr) 110px; gap: 16px; }
  .stats-metric { padding: 20px; }
}
@media (max-width: 760px) {
  .stats-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .stats-side-column, .stats-bottom-grid { grid-template-columns: minmax(0, 1fr); }
  .stats-performance__main { padding-inline: 20px; }
  .stats-subjects__table { padding-inline: 14px; }
  .stats-subjects__labels, .stats-subject { grid-template-columns: minmax(150px, 1.5fr) minmax(75px, .6fr) minmax(80px, 1fr) 100px; gap: 10px; }
  .stats-section-heading { padding: 22px 20px; }
}
@media (max-width: 580px) {
  .stats-metrics { gap: 10px; margin-bottom: 14px; }
  .stats-metric { min-height: 135px; padding: 16px; border-radius: 12px; }
  .stats-metric__top { align-items: flex-start; gap: 9px; }
  .stats-metric__icon { width: 35px; height: 35px; border-radius: 10px; }
  .stats-metric__label { font-size: 11.5px; }
  .stats-metric__number { font-size: 28px; margin-top: 13px; }
  .stats-metric__foot { font-size: 10.5px; }
  .stats-content-grid, .stats-side-column, .stats-main-column { gap: 14px; }
  .stats-panel { border-radius: 13px; }
  .stats-section-heading { padding: 20px 17px 17px; }
  .stats-section-heading h2 { font-size: 15px; }
  .stats-section-heading p { font-size: 11.5px; }
  .stats-heading-icon { width: 32px; height: 32px; }
  .stats-text-link { font-size: 11px; }
  .stats-subjects__labels { display: none; }
  .stats-subjects__table { padding: 0 12px; }
  .stats-subject { grid-template-columns: minmax(0, 1fr) 96px; grid-template-areas: 'identity count' 'progress action'; row-gap: 11px; column-gap: 12px; padding: 15px 7px; min-height: 0; }
  .stats-subject__identity { grid-area: identity; }
  .stats-subject__icon { width: 37px; height: 37px; }
  .stats-subject__description strong { font-size: 12px; }
  .stats-subject__description span { font-size: 10.5px; }
  .stats-subject__count { grid-area: count; text-align: right; font-size: 12px; }
  .stats-subject__count span { display: block; }
  .stats-subject__progress { grid-area: progress; align-self: center; }
  .stats-continue { grid-area: action; font-size: 10.5px; padding: 9px 5px; }
  .stats-subjects__bottom { margin: 10px 12px 15px; padding: 13px; }
  .stats-subjects__bottom > span, .stats-subjects__bottom > a { font-size: 11px; }
  .stats-calendar__weekdays, .stats-calendar__days { margin-inline: 19px; }
  .stats-calendar__note { margin-inline: 19px; }
  .stats-footer-card { gap: 12px; padding: 18px; }
  .stats-help-link { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .stats-dashboard *, .stats-dashboard *::before, .stats-dashboard *::after { transition: none !important; }
}
</style>