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

    background:white;

    border-radius:18px;

    padding:24px;

    box-shadow:0 6px 18px rgba(0,0,0,.06);

}

.header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:24px;

}

.header h2{

    font-size:22px;

    color:#20352A;

}

.contador{

    background:#EEF7F2;

    color:#2E8B57;

    padding:6px 12px;

    border-radius:20px;

    font-weight:600;

}

.lista{

    display:flex;

    flex-direction:column;

    gap:16px;

}

.item{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:16px;

    border:1px solid #ECECEC;

    border-radius:12px;

    transition:.2s;

}

.item:hover{

    border-color:#2E8B57;

    transform:translateY(-2px);

}

.informacoes{

    display:flex;

    flex-direction:column;

    gap:6px;

}

.numero{

    font-weight:700;

    color:#20352A;

}

.ano{

    color:#777;

    font-size:14px;

}

.conteudo{

    color:#2E8B57;

    font-size:14px;

}

.abrir{

    border:none;

    background:#2E8B57;

    color:white;

    padding:10px 18px;

    border-radius:10px;

    cursor:pointer;

    transition:.2s;

}

.abrir:hover{

    background:#256F46;

}

.vazio{

    text-align:center;

    color:#888;

    padding:40px 0;

}

</style>
