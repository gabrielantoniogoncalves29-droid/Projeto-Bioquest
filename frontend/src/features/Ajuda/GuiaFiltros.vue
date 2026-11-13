<script setup>
import { Search, SlidersHorizontal, MousePointerClick, ArrowUpDown, LayoutGrid } from 'lucide-vue-next'
import SecaoAjuda from './SecaoAjuda.vue'
import Colapsavel from './Colapsavel.vue'
import { anos, niveis, eixos, conteudos, estado } from '@/features/Questoes/data/filtros.js'

const iconeEixo = id => new URL(`../Questoes/icons/objeto${id}.png`, import.meta.url).href
const iconeConteudo = id => new URL(`../Questoes/icons/${id}.png`, import.meta.url).href

const passos = [
  {
    icone: Search,
    titulo: 'Pesquise (opcional)',
    texto:
      'Digite na barra de pesquisa um assunto, conteúdo, palavra-chave ou o código de uma questão. Sugestões aparecem enquanto você digita.'
  },
  {
    icone: SlidersHorizontal,
    titulo: 'Escolha os filtros',
    texto:
      'Abra cada filtro no painel e marque quantas opções quiser. “Todos” seleciona tudo de uma só vez.'
  },
  {
    icone: MousePointerClick,
    titulo: 'Clique em “Buscar Questões”',
    texto:
      'É esse botão verde, abaixo do painel, que aplica a pesquisa e os filtros e carrega a lista.'
  },
  {
    icone: ArrowUpDown,
    titulo: 'Ordene e visualize',
    texto:
      'Veja o total encontrado, ordene por ano ou dificuldade e alterne entre lista e grade.'
  }
]

function irPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const ordenacoes = [
  'Mais recentes',
  'Mais antigas',
  'Maior nível de dificuldade',
  'Menor nível de dificuldade'
]
</script>

<template>
  <SecaoAjuda
    id="filtros"
    nivel="sub"
    titulo="Como usar os"
    destaque="filtros"
    subtitulo="Encontre exatamente o tipo de questão que você quer treinar na página Questões."
  >
    <ol class="passos">
      <li v-for="(passo, indice) in passos" :key="passo.titulo" class="passo">
        <div class="passo-topo">
          <span class="passo-icone" aria-hidden="true">
            <component :is="passo.icone" :size="26" :stroke-width="1.9" />
          </span>
          <span class="passo-numero">{{ String(indice + 1).padStart(2, '0') }}</span>
        </div>
        <h3>{{ passo.titulo }}</h3>
        <p class="preservar-cor">{{ passo.texto }}</p>
      </li>
    </ol>

    <h3 class="subtitulo-bloco">Conheça cada filtro</h3>

    <div class="lista-filtros">
      <Colapsavel
        titulo="Eixo Temático"
        subtitulo="O grande tema da questão, com 6 opções"
      >
        <p>
          Agrupa os conteúdos em seis grandes temas. Cada eixo tem seu ícone
          (o mesmo que aparece no painel “Objeto de conhecimento” da questão):
        </p>
        <ul class="chips com-icone">
          <li v-for="eixo in eixos" :key="eixo.id">
            <img :src="iconeEixo(eixo.id)" alt="" loading="lazy">
            {{ eixo.nome }}
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Conteúdo"
        subtitulo="O conteúdo do livro didático, com 18 opções"
      >
        <p>
          São os capítulos de Biologia do livro didático. Cada um tem um ícone
          próprio, que também aparece nos cartões das questões:
        </p>
        <ul class="chips com-icone">
          <li v-for="conteudo in conteudos" :key="conteudo.id">
            <img :src="iconeConteudo(conteudo.id)" alt="" loading="lazy">
            {{ conteudo.nome.trim() }}
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Subconteúdos"
        subtitulo="Um recorte mais fino dentro do conteúdo"
      >
        <p>
          Este filtro só é liberado depois que você marca pelo menos um
          conteúdo (antes disso, aparece “Selecione um conteúdo primeiro”).
          Os subconteúdos surgem agrupados pelo nome do conteúdo. Se você
          desmarcar o conteúdo, os subconteúdos dele saem da seleção.
        </p>
        <p class="exemplo">
          <img :src="iconeConteudo(15)" alt="" loading="lazy">
          <span>
            <strong>Exemplo:</strong> ao marcar <em>Genética</em>, você pode
            escolher entre “Genética molecular”, “Genética clássica” e
            “Genética e biotecnologia”.
          </span>
        </p>
        <p>
          A lista completa de subconteúdos está na seção
          <a href="#conteudos" @click.prevent="irPara('conteudos')">
            “Como as questões são organizadas”
          </a>.
        </p>
      </Colapsavel>

      <Colapsavel
        titulo="Ano da prova"
        subtitulo="De 2014 a 2025"
      >
        <p>Escolha de qual edição do ENEM você quer questões:</p>
        <ul class="chips">
          <li v-for="ano in anos" :key="ano.id">{{ ano.nome }}</li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Categoria"
        subtitulo="O tipo de habilidade exigida pela questão"
      >
        <p>As questões são classificadas em três categorias:</p>
        <ul class="chips">
          <li v-for="nivel in niveis" :key="nivel.id">{{ nivel.nome }}</li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Estado"
        subtitulo="Filtra pelo seu histórico de estudo"
      >
        <p>
          Use o estado para focar no que importa para você agora. Ele depende
          da sua conta, por isso é preciso estar logado:
        </p>
        <ul class="chips">
          <li v-for="item in estado" :key="item.id">{{ item.nome }}</li>
        </ul>
      </Colapsavel>
    </div>

    <div class="faixa-extra">
      <div class="faixa-card">
        <ArrowUpDown :size="22" aria-hidden="true" />
        <div>
          <h4>Ordenar por</h4>
          <ul class="chips pequeno">
            <li v-for="item in ordenacoes" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="faixa-card">
        <LayoutGrid :size="22" aria-hidden="true" />
        <div>
          <h4>Lista ou grade</h4>
          <p class="preservar-cor">
            Os dois botões de ícone ao lado da ordenação trocam o formato dos
            cartões. Escolha o que for mais confortável para você.
          </p>
        </div>
      </div>
    </div>
  </SecaoAjuda>
</template>

<style scoped>
.passos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 0 0 44px;
  padding: 0;
  list-style: none;
}

.passo {
  position: relative;
  overflow: hidden;
  padding: 24px 22px 26px;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 18px;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.passo::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 4px;
  background: var(--cor-primaria);
  opacity: .68;
}

.passo:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--cor-primaria) 40%, var(--cor-borda));
  box-shadow: 0 12px 30px rgba(0, 0, 0, .10);
}

.passo-topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.passo-icone {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 14px;
}

.passo-numero {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  opacity: .75;
}

.passo h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -.3px;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.passo p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.subtitulo-bloco {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -.4px;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.lista-filtros {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 4px;
  padding: 0;
  list-style: none;
}

.chips li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13.5px;
  line-height: 1.4;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
  background: var(--cor-fundo-sutil);
  border: 1px solid var(--cor-borda-suave);
  border-radius: 10px;
}

.chips.com-icone li {
  padding: 5px 12px 5px 6px;
}

.chips img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

.chips.pequeno li {
  font-size: 13px;
  padding: 5px 11px;
}

.exemplo {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--cor-primaria-fundo);
  border: 1px solid color-mix(in srgb, var(--cor-primaria) 25%, transparent);
  border-radius: 12px;
}

.exemplo img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
}

.lista-filtros a {
  color: var(--cor-primaria);
  font-weight: 600;
}

.faixa-extra {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.faixa-card {
  display: flex;
  gap: 16px;
  padding: 22px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border: 1px solid color-mix(in srgb, var(--cor-primaria) 25%, transparent);
  border-radius: 14px;
}

.faixa-card > svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.faixa-card h4 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.faixa-card p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.faixa-card .chips {
  margin-top: 8px;
}

.faixa-card .chips li {
  background: var(--cor-fundo-card);
}

@media (max-width: 1000px) {
  .passos { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 800px) {
  .lista-filtros,
  .faixa-extra { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .passos { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .passo { transition: none; }
  .passo:hover { transform: none; }
}
</style>
