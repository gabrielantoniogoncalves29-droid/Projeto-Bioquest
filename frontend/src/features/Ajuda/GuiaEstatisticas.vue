<script setup>
import {
  BookOpenCheck, Target, CalendarDays, Flame, ArrowRight, ChartNoAxesCombined
} from 'lucide-vue-next'
import SecaoAjuda from './SecaoAjuda.vue'
import Colapsavel from './Colapsavel.vue'

const iconeConteudo = id => new URL(`../Questoes/icons/${id}.png`, import.meta.url).href

const indicadores = [
  {
    icone: BookOpenCheck,
    classe: 'questoes',
    titulo: 'Questões resolvidas',
    texto: 'Quantas questões você já respondeu.'
  },
  {
    icone: Target,
    classe: 'acerto',
    titulo: 'Taxa de acerto',
    texto: 'A porcentagem das suas respostas que estavam corretas.'
  },
  {
    icone: CalendarDays,
    classe: 'dias',
    titulo: 'Dias praticados',
    texto: 'Em quantos dias você estudou resolvendo questões.'
  },
  {
    icone: Flame,
    classe: 'sequencia',
    titulo: 'Sequência atual',
    texto: 'Quantos dias seguidos você manteve o estudo.'
  }
]

const faixas = [
  { classe: 'alto', faixa: '60% ou mais', texto: 'Bom desempenho', largura: 78 },
  { classe: 'medio', faixa: '30% a 59%', texto: 'Vale reforçar', largura: 45 },
  { classe: 'baixo', faixa: 'Abaixo de 30%', texto: 'Precisa de atenção', largura: 18 }
]
</script>

<template>
  <SecaoAjuda
    id="estatisticas-guia"
    nivel="sub"
    titulo="Como ler a página de"
    destaque="Estatísticas"
    subtitulo="Cada bloco da página mostra um lado da sua evolução."
  >
    <ul class="indicadores">
      <li
        v-for="item in indicadores"
        :key="item.titulo"
        class="indicador"
        :class="item.classe"
      >
        <span class="indicador-icone" aria-hidden="true">
          <component :is="item.icone" :size="22" :stroke-width="1.9" />
        </span>
        <h4>{{ item.titulo }}</h4>
        <p class="preservar-cor">{{ item.texto }}</p>
      </li>
    </ul>

    <div class="blocos">
      <Colapsavel
        titulo="Continue seus estudos"
        subtitulo="Seu desempenho em cada conteúdo de Biologia"
        :aberto="true"
      >
        <template #icone>
          <img class="mini-icone" :src="iconeConteudo(17)" alt="">
        </template>

        <p>
          É uma lista com todos os conteúdos do livro didático, cada um com o
          seu ícone. Para cada linha você vê:
        </p>
        <ul class="marcadores">
          <li><strong>Questões:</strong> quantas você resolveu naquele conteúdo.</li>
          <li><strong>Desempenho:</strong> o percentual e uma barra de progresso.</li>
          <li><strong>Continuar:</strong> leva à página de Questões para treinar mais.</li>
        </ul>
        <p>
          Quando ainda não há nada para calcular, a linha mostra “sem dados”
          e a barra fica vazia. O link “Ver questões” no topo do bloco também
          abre a biblioteca.
        </p>

        <h5 class="mini-titulo">Cores da barra de desempenho</h5>
        <ul class="faixas">
          <li v-for="item in faixas" :key="item.classe" :class="item.classe">
            <div class="faixa-trilho"><span :style="{ width: `${item.largura}%` }"></span></div>
            <div class="faixa-texto">
              <strong>{{ item.faixa }}</strong>
              <span>{{ item.texto }}</span>
            </div>
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Desempenho geral"
        subtitulo="Acertos e erros em um gráfico de rosca"
      >
        <template #icone>
          <span class="mini-icone-svg"><ChartNoAxesCombined :size="24" :stroke-width="1.8" /></span>
        </template>

        <p>
          O gráfico circular mostra o seu <strong>desempenho médio</strong>
          no centro, e a legenda ao lado informa o total de
          <strong>acertos</strong> (ponto verde) e de <strong>erros</strong>
          (ponto vermelho).
        </p>
      </Colapsavel>

      <Colapsavel
        titulo="Precisa de ajuda?"
        subtitulo="Atalho para esta central"
      >
        <p>
          O botão de informação (ícone “i”) no canto do topo da página de
          Estatísticas e o link “Central de ajuda” do cartão “Precisa de
          ajuda?” trazem você direto para esta seção.
        </p>
        <p class="atalho-txt">
          Pronto para treinar?
          <router-link to="/questoes">
            Ir para Questões <ArrowRight :size="15" aria-hidden="true" />
          </router-link>
        </p>
      </Colapsavel>
    </div>
  </SecaoAjuda>
</template>

<style scoped>
.indicadores {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
}

.indicador {
  position: relative;
  overflow: hidden;
  padding: 22px 20px 24px;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 16px;
  box-shadow: var(--sombra-card);
  transition: transform .25s ease, border-color .25s ease;
}

.indicador:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--cor-primaria) 40%, var(--cor-borda));
}

.indicador-icone {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 12px;
}

.indicador.acerto .indicador-icone { color: var(--cor-aviso); background: var(--cor-acento-amarelo-fundo); }
.indicador.dias .indicador-icone { color: var(--cor-acento-roxo); background: var(--cor-acento-roxo-fundo); }
.indicador.sequencia .indicador-icone { color: #df8628; background: rgba(223, 134, 40, .12); }

.indicador h4 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.indicador p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.blocos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mini-icone {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.mini-icone-svg {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 12px;
}

.marcadores {
  margin: 8px 0 12px;
  padding-left: 22px;
}

.marcadores li { margin-bottom: 6px; }
.marcadores li::marker { color: var(--cor-primaria); }
.marcadores strong { color: var(--ajuda-titulo, var(--cor-texto-principal)); }

.mini-titulo {
  margin: 18px 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.faixas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.faixas li {
  padding: 14px 16px;
  background: var(--cor-fundo-sutil);
  border: 1px solid var(--cor-borda-suave);
  border-radius: 12px;
}

.faixa-trilho {
  height: 7px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--cor-fundo-card);
}

.faixa-trilho span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.faixas .alto .faixa-trilho span { background: var(--cor-acerto); }
.faixas .medio .faixa-trilho span { background: var(--cor-aviso); }
.faixas .baixo .faixa-trilho span { background: var(--cor-erro); }

.faixa-texto strong {
  display: block;
  font-size: 14px;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
}

.faixa-texto span {
  font-size: 13.5px;
  color: var(--ajuda-texto-suave, var(--cor-texto-suave));
}

.atalho-txt a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
  font-weight: 700;
  color: var(--cor-primaria);
  text-decoration: none;
}

.atalho-txt a:hover { text-decoration: underline; }

@media (max-width: 1000px) {
  .indicadores { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 700px) {
  .faixas { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .indicadores { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .indicador { transition: none; }
  .indicador:hover { transform: none; }
}
</style>
