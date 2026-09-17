<script setup>

import { computed } from 'vue'

const props = defineProps({

    detalhes: {
        type: Object,
        default: null
    }

})

const objetosEnem = {

    1: "Moléculas, células e tecidos",
    2: "Hereditariedade e diversidade da vida",
    3: "Identidade dos seres vivos",
    4: "Ecologia e ciências ambientais",
    5: "Origem e evolução da vida",
    6: "Qualidade de vida das populações humanas"

}

const nomeObjeto = computed(() =>

    objetosEnem[
        props.detalhes?.objeto?.id
    ] ?? "Não informado"

)

const imagemObjeto = computed(() => {

    const id = props.detalhes?.objeto?.id

    if (!id) return ''

    return new URL(

        `../icons/objeto${id}.png`,

        import.meta.url

    ).href

})

const conteudo = computed(() =>

    props.detalhes?.conteudo ?? {}

)

const imagemConteudo = computed(() => {

    const icone = conteudo.value?.area?.icone

    if (!icone) return ''

    return new URL(

        `../icons/${icone}.png`,

        import.meta.url

    ).href

})

const nivel = computed(() =>

    props.detalhes?.nivel ?? 'Não informado'

)

const taxaAcerto = computed(() =>

    props.detalhes?.taxaAcerto ?? 0

)

</script>

<template>

<div class="info-questao">

    <div class="info-card">

        <div class="icone-caixa">

            <img
                v-if="imagemObjeto"
                :src="imagemObjeto"
                alt=""
            >

        </div>

        <div class="texto-bloco">

            <span class="titulo-card">Objeto de conhecimento</span>

            <span class="valor-card">{{ nomeObjeto }}</span>

        </div>

    </div>

    <div class="info-card">

        <div class="icone-caixa">

            <img
                v-if="imagemConteudo"
                :src="imagemConteudo"
                alt=""
            >

        </div>

        <div class="texto-bloco">

            <span class="titulo-card">Conteúdo do livro didático</span>

            <span class="valor-card">

                {{ conteudo.area?.nome }}

                <span class="seta">›</span>

                {{ conteudo.assunto?.nome }}

            </span>

        </div>

    </div>

    <div class="info-card">

        <div class="icone-caixa icone-nivel">

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            >

                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>

            </svg>

        </div>

        <div class="texto-bloco">

            <span class="titulo-card">Nível da questão</span>

            <span class="valor-card">{{ nivel }}</span>

        </div>

    </div>

    <div class="info-card">

        <div class="icone-caixa icone-nivel">

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            >

                <path d="M3 3v18h18"/>
                <path d="M7 15v3"/>
                <path d="M12 10v8"/>
                <path d="M17 6v12"/>

            </svg>

        </div>

        <div class="texto-bloco">

            <span class="titulo-card">Percentual de acertos</span>

            <span class="valor-card">

                <strong class="percentual-numero">{{ taxaAcerto }}%</strong>
                dos estudantes acertaram

            </span>

            <div class="barra">

                <div
                    class="preenchimento"
                    :style="{ width: taxaAcerto + '%' }"
                ></div>

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>

.info-questao{

    display:grid;

    grid-template-columns:repeat(4, 1fr);

    gap:14px;

}

.info-card{

    display:flex;

    gap:14px;

    align-items:center;

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda);

    border-radius:14px;

    padding:18px;

    min-width:0;

}

.icone-caixa{

    display:flex;

    align-items:center;

    justify-content:center;

    width:42px;

    height:42px;

    min-width:42px;

    border-radius:11px;

    background:var(--cor-primaria-fundo);

}

.icone-caixa img{

    width:28px;

    height:28px;

    object-fit:contain;

}

.icone-nivel{

    color:var(--cor-primaria);

}

.texto-bloco{

    display:flex;

    flex-direction:column;

    gap:4px;

    min-width:0;

}

.titulo-card{

    font-size:12px;

    font-weight:600;

    color:var(--cor-texto-suave);

    text-transform:uppercase;

    letter-spacing:.3px;

}

.valor-card{

    font-size:14px;

    font-weight:600;

    color:var(--cor-texto-principal);

    line-height:1.4;

}

.seta{

    color:var(--cor-primaria);

    font-weight:700;

    margin:0 2px;

}

.percentual-numero{

    color:var(--cor-primaria);

    font-size:15px;

}

.barra{

    margin-top:6px;

    width:100%;

    height:6px;

    border-radius:999px;

    background:var(--cor-borda-suave);

    overflow:hidden;

}

.preenchimento{

    height:100%;

    border-radius:999px;

    background:var(--cor-primaria);

    transition:width .3s ease;

}

@media (max-width:960px){

    .info-questao{

        grid-template-columns:repeat(2, 1fr);

    }

}

@media (max-width:600px){

    .info-questao{

        grid-template-columns:1fr;

    }

    .info-card{

        padding:14px;

    }

}

</style>
