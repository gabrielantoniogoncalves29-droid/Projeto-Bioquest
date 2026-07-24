<template>

    <section class="stats">

        <div class="stat-card">

            <div class="icon saved">
       <Bookmark :size="28" class="icon saved" />

            </div>

            <div>

                <span class="label">

                    Questões salvas

                </span>

                <h2>

                    {{ perfil.questoesSalvas }}

                </h2>

            </div>

        </div>

        <div class="stat-card">

            <div class="icon solved">

<CircleCheckBig :size="28" class="icon solved" />
            </div>

            <div>

                <span class="label">

                    Questões resolvidas

                </span>

                <h2>

                    {{ perfil.questoesResolvidas }}

                </h2>

            </div>

        </div>

        <div class="stat-card stats-card">

            <div class="progress">

                <svg viewBox="0 0 120 120">

                    <circle
                        class="bg"
                        cx="60"
                        cy="60"
                        r="50"
                    />

                    <circle
                        class="value"
                        cx="60"
                        cy="60"
                        r="50"
                        :stroke-dasharray="circunferencia"
                        :stroke-dashoffset="offset"
                    />

                </svg>

                <span>

                    {{ perfil.porcentagemAcertos }}%

                </span>

            </div>

            <div>

                <span class="label">

                    Taxa de acertos

                </span>

                <p>

                    Estatísticas gerais

                </p>

            </div>

        </div>

    </section>

</template>

<script setup>

import { computed } from "vue"

import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

const raio = 50

const circunferencia = 2 * Math.PI * raio

const offset = computed(() => {

    return circunferencia * (1 - perfil.porcentagemAcertos / 100)

})


import { CircleCheckBig } from "lucide-vue-next"
import { Bookmark } from "lucide-vue-next"

</script>

<style scoped>

.stats{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:24px;

}

.stat-card{

    background:white;

    border-radius:18px;

    padding:24px;

    display:flex;

    align-items:center;

    gap:20px;

    box-shadow:0 6px 18px rgba(0,0,0,.06);

}

.icon{

    width:64px;

    height:64px;

    border-radius:16px;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:28px;

}

.saved{

    background:#EAF7F0;

}

.solved{

    background:#EEF4FF;

}

.label{

    color:#7A7A7A;

    font-size:15px;

}

h2{

    margin-top:8px;

    font-size:34px;

    color:#20352A;

}

.stats-card{

    justify-content:space-between;

}

.progress{

    position:relative;

    width:100px;

    height:100px;

}

.progress svg{

    width:100%;

    transform:rotate(-90deg);

}

.bg{

    fill:none;

    stroke:#E6E6E6;

    stroke-width:10;

}

.value{

    fill:none;

    stroke:#2E8B57;

    stroke-width:10;

    stroke-linecap:round;

}

.progress span{

    position:absolute;

    inset:0;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:20px;

    font-weight:700;

    color:#20352A;

}

p{

    color:#888;

    margin-top:6px;

}

@media(max-width:1100px){

    .stats{

        grid-template-columns:1fr;

    }

}

</style>