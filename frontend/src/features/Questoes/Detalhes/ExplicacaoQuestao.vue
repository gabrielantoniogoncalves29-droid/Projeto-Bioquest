<script setup>
import { storeToRefs } from 'pinia'
import { BookOpenCheck, GraduationCap } from 'lucide-vue-next'
import { useDetalhesQuestaoStore } from '@/store/detalhes_questao'

const store = useDetalhesQuestaoStore()
const { questao, teoria, palavrasChave, alternativaCorreta } = storeToRefs(store)
</script>

<template>
  <div class="explicacao">
    <div class="secao-teoria">
      <div class="secao-cabecalho">
        <GraduationCap :size="18" />
        <h2>Sobre o conteúdo</h2>
      </div>

      <p v-for="(paragrafo, indice) in teoria" :key="indice">
        {{ paragrafo }}
      </p>

      <p v-if="teoria.length === 0" class="sem-conteudo">
        Ainda não temos um resumo de teoria para esta questão.
      </p>

      <div v-if="palavrasChave.length" class="palavras-chave">
        <div class="palavras-titulo">
          <h3>Palavras-chave</h3>
        </div>

        <ul class="palavras-lista" aria-label="Palavras-chave da questão">
          <li
            v-for="palavra in palavrasChave"
            :key="palavra"
            class="palavra"
          >
            {{ palavra }}
          </li>
        </ul>
      </div>
    </div>

    <div v-if="questao" class="secao-resolucao">
      <div class="secao-cabecalho">
        <BookOpenCheck :size="18" />
        <h2>Resolução comentada</h2>
      </div>

      <template v-if="questao.liberada">
        <div v-if="alternativaCorreta" class="resposta-correta">
          <span class="badge-correta">{{ alternativaCorreta.letra }}</span>
          <span class="corpo-resposta">
            <span v-if="alternativaCorreta.texto">{{ alternativaCorreta.texto }}</span>
            <img
              v-if="alternativaCorreta.imagem"
              class="imagem-resposta"
              :src="alternativaCorreta.imagem"
              :alt="alternativaCorreta.texto || `Alternativa ${alternativaCorreta.letra}`"
              loading="lazy"
            >
          </span>
        </div>

        <p v-if="questao.comentario" class="comentario">
          {{ questao.comentario }}
        </p>
        <p v-else class="sem-conteudo">
          Ainda não temos a resolução comentada desta questão.
        </p>
      </template>

      <p v-else class="sem-conteudo bloqueada">
        A resolução comentada e o gabarito aparecem depois que você responde a questão.
        <router-link :to="`/resolver/${questao.id}`">Resolver agora</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.explicacao {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.secao-teoria,
.secao-resolucao {
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda-suave);
  border-left: 3px solid var(--cor-primaria);
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: var(--sombra-card);
}

.secao-cabecalho {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--cor-primaria);
  margin-bottom: 14px;
}

.secao-cabecalho h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--cor-texto-principal);
}

p {
  overflow-wrap: anywhere;
  margin: 0 0 10px;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--cor-texto-secundario);
}

p:last-child { margin-bottom: 0; }

.palavras-chave {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px 16px;
  margin-top: 18px;
}

.palavras-titulo {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 7px;
  min-height: 28px;
  color: var(--cor-primaria);
}

.palavras-titulo h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--cor-texto-principal);
}

.palavras-lista {
  display: flex;
  flex: 1 1 240px;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.palavra {
  max-width: 100%;
  padding: 5px 10px;
  background: var(--cor-fundo-sutil);
  border: 1px solid var(--cor-borda-suave);
  border-radius: 7px;
  color: var(--cor-texto-secundario);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.bloqueada a {
  color: var(--cor-primaria);
  font-style: normal;
  font-weight: 600;
  margin-left: 6px;
}

.corpo-resposta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.imagem-resposta {
  display: block;
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  align-self: flex-start;
  padding: 4px;
  border-radius: 6px;
  background: #fff;
}

.sem-conteudo {
  color: var(--cor-texto-fraco);
  font-style: italic;
}

.resposta-correta {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  margin-bottom: 14px;
  background: var(--cor-primaria-fundo);
  border: 1px solid var(--cor-primaria-translucida-fraca);
  border-radius: 12px;
  color: var(--cor-texto-principal);
  font-weight: 600;
}

.badge-correta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  background: var(--cor-primaria);
  color: var(--cor-texto-invertido);
  font-size: 13px;
  font-weight: 700;
}

.comentario { color: var(--cor-texto-secundario); }

@media (max-width: 600px) {
  .explicacao { gap: 12px; }

  .secao-teoria,
  .secao-resolucao {
    padding: 16px 14px;
    border-radius: 12px;
  }

  .secao-cabecalho { margin-bottom: 10px; }
  .secao-cabecalho h2 { font-size: 16px; }
  p { font-size: 14px; line-height: 1.65; }
  .resposta-correta { padding: 12px; gap: 8px; }

  .palavras-chave {
    flex-direction: column;
    gap: 8px;
    margin-top: 15px;
  }

  .palavras-lista { flex: 0 1 auto; width: 100%; }
  .palavra { font-size: 12px; }
}
</style>