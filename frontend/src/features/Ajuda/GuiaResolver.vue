<script setup>
import {
  Bookmark, Flag, ChevronRight, Info, ArrowRight, Link2,
  ListChecks, MessageCircle, BookOpen
} from 'lucide-vue-next'
import SecaoAjuda from './SecaoAjuda.vue'
import Colapsavel from './Colapsavel.vue'

const iconeEixo = id => new URL(`../Questoes/icons/objeto${id}.png`, import.meta.url).href
const iconeConteudo = id => new URL(`../Questoes/icons/${id}.png`, import.meta.url).href

const etapas = [
  {
    titulo: 'Clique em “Resolver”',
    texto:
      'Na lista de questões, cada cartão tem o botão “Resolver”. Ao clicar, a lista que você buscou fica guardada para a navegação entre questões.'
  },
  {
    titulo: 'Leia o enunciado',
    texto:
      'O enunciado (com texto e imagem, quando houver) aparece no centro da tela, seguido pelas alternativas.'
  },
  {
    titulo: 'Escolha uma alternativa',
    texto:
      'Clique na alternativa que considera correta. Ela fica destacada, e você ainda pode trocar de ideia antes de responder.'
  },
  {
    titulo: 'Clique em “Responder”',
    texto:
      'A alternativa correta é revelada e a sua resposta é marcada como certa ou errada. Depois disso, as alternativas ficam bloqueadas.'
  },
  {
    titulo: 'Aprenda com o resultado',
    texto:
      'Abra “Ver resolução comentada” ou “Saiba mais sobre a questão” para entender o raciocínio e revisar a teoria.'
  },
  {
    titulo: 'Siga para a próxima',
    texto:
      '“Próxima questão →” leva à questão seguinte da lista que você buscou, na ordem escolhida.'
  }
]

const botoes = [
  {
    icone: Bookmark,
    nome: 'Salvar questão',
    texto: 'Guarda a questão para estudar depois. Ela aparece no seu perfil, em “Questões salvas”.'
  },
  {
    icone: Flag,
    nome: 'Marcar para revisar',
    texto: 'Sinaliza que você quer rever a questão mais tarde. Fica em “Para revisar” no perfil.'
  },
  {
    icone: ChevronRight,
    nome: 'Ver / Ocultar detalhes',
    texto: 'Abre ou fecha o painel lateral com as informações da questão.'
  }
]

const painel = [
  {
    nome: 'Objeto de conhecimento',
    texto: 'O eixo temático da questão, com o ícone do eixo.',
    imagem: iconeEixo(2)
  },
  {
    nome: 'Conteúdo do livro didático',
    texto: 'Mostra o conteúdo e o subconteúdo (por exemplo, Genética › Genética clássica), com o ícone do conteúdo.',
    imagem: iconeConteudo(15)
  },
  {
    nome: 'Nível da questão',
    texto: 'A categoria em que a questão foi classificada.'
  },
  {
    nome: 'Percentual de acertos',
    texto: 'Quantos estudantes acertaram a questão. Se o dado não estiver disponível, aparece “—”.'
  },
  {
    nome: 'Link da questão',
    texto: 'Um endereço pronto para copiar e compartilhar a questão com colegas ou professores.',
    icone: Link2
  }
]
</script>

<template>
  <SecaoAjuda
    id="resolver"
    nivel="sub"
    titulo="Como"
    destaque="resolver questões"
    subtitulo="Do clique no cartão até a resolução comentada: veja o que acontece em cada etapa."
  >
    <div class="duas-colunas">
      <ol class="linha-tempo">
        <li v-for="(etapa, indice) in etapas" :key="etapa.titulo">
          <span class="bolinha">{{ indice + 1 }}</span>
          <div>
            <h3>{{ etapa.titulo }}</h3>
            <p class="preservar-cor">{{ etapa.texto }}</p>
          </div>
        </li>
      </ol>

      <aside class="previa" aria-label="Ilustração da tela de resolver questão">
        <div class="previa-topo">
          <span class="previa-ano">ENEM</span>
          <span class="previa-codigo">Código: 123</span>
        </div>

        <div class="previa-alternativas">
          <div class="alt"><b>A</b><i></i></div>
          <div class="alt selecionada"><b>B</b><i></i></div>
          <div class="alt correta"><b>C</b><i></i></div>
          <div class="alt"><b>D</b><i></i></div>
        </div>

        <div class="previa-rodape">
          <span class="previa-saiba"><Info :size="14" /> Saiba mais</span>
          <span class="previa-botao">Responder</span>
          <span class="previa-prox">Próxima <ArrowRight :size="13" /></span>
        </div>

        <p class="previa-legenda preservar-cor">
          Ilustração. Depois de responder, a alternativa correta fica verde e,
          se você errar, a escolhida fica em vermelho.
        </p>
      </aside>
    </div>

    <div class="blocos">
      <Colapsavel
        titulo="Botões do topo da questão"
        subtitulo="Salvar, marcar para revisar e abrir os detalhes"
        :aberto="true"
      >
        <ul class="itens">
          <li v-for="botao in botoes" :key="botao.nome">
            <span class="item-icone"><component :is="botao.icone" :size="20" /></span>
            <div>
              <strong>{{ botao.nome }}</strong>
              <span>{{ botao.texto }}</span>
            </div>
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Painel lateral de detalhes"
        subtitulo="Tudo sobre a questão sem sair da tela"
      >
        <ul class="itens">
          <li v-for="item in painel" :key="item.nome">
            <span class="item-icone" :class="{ imagem: item.imagem }">
              <img v-if="item.imagem" :src="item.imagem" alt="" loading="lazy">
              <component :is="item.icone" v-else-if="item.icone" :size="20" />
              <ListChecks v-else :size="20" />
            </span>
            <div>
              <strong>{{ item.nome }}</strong>
              <span>{{ item.texto }}</span>
            </div>
          </li>
        </ul>
        <p>
          O botão <strong>“Ver detalhes completos”</strong> do painel abre a
          página de detalhes da questão.
        </p>
      </Colapsavel>

      <Colapsavel
        titulo="Página “Saiba mais sobre a questão”"
        subtitulo="Prévia, explicação, teoria e fórum"
      >
        <p>
          Aqui você vê a <strong>prévia da questão</strong> (que pode ser
          expandida), os cartões com nível, objeto de conhecimento, estrutura do
          livro didático e percentual de acertos, e duas abas:
        </p>
        <ul class="itens">
          <li>
            <span class="item-icone"><BookOpen :size="20" /></span>
            <div>
              <strong>Explicação e teoria</strong>
              <span>Resumo sobre o conteúdo, palavras-chave da questão e a resolução comentada.</span>
            </div>
          </li>
          <li>
            <span class="item-icone"><MessageCircle :size="20" /></span>
            <div>
              <strong>Comentários e discussões</strong>
              <span>
                O fórum da questão: tire dúvidas e converse com outros
                estudantes. É preciso estar logado para comentar, e o editor
                permite negrito, itálico, sublinhado e listas.
              </span>
            </div>
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="E se eu voltar a uma questão que já respondi?"
        subtitulo="Seu histórico fica registrado"
      >
        <p>
          A questão abre exatamente como você deixou: com a sua alternativa
          marcada e o resultado visível. Para treinar de novo, você pode
          zerar o histórico em Meu Perfil (veja a seção de perfil).
        </p>
      </Colapsavel>
    </div>
  </SecaoAjuda>
</template>

<style scoped>
.duas-colunas {
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 36px;
  align-items: start;
  margin-bottom: 36px;
}

.linha-tempo {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}

.linha-tempo::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: color-mix(in srgb, var(--cor-primaria) 30%, transparent);
}

.linha-tempo li {
  position: relative;
  display: flex;
  gap: 18px;
  padding-bottom: 22px;
}

.linha-tempo li:last-child {
  padding-bottom: 0;
}

.bolinha {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  font-size: 15px;
  font-weight: 700;
  color: var(--cor-texto-invertido);
  background: var(--cor-primaria);
  border-radius: 50%;
  box-shadow: 0 0 0 5px var(--cor-fundo-pagina);
}

.linha-tempo h3 {
  margin: 6px 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.linha-tempo p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.previa {
  position: sticky;
  top: 20px;
  padding: 20px;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 18px;
  box-shadow: var(--sombra-card);
}

.previa-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--cor-borda);
}

.previa-ano {
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 999px;
}

.previa-codigo {
  font-size: 12.5px;
  color: var(--ajuda-texto-suave, var(--cor-texto-suave));
}

.previa-alternativas {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.alt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--cor-borda);
  border-radius: 10px;
  background: var(--cor-fundo-card);
}

.alt b {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  border: 1px solid var(--cor-borda);
  border-radius: 50%;
}

.alt i {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--cor-fundo-sutil);
}

.alt.selecionada {
  border-color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
}

.alt.selecionada b {
  color: var(--cor-primaria);
  border-color: var(--cor-primaria);
}

.alt.correta {
  border-color: var(--cor-acerto);
  background: var(--cor-acerto-fundo);
}

.alt.correta b {
  color: var(--cor-texto-invertido);
  background: var(--cor-acerto);
  border-color: var(--cor-acerto);
}

.previa-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  background: var(--cor-fundo-sutil);
  border-radius: 10px;
  font-size: 12.5px;
}

.previa-saiba {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  font-weight: 600;
}

.previa-botao {
  padding: 6px 12px;
  font-weight: 600;
  color: var(--cor-texto-invertido);
  background: var(--cor-primaria);
  border-radius: 8px;
}

.previa-prox {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
}

.previa-legenda {
  margin: 14px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ajuda-texto-suave, var(--cor-texto-suave));
}

.blocos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.itens {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 8px 0 12px;
  padding: 0;
  list-style: none;
}

.itens li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.itens strong {
  display: block;
  font-size: 15px;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
}

.itens span:not(.item-icone) {
  font-size: 14.5px;
  line-height: 1.65;
}

.item-icone {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 11px;
}

.item-icone.imagem {
  width: 48px;
  height: 48px;
  background: transparent;
}

.item-icone img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 900px) {
  .duas-colunas { grid-template-columns: 1fr; gap: 28px; }
  .previa { position: static; }
}
</style>
