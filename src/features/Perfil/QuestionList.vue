<template>

    <section class="questoes-painel">

        <div class="tabs">

            <button
                v-for="secao in secoes"
                :key="secao.tipo"
                class="tab"
                :class="{ ativa: abaAtiva === secao.tipo }"
                type="button"
                @click="abaAtiva = secao.tipo"
            >

                <component
                    :is="secao.icone"
                    :size="16"
                />

                {{ secao.titulo }}

            </button>

        </div>

        <div class="painel-corpo">

            <div
                v-if="perfil.carregando && !perfil.carregado"
                class="lista"
            >

                <div
                    v-for="n in 3"
                    :key="n"
                    class="placeholder"
                />

            </div>

            <div
                v-else-if="secaoAtiva.lista.length"
                class="lista"
            >

                <PerfilQuestaoCard
                    v-for="questao in secaoAtiva.lista.slice(0, 6)"
                    :key="questao.id"
                    :id="questao.id"
                />

                <router-link
                    to="/questoes"
                    class="ver-mais"
                    title="Ver mais questões"
                >
                    Ver mais questões
                    <ArrowUpRight :size="16" />
                </router-link>

            </div>

            <div
                v-else
                class="vazio"
            >

                <component
                    :is="secaoAtiva.icone"
                    :size="30"
                />

                <p>{{ secaoAtiva.mensagemVazia }}</p>

                <router-link
                    to="/questoes"
                    class="link-explorar"
                >
                    Explorar questões
                </router-link>

            </div>

        </div>

    </section>

</template>

<script setup>

import { ref, computed } from "vue"

import { ArrowUpRight, Flag, Bookmark, CheckCircle2 } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"
import PerfilQuestaoCard from "@/features/Perfil/PerfilQuestaoCard.vue"

const perfil = usePerfilStore()

const secoes = computed(() => [

    {
        tipo: "revisar",
        titulo: "Para revisar",
        icone: Flag,
        lista: perfil.questoesRevisarLista,
        mensagemVazia: "Nenhuma questão marcada para revisar ainda."
    },
    {
        tipo: "salvas",
        titulo: "Questões salvas",
        icone: Bookmark,
        lista: perfil.questoesSalvasLista,
        mensagemVazia: "Você ainda não salvou nenhuma questão."
    },
    {
        tipo: "resolvidas",
        titulo: "Questões resolvidas",
        icone: CheckCircle2,
        lista: perfil.questoesResolvidasLista,
        mensagemVazia: "Você ainda não resolveu nenhuma questão."
    }

])

const abaAtiva = ref("revisar")

const secaoAtiva = computed(() =>

    secoes.value.find(
        secao => secao.tipo === abaAtiva.value
    )

)

</script>

<style scoped>

.questoes-painel{

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda);

    border-radius:16px;

    overflow:hidden;

}

.tabs{

    display:flex;

    border-bottom:1px solid var(--cor-borda);

    overflow-x:auto;

}

.tab{

    display:flex;

    align-items:center;

    gap:8px;

    flex:1;

    justify-content:center;

    padding:16px 18px;

    border:none;

    border-bottom:2px solid transparent;

    background:transparent;

    color:var(--cor-texto-suave);

    font-size:14px;

    font-weight:600;

    white-space:nowrap;

    cursor:pointer;

    transition:all .2s ease;

}

.tab:hover{

    color:var(--cor-primaria);

    background:var(--cor-fundo-pagina);

}

.tab.ativa{

    color:var(--cor-primaria);

    border-bottom-color:var(--cor-primaria);

    background:var(--cor-primaria-fundo);

}

.painel-corpo{

    padding:22px;

}

.lista{

    display:flex;

    flex-direction:column;

    gap:10px;

    container-type:inline-size;

}

.placeholder{

    min-height:118px;

    border-radius:12px;

    background:linear-gradient(90deg,var(--cor-fundo-sutil) 25%,var(--cor-borda-suave) 37%,var(--cor-fundo-sutil) 63%);
    background-size:400% 100%;

    animation:pulso 1.4s ease infinite;

}

@keyframes pulso{

    0%{ background-position:100% 50%; }
    100%{ background-position:0 50%; }

}

.ver-mais{

    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;

    margin-top:6px;
    padding:12px;

    border-radius:10px;

    color:var(--cor-primaria);

    font-size:13.5px;
    font-weight:600;

    text-decoration:none;

    transition:all .15s ease;

}

.ver-mais:hover{

    background:var(--cor-primaria-fundo);

}

.vazio{

    display:flex;
    flex-direction:column;
    align-items:center;
    gap:10px;

    text-align:center;

    color:var(--cor-texto-fraco);

    font-size:13.5px;

    padding:48px 0;

}

.vazio p{

    margin:0;

}

.link-explorar{

    color:var(--cor-primaria);

    font-weight:600;

    font-size:13.5px;

    text-decoration:none;

}

.link-explorar:hover{

    text-decoration:underline;

}

@media (max-width:640px){

    .tab{

        padding:14px 12px;

        font-size:13px;

    }

    .painel-corpo{

        padding:16px;

    }

}

</style>
