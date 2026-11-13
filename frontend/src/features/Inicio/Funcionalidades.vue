<script setup>
const funcionalidades = [
  {
    id: 'questoes',
    numero: '01',
    titulo: 'Questões do ENEM',
    descricao:
      'Acesse questões de Biologia do ENEM, organizadas por ano, categoria, eixo temático, conteúdo e subconteúdo.',
    rota: '/questoes',
    acao: 'Explorar questões'
  },
  {
    id: 'detalhes',
    numero: '02',
    titulo: 'Detalhes das questões',
    descricao:
      'Veja classificações, palavras-chave, objetos de conhecimento, explicações teóricas e resoluções comentadas.',
    rota: '/questoes',
    acao: 'Ver detalhes'
  },
  {
    id: 'forum',
    numero: '03',
    titulo: 'Fórum de questões',
    descricao:
      'Participe das discussões dentro das questões, compartilhe conhecimentos e tire dúvidas com outros estudantes.',
    rota: '/questoes',
    acao: 'Explorar o fórum'
  },
  {
    id: 'estatisticas',
    numero: '04',
    titulo: 'Estatísticas',
    descricao:
      'Acompanhe acertos, desempenho e indicadores que ajudam a visualizar sua evolução nos estudos.',
    rota: '/estatisticas',
    acao: 'Ver estatísticas'
  },
  {
    id: 'ajuda',
    numero: '05',
    titulo: 'Central de ajuda',
    descricao:
      'Encontre orientações, perguntas frequentes e informações para utilizar melhor a plataforma.',
    rota: '/ajuda',
    acao: 'Acessar ajuda'
  },
  {
    id: 'perfil',
    numero: '06',
    titulo: 'Meu perfil',
    descricao:
      'Gerencie seus dados pessoais, veja suas questões salvas e acompanhe seu histórico de estudos.',
    rota: '/perfil',
    acao: 'Acessar perfil'
  }
]
</script>

<template>
  <section
    class="secao-funcoes"
    aria-labelledby="titulo-funcionalidades"
  >
    <div class="funcoes">
      <header class="funcoes-cabecalho">
        <h2
          id="titulo-funcionalidades"
          class="title"
        >
          Conheça nossas <span>funcionalidades!</span>
        </h2>

        <p class="funcoes-subtitulo preservar-cor">
          Tudo o que você precisa para praticar, aprender e evoluir nos estudos.
        </p>
      </header>

      <div
        class="cards-scroll"
        role="region"
        aria-label="Funcionalidades do BioQuest"
        tabindex="0"
      >
        <article
          v-for="item in funcionalidades"
          :key="item.id"
          class="card-funcao"
        >
          <div class="card-topo">
            <div class="card-icone" aria-hidden="true">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <g v-if="item.id === 'questoes'">
                  <rect x="12" y="8" width="40" height="48" rx="8" />
                  <path d="M21 20h16M21 29h11M21 38h8" />
                  <circle cx="42" cy="40" r="9" />
                  <path d="m38 40 3 3 5-6" />
                </g>

                <g v-else-if="item.id === 'detalhes'">
                  <rect x="10" y="8" width="33" height="46" rx="7" />
                  <path d="M18 20h16M18 28h12M18 36h8" />
                  <circle cx="43" cy="41" r="10" />
                  <path d="m50 48 5 5" />
                </g>

                <g v-else-if="item.id === 'forum'">
                  <path
                    d="M14 14h36a6 6 0 0 1 6 6v17a6 6 0 0 1-6 6H30l-10 8v-8h-6a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6Z"
                  />
                  <circle cx="23" cy="28" r="1.7" fill="currentColor" stroke="none" />
                  <circle cx="32" cy="28" r="1.7" fill="currentColor" stroke="none" />
                  <circle cx="41" cy="28" r="1.7" fill="currentColor" stroke="none" />
                </g>

                <g v-else-if="item.id === 'estatisticas'">
                  <rect x="10" y="10" width="44" height="44" rx="8" />
                  <path d="M20 44V34M30 44V28M40 44V21" />
                  <path d="m19 25 10-7 9 3 8-9" />
                </g>

                <g v-else-if="item.id === 'ajuda'">
                  <circle cx="32" cy="32" r="22" />
                  <path d="M25 25a7.5 7.5 0 1 1 12 6c-2.7 1.9-4.7 3.2-4.7 6.4" />
                  <circle cx="32" cy="45" r="1.8" fill="currentColor" stroke="none" />
                </g>

                <g v-else-if="item.id === 'perfil'">
                  <rect x="9" y="11" width="46" height="42" rx="8" />
                  <circle cx="24" cy="27" r="6.5" />
                  <path d="M14 43c1.4-6 5.8-9.5 10-9.5 4.4 0 8.7 3.5 10 9.5" />
                  <path d="M41 24h8M41 31h8M41 38h6" />
                </g>
              </svg>
            </div>

            <span class="card-numero">
              {{ item.numero }}
            </span>
          </div>

          <div class="card-conteudo">
            <h3>{{ item.titulo }}</h3>

            <p class="card-descricao preservar-cor">
              {{ item.descricao }}
            </p>
          </div>

          <router-link
            :to="item.rota"
            class="card-link"
          >
            {{ item.acao }}

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </router-link>
        </article>
      </div>
    </div>
    <p class="desliza">deslize para ver mais →</p>
  </section>
</template>

<style scoped>
.secao-funcoes {
  --destaque: var(--cor-primaria);
  --titulo-verde: var(--cor-primaria-texto);
  --texto: var(--cor-texto-principal);
  --texto-secundario: var(--cor-texto-secundario);
  --fundo-card: var(--cor-fundo-card);
  --borda-card: var(--cor-borda);

  width: 100%;
  box-sizing: border-box;
  padding: 70px 28px 90px;
  background-color: var(--cor-fundo-pagina);
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
}

.secao-funcoes *,
.secao-funcoes *::before,
.secao-funcoes *::after {
  box-sizing: border-box;
}

.funcoes {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

.funcoes-cabecalho {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 34px;
  text-align: center;
}

.secao-funcoes .title {
  margin: 0;
  font-family: 'Inter', Arial, sans-serif;
  font-size: clamp(36px, 4.2vw, 56px);
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: -1.5px;
  color: var(--titulo-verde);
}

.secao-funcoes .title span {
  color: var(--destaque);
}

.funcoes-subtitulo {
  max-width: 650px;
  margin: 18px 0 0;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.7;
  color: var(--texto);
  opacity: .88;
}

.cards-scroll {
  display: flex;
  gap: 22px;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 8px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.cards-scroll::-webkit-scrollbar {
  display: none;
}

.desliza{
  display: block;
  margin-top: 16px;
  text-align: end;
  margin-right: 80px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--texto-secundario);
}

.card-funcao {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 calc((100% - 48px) / 3);
  min-width: 0;
  min-height: 360px;
  padding: 32px 30px 28px;
  background-color: var(--fundo-card);
  border: 1px solid var(--borda-card);
  border-radius: 18px;
  color: var(--texto);
  scroll-snap-align: start;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.card-funcao:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--destaque) 40%, var(--borda-card));
  box-shadow: 0 12px 30px rgba(0, 0, 0, .10);
}

.card-funcao::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: var(--destaque);
  opacity: .68;
}

.card-topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 26px;
}

.card-icone {
  width: 66px;
  height: 66px;
  flex-shrink: 0;
  color: var(--destaque);
}

.card-icone svg {
  display: block;
  width: 100%;
  height: 100%;
}

.card-numero {
  color: var(--texto-secundario);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: .75;
}

.card-conteudo {
  width: 100%;
}

.card-conteudo h3 {
  margin: 0 0 16px;
  color: var(--titulo-verde);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.3;
  letter-spacing: -.4px;
}

.card-descricao {
  margin: 0;
  color: var(--texto);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.75;
  opacity: .86;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding-top: 28px;
  color: var(--destaque);
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: gap .2s ease, opacity .2s ease;
}

.card-link:hover {
  gap: 14px;
  opacity: .85;
}

.card-link svg {
  flex-shrink: 0;
}

.card-link:focus-visible {
  outline: 2px solid var(--destaque);
  outline-offset: 4px;
  border-radius: 4px;
}

@media (max-width: 1000px) {
  .secao-funcoes {
    padding: 60px 24px 75px;
  }

  .card-funcao {
    flex-basis: calc((100% - 22px) / 2);
    min-height: 350px;
    padding: 28px 25px 26px;
  }

  .card-conteudo h3 {
    font-size: 19px;
  }
}

@media (max-width: 700px) {
  .secao-funcoes {
    padding: 48px 18px 65px;
  }

  .funcoes-cabecalho {
    margin-bottom: 25px;
  }

  .secao-funcoes .title {
    font-size: clamp(30px, 8vw, 42px);
    letter-spacing: -1px;
  }

  .funcoes-subtitulo {
    font-size: 15px;
    margin-top: 16px;
  }

  .cards-scroll {
    gap: 16px;
  }

  .card-funcao {
    flex: 0 0 92%;
    min-height: 340px;
    padding: 24px 22px 24px;
    border-radius: 16px;
  }

  .card-topo {
    margin-bottom: 22px;
  }

  .card-icone {
    width: 60px;
    height: 60px;
  }

  .card-conteudo h3 {
    font-size: 18px;
  }

  .card-descricao {
    font-size: 14px;
  }
}

@media (max-width: 380px) {
  .secao-funcoes {
    padding-inline: 14px;
  }

  .card-funcao {
    flex-basis: 96%;
    padding: 22px 20px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cards-scroll {
    scroll-behavior: auto;
  }

  .card-funcao,
  .card-link {
    transition: none;
  }

  .card-funcao:hover {
    transform: none;
  }
}
</style>