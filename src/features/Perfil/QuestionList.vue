<template>

    <section class="card">

        <div class="header">

            <div class="header-titulo">

                <h2>
                    {{ titulo }}
                </h2>

                <span class="contador">
                    {{ questoes.length }}
                </span>

            </div>

            <router-link
                to="/questoes"
                class="ver-mais"
                title="Ver mais questões"
            >
                <ArrowUpRight :size="16" />
            </router-link>

        </div>

        <div
            v-if="perfil.carregando && !perfil.carregado"
            class="lista"
        >

            <div
                v-for="n in 2"
                :key="n"
                class="placeholder"
            />

        </div>

        <div
            v-else-if="questoes.length"
            class="lista"
        >

            <PerfilQuestaoCard
                v-for="questao in questoes"
                :key="questao.id"
                :questao="questao"
            />

        </div>

        <div
            v-else
            class="vazio"
        >

            <FileQuestion :size="26" />

            <p>Nenhuma questão encontrada.</p>

        </div>

    </section>

</template>

<script setup>

import { computed } from "vue"

import { ArrowUpRight, FileQuestion } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"
import PerfilQuestaoCard from "@/features/Perfil/PerfilQuestaoCard.vue"

const props = defineProps({

    titulo:{
        type:String,
        required:true
    },

    tipo:{
        type:String,
        required:true
    }

})

const perfil = usePerfilStore()

const questoes = computed(() => {

    return props.tipo === "salvas"
        ? perfil.questoesSalvasLista
        : perfil.questoesResolvidasLista

})

</script>

<style scoped>

.card{

    background:#fff;

    border:1px solid #e9ebea;

    border-radius:14px;

    padding:22px;

    box-sizing:border-box;

    display:flex;
    flex-direction:column;

}

.header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:16px;

}

.header-titulo{

    display:flex;
    align-items:center;
    gap:10px;

}

.header h2{

    font-size:16px;

    font-weight:700;

    color:#1f2937;

}

.contador{

    background:#f4f6f5;

    color:#4b5563;

    padding:3px 10px;

    border-radius:999px;

    font-size:12.5px;

    font-weight:600;

}

.ver-mais{

    display:flex;
    align-items:center;
    justify-content:center;

    width:32px;
    height:32px;

    border:1px solid #d6ded9;
    border-radius:50%;

    color:#0d6b4d;
    background:#fff;

    text-decoration:none;
    flex-shrink:0;

    transition:all .15s ease;

}

.ver-mais:hover{

    border-color:#0d6b4d;
    background:#f7faf8;

}

.lista{

    display:flex;

    flex-direction:column;

    gap:10px;

}

.placeholder{

    height:74px;

    border-radius:12px;

    background:linear-gradient(90deg,#f4f6f5 25%,#eef1ef 37%,#f4f6f5 63%);
    background-size:400% 100%;

    animation:pulso 1.4s ease infinite;

}

@keyframes pulso{

    0%{ background-position:100% 50%; }
    100%{ background-position:0 50%; }

}

.vazio{

    display:flex;
    flex-direction:column;
    align-items:center;
    gap:8px;

    text-align:center;

    color:#9aa39d;

    font-size:13.5px;

    padding:36px 0;

}

.vazio p{

    margin:0;

}

</style>
