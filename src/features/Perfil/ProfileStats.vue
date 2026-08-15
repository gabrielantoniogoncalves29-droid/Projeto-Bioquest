<template>

    <section class="stats-section">

        <div class="section-header">

            <h2>Estatísticas</h2>

            <router-link
                to="/estatisticas"
                class="ver-mais"
                title="Ver mais estatísticas"
            >
                <ArrowUpRight :size="16" />
            </router-link>

        </div>

        <div
            v-if="perfil.carregando && !perfil.carregado"
            class="stats skeleton"
        >

            <div
                v-for="n in 3"
                :key="n"
                class="stat-card placeholder"
            />

        </div>

        <div
            v-else
            class="stats"
        >

            <div class="stat-card">

                <div class="icon saved">
                    <Bookmark :size="22" />
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
                    <CircleCheckBig :size="22" />
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

        </div>

    </section>

</template>

<script setup>

import { computed } from "vue"

import { usePerfilStore } from "@/store/perfil"
import { CircleCheckBig, Bookmark, ArrowUpRight } from "lucide-vue-next"

const perfil = usePerfilStore()

const raio = 50

const circunferencia = 2 * Math.PI * raio

const percentualExibido = computed(() => {

    return Math.min(100, Math.max(0, perfil.porcentagemAcertos))

})

const offset = computed(() => {

    return circunferencia * (1 - percentualExibido.value / 100)

})

</script>

<style scoped>

.stats-section{

    display:flex;
    flex-direction:column;
    gap:14px;

}

.section-header{

    display:flex;
    align-items:center;
    justify-content:space-between;

}

.section-header h2{

    font-size:17px;
    font-weight:700;
    color:#1f2937;

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

    transition:all .15s ease;

}

.ver-mais:hover{

    border-color:#0d6b4d;
    background:#f7faf8;

}

.stats{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:16px;

}

.stat-card{

    background:#fff;

    border:1px solid #e9ebea;

    border-radius:14px;

    padding:20px;

    display:flex;

    align-items:center;

    gap:16px;

}

.placeholder{

    height:88px;

    background:linear-gradient(90deg,#f4f6f5 25%,#eef1ef 37%,#f4f6f5 63%);
    background-size:400% 100%;

    animation:pulso 1.4s ease infinite;

}

@keyframes pulso{

    0%{ background-position:100% 50%; }
    100%{ background-position:0 50%; }

}

.icon{

    width:44px;

    height:44px;

    border-radius:10px;

    display:flex;

    justify-content:center;

    align-items:center;

    flex-shrink:0;

}

.icon.saved{

    background:#EAF7F0;
    color:#1E7A49;

}

.icon.solved{

    background:#EEF4FF;
    color:#2f5fd6;

}

.label{

    color:#7A7A7A;

    font-size:13px;

}

h2{

    margin-top:4px;

    font-size:26px;
    font-weight:700;

    color:#1f2937;

}

.stats-card{

    justify-content:space-between;

}

.progress{

    position:relative;

    width:72px;

    height:72px;

    flex-shrink:0;

}

.progress svg{

    width:100%;

    transform:rotate(-90deg);

}

.bg{

    fill:none;

    stroke:#eef0ef;

    stroke-width:9;

}

.value{

    fill:none;

    stroke:#0d6b4d;

    stroke-width:9;

    stroke-linecap:round;

    transition:stroke-dashoffset .6s ease;

}

.progress span{

    position:absolute;

    inset:0;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:15px;

    font-weight:700;

    color:#1f2937;

}

.stats-card > div:last-child{

    text-align:right;

}

p{

    color:#9aa0a6;

    font-size:12.5px;

    margin-top:2px;

}

@media(max-width:900px){

    .stats{

        grid-template-columns:1fr;

    }

    .stats-card{

        justify-content:flex-start;

    }

    .stats-card > div:last-child{

        text-align:left;

    }

}

</style>
