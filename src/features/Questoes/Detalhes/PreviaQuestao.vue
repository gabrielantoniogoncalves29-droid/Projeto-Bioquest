<script setup>

import { ref, computed } from 'vue'
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({

    questao: {
        type: Object,
        default: null
    }

})

const expandido = ref(false)

const alternativas = computed(() =>

    props.questao?.alternativas ?? []

)

</script>

<template>

<div
    v-if="questao"
    class="previa"
>

    <div class="previa-header">

        <h2>Prévia da questão</h2>

        <button
            class="btn-expandir"
            type="button"
            @click="expandido = !expandido"
        >

            {{ expandido ? 'Mostrar menos' : 'Ver questão completa' }}

            <ChevronUp v-if="expandido" :size="16" />
            <ChevronDown v-else :size="16" />

        </button>

    </div>

    <p
        class="texto-principal"
        :class="{ clamp: !expandido }"
    >
        {{ questao.enunciado?.textoPrincipal }}
    </p>

    <p
        v-if="expandido && questao.enunciado?.textoComplementar"
        class="texto-complementar"
    >
        {{ questao.enunciado.textoComplementar }}
    </p>

    <ul
        v-if="expandido"
        class="alternativas"
    >

        <li
            v-for="alternativa in alternativas"
            :key="alternativa.letra"
            :class="{ correta: alternativa.letra === questao.resposta }"
        >

            <span class="letra">{{ alternativa.letra }}</span>

            <span class="texto">{{ alternativa.texto }}</span>

            <CheckCircle2
                v-if="alternativa.letra === questao.resposta"
                :size="18"
                class="check"
            />

        </li>

    </ul>

</div>

</template>

<style scoped>

.previa{

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda-suave);

    border-radius:16px;

    padding:28px 32px;

    box-shadow: var(--sombra-card);

}

.previa-header{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:12px;

    margin-bottom:20px;

}

.previa-header h2{

    margin:0;

    font-size:17px;

    font-weight:700;

    color:var(--cor-texto-principal);

}

.btn-expandir{

    display:flex;

    align-items:center;

    gap:6px;

    flex-shrink:0;

    border:none;

    border-radius:8px;

    background: none;

    color:var(--cor-primaria);

    font-size:13px;

    font-weight:600;

    padding:7px 12px;

    cursor:pointer;

    white-space:nowrap;
    animation: 1s ease 0s 1 normal none running fadeIn;
    transition:all .15s ease;

}

.btn-expandir:hover{

transform: translateY(-2px);

}

[data-tema="escuro"] .btn-expandir{

    color:var(--cor-texto-principal);

}

.texto-principal{

    margin:0 0 16px;

    font-size:14.5px;

    line-height:1.75;

    color:var(--cor-texto-secundario);

}

.texto-principal.clamp{

    display:-webkit-box;

    -webkit-box-orient:vertical;

    -webkit-line-clamp:3;

    overflow:hidden;

}

.texto-complementar{

    margin:0 0 20px;

    font-size:14.5px;

    line-height:1.7;

    font-weight:600;

    color:var(--cor-texto-principal);

}

.alternativas{

    list-style:none;

    margin:0;

    padding:0;

    display:flex;

    flex-direction:column;

    gap:12px;

}

.alternativas li{

    display:flex;

    align-items:flex-start;

    gap:14px;

    padding:16px 18px;

    border:1px solid var(--cor-borda-suave);

    border-radius:12px;

    font-size:14px;

    color:var(--cor-texto-secundario);

    line-height:1.5;

    transition:border-color .2s ease, box-shadow .2s ease;

}

.alternativas li:hover{

    border-color:var(--cor-borda);

}

.alternativas li.correta{

    background:var(--cor-primaria-fundo);

    border-color:var(--cor-primaria-translucida-fraca);

    color:var(--cor-texto-principal);

    font-weight:600;

}

.letra{

    display:flex;

    align-items:center;

    justify-content:center;

    width:24px;

    height:24px;

    min-width:24px;

    border-radius:50%;

    background:var(--cor-fundo-sutil);

    color:var(--cor-texto-secundario);

    font-size:12.5px;

    font-weight:700;

}

.correta .letra{

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

}

.texto{

    flex:1;

}

.check{

    flex-shrink:0;

    color:var(--cor-primaria);

    margin-top:2px;

}

@media (max-width:600px){

    .previa{

        padding:18px 16px;

    }

    .previa-header{

        flex-wrap:wrap;

    }

}

</style>
