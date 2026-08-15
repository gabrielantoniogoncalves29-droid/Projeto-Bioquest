<script setup>

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useResolverStore } from '@/store/resolver/resolver'
import { useDetalhesStore } from '@/store/resolver/detalhes'
import { useUiStore } from '@/store/resolver/ui'

const resolver = useResolverStore()
const detalhesStore = useDetalhesStore()
const painel = useUiStore()

const { aberto } = storeToRefs(painel)
const { questao } = storeToRefs(resolver)
const { detalheAtual: detalhes } = storeToRefs(detalhesStore)

const copiado = ref(false)
const linkQuestao = ref(window.location.href)
const objetosEnem = {

    1:"Moléculas, células e tecidos",
    2:"Hereditariedade e diversidade da vida",
    3:"Identidade dos seres vivos",
    4:"Ecologia e ciências ambientais",
    5:"Origem e evolução da vida",
    6:"Qualidade de vida das populações humanas"

}

const nomeObjeto = computed(()=>

    objetosEnem[
        detalhes.value?.objeto?.id
    ] ?? "Não informado"

)

const imagemObjeto = computed(()=>{

    const id = detalhes.value?.objeto?.id

    if(!id)
        return ''

    return new URL(

        `../icons/objeto${id}.png`,

        import.meta.url

    ).href

})

const conteudo = computed(()=>

    detalhes.value?.conteudo ?? {}

)

const imagemConteudo = computed(()=>{

    const icone = conteudo.value?.area?.icone

    if(!icone)
        return ''

    return new URL(

        `../icons/${icone}.png`,

        import.meta.url

    ).href

})

const nivel = computed(()=>

    detalhes.value?.nivel ?? 'Não informado'

)

const taxaAcerto = computed(()=>

    detalhes.value?.taxaAcerto ?? 0

)

const tituloProva = computed(()=>

    `${detalhes.value?.banca ?? ''} ${detalhes.value?.ano ?? ''}`

)

const subtituloProva = computed(()=>

    detalhes.value?.prova ?? ''

)

const numeroQuestao = computed(()=>

    detalhes.value?.numeroQuestao ?? ''

)

async function copiarLink(){

    await navigator.clipboard.writeText(
        window.location.href
    )

    copiado.value = true

    setTimeout(()=>{

        copiado.value = false

    },2000)

}

</script>

<template>

<div
    class="barra-lateral"
    :class="{ fechado: !aberto }"
>

<div
    v-show="aberto"
    class="painel"
>


<div class="secao prova">

    <span class="tipo">{{  subtituloProva }}</span>

    <span class="separador-ponto">·</span>

    <span class="numero">Questão {{ numeroQuestao }}</span>

    <h2>{{ tituloProva }}</h2>

</div>


<div class="secao central">

    <div class="icone-caixa">

        <img

            v-if="imagemObjeto"

            :src="imagemObjeto"

            alt=""

        >

    </div>

    <div class="texto-bloco">

        <div class="titulo-card">Objeto de conhecimento</div>

        <div class="valor-card">{{ nomeObjeto }}</div>

    </div>

</div>


<div class="secao central">

    <div class="icone-caixa">

        <img

            v-if="imagemConteudo"

            :src="imagemConteudo"

            alt=""

        >

    </div>

    <div class="texto-bloco">

        <div class="titulo-card">Conteúdo</div>

        <div class="valor-card">

            {{ conteudo.area?.nome }}

            <span class="seta">›</span>

            {{ conteudo.assunto?.nome }}

        </div>

    </div>

</div>


<div class="secao central">

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

        <div class="titulo-card">Nível da questão</div>

        <div class="valor-card">{{ nivel }}</div>

    </div>

</div>



<div class="secao central">

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

        <div class="titulo-card">Percentual de acertos</div>

        <div class="valor-card">

            <strong class="percentual-numero">{{ taxaAcerto }}%</strong>

            dos estudantes acertaram

        </div>

        <div class="barra">

            <div

                class="preenchimento"

                :style="{ width: taxaAcerto + '%' }"

            ></div>

        </div>

    </div>

</div>


<div class="secao sem-borda link-final">

    <div class="rotulo">Link da questão</div>

    <div class="link-container">

        <input

            class="input-link"

            type="text"

            :value="linkQuestao"

            readonly

        >

        <button

            class="botao-copiar"

            :class="{ copiado }"

            @click="copiarLink"

        >

            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >

                <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12z" fill="currentColor" stroke="none"/>

                <rect x="8" y="7" width="14" height="16" rx="2"/>

            </svg>

            {{ copiado ? 'Copiado' : 'Copiar' }}

        </button>

    </div>

</div>

</div>

</div>

</template>


<style scoped>

.barra-lateral{

    width:380px;
    height:100%;

    background:#fff;

    border-left:1px solid #e9edf2;

    transition:width .35s ease;

    overflow:hidden;

}

.barra-lateral.fechado{

    width:55px;

}

.painel{

    height:100%;

    overflow-y:auto;

    padding:24px 22px;

    display:flex;

    flex-direction:column;

}


.secao{

    padding:18px 0;

    border-bottom:1px solid #eef1f4d1;

}

.secao.sem-borda{

    border-bottom:none;

}

.link-final{

    margin-top:auto;

}

.rotulo{

    margin-bottom:10px;

    font-size:15px;

    color:#7a828b;

}


.prova{

    padding-top:0;

    display:flex;

    flex-wrap:wrap;

    align-items:baseline;

    gap:6px;

    padding-left:22px;

}

.prova .tipo{

    font-size:13px;

    font-weight:600;

    color:#0d6b4d;

}

.prova .separador-ponto{

    color:#c3cbd3;

    font-size:13px;

}

.prova .numero{

    font-size:13px;

    color:#8a94a1;

}

.prova h2{

    width:100%;

    margin:2px 0 0;

    font-size:19px;

    font-weight:600;

    color:#1f2937;

    line-height:1.3;

}


.secao.central{

    display:flex;

    align-items:center;

    gap:16px;

    padding-left:10px;

    padding-right:10px;

}

.icone-caixa{

    display:flex;

    align-items:center;

    justify-content:center;

    flex-shrink:0;

}

.icone-caixa img{

    width:60px;

    height:60px;

    object-fit:contain;

}

.icone-caixa svg{

    color:#0d6b4d;

}

.icone-nivel svg{

    width:26px;

    height:26px;

}

.texto-bloco{

    display:flex;

    flex-direction:column;

    justify-content:center;

    gap:4px;

    flex:1;

    min-width:0;

}

.titulo-card{

    font-size:15px;

    font-weight:700;

    color:#1f2937;

}

.valor-card{

    font-size:14px;

    color:#6b7280;

    display:flex;

    align-items:center;

    gap:6px;

    flex-wrap:wrap;

}

.valor-card .seta{

    color:#0d6b4d;

    font-weight:600;

}


.percentual-numero{

    font-size:15px;

    font-weight:700;

    color:#1f2937;

}

.barra{

    width:100%;

    max-width:180px;

    height:6px;

    margin-top:8px;

    background:#eef1f4;

    border-radius:999px;

    overflow:hidden;

}

.preenchimento{

    height:100%;

    border-radius:999px;

    background:#0d6b4d;

    transition:width .45s ease;

}


.link-container{

    display:flex;
    align-items:center;

    gap:8px;

}

.input-link{

    flex:1;

    min-width:0;

    height:38px;

    padding:0 10px;

    border:1px solid #e2e8f0;

    border-radius:8px;

    background:#f8fafc;

    color:#64748b;

    font-size:13px;

    outline:none;

}

.input-link:focus{

    border-color:#0d6b4d;

}

.botao-copiar{

    display:flex;

    align-items:center;

    justify-content:center;

    gap:6px;

    height:38px;

    padding:0 12px;

    border:1px solid transparent;

    border-radius:8px;

    background:#0d6b4d;

    color:#fff;

    cursor:pointer;

    font-size:13px;

    font-weight:600;

    white-space:nowrap;

    transition:background .2s ease, color .2s ease, border-color .2s ease;

}

.botao-copiar:hover{

    background:#fff;

    color:#0d6b4d;

    border-color:#0d6b4d;

}

.botao-copiar.copiado{

    background:#0d6b4d;

    color:#fff;

    border-color:transparent;

}


.painel::-webkit-scrollbar{

    width:6px;

}

.painel::-webkit-scrollbar-track{

    background:transparent;

}

.painel::-webkit-scrollbar-thumb{

    background:#cfd8df;

    border-radius:999px;

}

.painel::-webkit-scrollbar-thumb:hover{

    background:#b9c4cd;

}


@media (max-width:1200px){

    .barra-lateral{

        width:290px;

    }

}

@media (max-width:900px){

    .barra-lateral{

        width:100%;

        border-left:none;

        border-top:1px solid #e9edf2;

    }

}

@media (max-width:480px){

    .painel{

        padding:18px 16px;

    }

    .prova{

        padding-left:0;

    }

    .link-container{
        
        flex-direction:column;

        align-items:stretch;

    }

    .botao-copiar{

        width:100%;

    }

}

</style>