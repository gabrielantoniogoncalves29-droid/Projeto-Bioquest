<script setup>

import { storeToRefs } from 'pinia'
import { BookOpenCheck, GraduationCap } from 'lucide-vue-next'

import { useDetalhesQuestaoStore } from '@/store/detalhes_questao'

const store = useDetalhesQuestaoStore()

const { questao, teoria, alternativaCorreta } = storeToRefs(store)

</script>

<template>

<div class="explicacao">

    <div class="secao-teoria">

        <div class="secao-cabecalho">

            <GraduationCap :size="18" />
            <h2>Sobre o conteúdo</h2>

        </div>

        <p
            v-for="(paragrafo, indice) in teoria"
            :key="indice"
        >
            {{ paragrafo }}
        </p>

        <p
            v-if="teoria.length === 0"
            class="sem-conteudo"
        >
            Ainda não temos um resumo de teoria para esta questão.
        </p>

    </div>

    <div
        v-if="questao"
        class="secao-resolucao"
    >

        <div class="secao-cabecalho">

            <BookOpenCheck :size="18" />
            <h2>Resolução comentada</h2>

        </div>

        <p
            v-if="alternativaCorreta"
            class="resposta-correta"
        >
            <span class="badge-correta">{{ alternativaCorreta.letra }}</span>
            {{ alternativaCorreta.texto }}
        </p>

        <p class="comentario">
            {{ questao.comentario }}
        </p>

    </div>

</div>

</template>

<style scoped>

.explicacao{

    display:flex;

    flex-direction:column;

    gap:16px;

}

.secao-teoria,
.secao-resolucao{

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda-suave);
    border-left:3px solid var(--cor-primaria);

    border-radius:14px;

    padding:24px 28px;

    box-shadow: var(--sombra-card);

}

.secao-cabecalho{

    display:flex;

    align-items:center;

    gap:9px;

    color:var(--cor-primaria);

    margin-bottom:14px;

}

.secao-cabecalho h2{

    margin:0;

    font-size:17px;

    font-weight:700;

    color:var(--cor-texto-principal);

}

p{

    overflow-wrap:anywhere;

    margin:0 0 10px;

    font-size:14.5px;

    line-height:1.7;

    color:var(--cor-texto-secundario);

}

p:last-child{

    margin-bottom:0;

}

.sem-conteudo{

    color:var(--cor-texto-fraco);

    font-style:italic;

}

.resposta-correta{

    display:flex;

    align-items:flex-start;

    gap:10px;

    padding:14px 16px;

    margin-bottom:14px;

    background:var(--cor-primaria-fundo);

    border:1px solid var(--cor-primaria-translucida-fraca);

    border-radius:12px;

    color:var(--cor-texto-principal);

    font-weight:600;

}

.badge-correta{

    display:flex;

    align-items:center;

    justify-content:center;

    width:26px;

    height:26px;

    min-width:26px;

    border-radius:50%;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-size:13px;

    font-weight:700;

}

.comentario{

    color:var(--cor-texto-secundario);

}

@media (max-width:600px){

    .explicacao{

        gap:12px;

    }

    .secao-teoria,
    .secao-resolucao{

        padding:16px 14px;

        border-radius:12px;

    }

    .secao-cabecalho{

        margin-bottom:10px;

    }

    .secao-cabecalho h2{

        font-size:16px;

    }

    p{

        font-size:14px;

        line-height:1.65;

    }

    .resposta-correta{

        padding:12px;

        gap:8px;

    }

}

</style>
