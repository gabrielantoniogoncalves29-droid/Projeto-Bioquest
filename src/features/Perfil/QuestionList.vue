<template>

    <section class="card">

        <div class="header">

            <h2>

                {{ titulo }}

            </h2>

            <span class="contador">

                {{ questoes.length }}

            </span>

        </div>

        <div
            v-if="questoes.length"
            class="lista"
        >

            <div
                v-for="questao in questoes"
                :key="questao.id"
                class="item"
            >

                <div class="informacoes">

                    <span class="numero">

                        Questão {{ questao.numeroQuestao }}

                    </span>

                    <span class="ano">

                        ENEM {{ questao.ano }}

                    </span>

                    <span class="conteudo">

                        {{ questao.subconteudo }}

                    </span>

                </div>

                <button class="abrir">

                    Abrir

                </button>

            </div>

        </div>

        <div
            v-else
            class="vazio"
        >

            Nenhuma questão encontrada.

        </div>

    </section>

</template>

<script setup>

import { computed } from "vue"

import { usePerfilStore } from "@/store/perfil"

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

    border:1px solid #e7ece9;

    border-radius:12px;

    padding:22px;

    box-sizing:border-box;

}

.header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:20px;

}

.header h2{

    font-size:19px;

    font-weight:700;

    color:#1f2937;

}

.contador{

    background:#e8f6ef;

    color:#0d6b4d;

    padding:5px 12px;

    border-radius:999px;

    font-size:13px;

    font-weight:700;

}

.lista{

    display:flex;

    flex-direction:column;

    gap:14px;

}

.item{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:16px 18px;

    background:#fff;

    border:1px solid #e7ece9;

    border-radius:12px;

    transition:all .25s ease;

}

.item:hover{

    transform:translateY(-2px);

    box-shadow:0 8px 24px rgba(0,0,0,.06);

}

.informacoes{

    display:flex;

    flex-direction:column;

    gap:6px;

}

.numero{

    font-size:14.5px;

    font-weight:700;

    color:#1f2937;

}

.ano{

    color:#6b7280;

    font-size:13px;

    font-weight:500;

}

.conteudo{

    color:#1f6f5c;

    font-size:13px;

    font-weight:500;

}

.abrir{

    display:flex;

    align-items:center;

    justify-content:center;

    height:38px;

    padding:0 18px;

    flex-shrink:0;

    margin-left:16px;

    color:#0d6b4d;

    background:#fff;

    border:1px solid #0d6b4d;

    border-radius:9px;

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    transition:all .2s ease;

}

.abrir:hover{

    background:#0d6b4d;

    color:#fff;

}

.vazio{

    text-align:center;

    color:#6b7280;

    font-size:14px;

    padding:40px 0;

}

@media (max-width:768px){

    .item{

        flex-direction:column;

        align-items:flex-start;

        gap:14px;

    }

    .abrir{

        width:100%;

        margin-left:0;

    }

}

</style>