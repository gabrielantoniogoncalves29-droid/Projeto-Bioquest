<script setup>
import { computed } from 'vue'
import SecaoAjuda from './SecaoAjuda.vue'
import Colapsavel from './Colapsavel.vue'
import { eixos, conteudos } from '@/features/Questoes/data/filtros.js'

const iconeEixo = id => new URL(`../Questoes/icons/objeto${id}.png`, import.meta.url).href
const iconeConteudo = id => new URL(`../Questoes/icons/${id}.png`, import.meta.url).href

const estrutura = computed(() =>
  eixos.map(eixo => ({
    ...eixo,
    nome: eixo.nome.trim(),
    conteudos: conteudos
      .filter(conteudo => conteudo.eixoId === eixo.id)
      .map(conteudo => ({ ...conteudo, nome: conteudo.nome.trim() }))
  }))
)

const totalSubconteudos = conteudos.reduce(
  (soma, conteudo) => soma + conteudo.subconteudos.length,
  0
)
</script>

<template>
  <SecaoAjuda
    id="conteudos"
    nivel="sub"
    titulo="Como as questões são"
    destaque="organizadas"
    subtitulo="Toda questão é classificada em um eixo temático e em um conteúdo do livro didático, que se divide em subconteúdos."
  >
    <div class="hierarquia" aria-label="Hierarquia da organização das questões">
      <div class="nivel">
        <strong>{{ eixos.length }}</strong>
        <span>Eixos temáticos</span>
      </div>
      <span class="seta" aria-hidden="true">›</span>
      <div class="nivel">
        <strong>{{ conteudos.length }}</strong>
        <span>Conteúdos do livro didático</span>
      </div>
      <span class="seta" aria-hidden="true">›</span>
      <div class="nivel">
        <strong>{{ totalSubconteudos }}</strong>
        <span>Subconteúdos</span>
      </div>
    </div>

    <p class="dica preservar-cor">
      Cada eixo e cada conteúdo tem um <strong>ícone próprio</strong>. Eles
      aparecem nos cartões das questões, no painel lateral e nos filtros. Abra
      um eixo para conhecer seus conteúdos e, dentro de cada conteúdo, os
      subconteúdos.
    </p>

    <div class="lista-eixos">
      <Colapsavel
        v-for="eixo in estrutura"
        :key="eixo.id"
        :titulo="eixo.nome"
        :subtitulo="`${eixo.conteudos.length} ${eixo.conteudos.length === 1 ? 'conteúdo' : 'conteúdos'}`"
      >
        <template #icone>
          <img class="icone-eixo" :src="iconeEixo(eixo.id)" alt="" loading="lazy">
        </template>

        <div class="grade-conteudos">
          <Colapsavel
            v-for="conteudo in eixo.conteudos"
            :key="conteudo.id"
            :titulo="conteudo.nome"
            :subtitulo="`${conteudo.subconteudos.length} subconteúdos`"
          >
            <template #icone>
              <img class="icone-conteudo" :src="iconeConteudo(conteudo.id)" alt="" loading="lazy">
            </template>

            <ul class="subs">
              <li v-for="sub in conteudo.subconteudos" :key="sub">
                <img :src="iconeConteudo(conteudo.id)" alt="" loading="lazy">
                <span>{{ sub.trim() }}</span>
              </li>
            </ul>
          </Colapsavel>
        </div>
      </Colapsavel>
    </div>
  </SecaoAjuda>
</template>

<style scoped>
.hierarquia {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}

.nivel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  padding: 18px 22px;
  text-align: center;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.nivel::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 4px;
  background: var(--cor-primaria);
  opacity: .68;
}

.nivel strong {
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
  color: var(--cor-primaria);
}

.nivel span {
  font-size: 14px;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.seta {
  align-self: center;
  font-size: 30px;
  color: var(--cor-primaria);
  opacity: .6;
}

.dica {
  max-width: 760px;
  margin: 0 auto 30px;
  text-align: center;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.lista-eixos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.icone-eixo {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.icone-conteudo {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.grade-conteudos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: start;
  margin-top: 8px;
}

.grade-conteudos :deep(.colapsavel) {
  background: var(--cor-fundo-sutil);
}

.subs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.subs li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda-suave);
  border-radius: 10px;
}

.subs img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  flex-shrink: 0;
}

@media (max-width: 800px) {
  .grade-conteudos { grid-template-columns: 1fr; }
  .seta { display: none; }
  .nivel { min-width: 100%; }
}
</style>
