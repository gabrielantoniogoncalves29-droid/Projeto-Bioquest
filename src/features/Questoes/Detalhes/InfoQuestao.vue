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

const raioAnel = 38

const circunferenciaAnel = 2 * Math.PI * raioAnel

const deslocamentoAnel = computed(() =>

    circunferenciaAnel * (1 - taxaAcerto.value / 100)

)

</script>

<template>

<div class="info-questao">

    <div class="info-card">

        <div class="card-icone">

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

            <span class="card-titulo">Nível da questão</span>

            <span class="card-valor">{{ nivel }}</span>

        </div>

    </div>

    <div class="info-card">

        <div class="card-icone">

            <img
                v-if="imagemObjeto"
                :src="imagemObjeto"
                alt=""
            >

        </div>

        <div class="texto-bloco">

            <span class="card-titulo">Objeto de conhecimento</span>

            <span class="card-valor">{{ nomeObjeto }}</span>

        </div>

    </div>

    <div class="info-card">

        <div class="card-icone">

            <img
                v-if="imagemConteudo"
                :src="imagemConteudo"
                alt=""
            >

        </div>

        <div class="texto-bloco">

            <span class="card-titulo">Estrutura do livro didático</span>

            <span class="card-valor">

                {{ conteudo.area?.nome }}

                <span class="seta">›</span>

                {{ conteudo.assunto?.nome }}

            </span>

        </div>

    </div>

    <div class="info-card">

        <div class="anel-percentual">

            <svg
                viewBox="0 0 92 92"
                width="80"
                height="80"
            >

                <circle
                    class="anel-fundo"
                    cx="46"
                    cy="46"
                    r="38"
                    fill="none"
                    stroke-width="9"
                />

                <circle
                    class="anel-progresso"
                    cx="46"
                    cy="46"
                    r="38"
                    fill="none"
                    stroke-width="9"
                    stroke-linecap="round"
                    :stroke-dasharray="circunferenciaAnel"
                    :stroke-dashoffset="deslocamentoAnel"
                    transform="rotate(-90 46 46)"
                />

            </svg>

            <span class="anel-texto">{{ taxaAcerto }}%</span>

        </div>

        <div class="texto-bloco">

            <span class="card-titulo">Percentual de acertos</span>

            <span class="card-valor card-valor-suave">dos estudantes acertaram</span>

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

    flex-direction:row;

    align-items:center;

    gap:16px;

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda-suave);

    border-radius:14px;

    padding:20px;

    min-width:0;

    box-shadow: var(--sombra-card);

}

.card-icone{

    display:flex;

    align-items:center;

    justify-content:center;

    flex-shrink:0;

    width:64px;

    height:64px;

}

.card-icone img{

    width:64px;

    height:64px;

    object-fit:contain;

}

.card-icone svg{

    width:40px;

    height:40px;

    color:var(--cor-primaria);

}

.texto-bloco{

    display:flex;

    flex-direction:column;

    gap:5px;

    flex:1;

    min-width:0;

}

.card-titulo{

    font-size:14.5px;

    font-weight:700;

    color:var(--cor-texto-principal);

}

.card-valor{

    font-size:13.5px;

    font-weight:400;

    color:var(--cor-texto-secundario);

    line-height:1.4;

}

.card-valor-suave{

    color:var(--cor-texto-suave);

}

.seta{

    color:var(--cor-primaria);

    font-weight:700;

    margin:0 2px;

}

.anel-percentual{

    position:relative;

    flex-shrink:0;

    width:80px;

    height:80px;

    display:flex;

    align-items:center;

    justify-content:center;

}

.anel-fundo{

    stroke:var(--cor-borda-suave);

}

.anel-progresso{

    stroke:var(--cor-primaria);

    transition:stroke-dashoffset .4s ease;

}

.anel-texto{

    position:absolute;

    font-size:16px;

    font-weight:700;

    color:var(--cor-primaria);

}

@media (max-width:1200px){

    .info-card{

        flex-direction:column;

        align-items:flex-start;

        text-align:left;

    }

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

        padding:16px;

    }

    .card-icone,
    .card-icone img{

        width:52px;

        height:52px;

    }

    .card-icone svg{

        width:34px;

        height:34px;

    }

    .anel-percentual,
    .anel-percentual svg{

        width:64px;

        height:64px;

    }

    .anel-texto{

        font-size:14px;

    }

}

</style>
