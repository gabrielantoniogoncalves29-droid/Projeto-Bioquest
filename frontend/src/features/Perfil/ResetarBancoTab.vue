<template>

    <div class="reset">

        <header class="topo">
            <h2>Resetar dados de estudo</h2>
            <p>
                Zere seu histórico quando quiser recomeçar.
                Essas ações são permanentes e não podem ser desfeitas.
            </p>
        </header>

        <div class="grade">

            <article
                v-for="item in itens"
                :key="item.id"
                class="item"
                :class="`tom-${item.tom}`"
            >


                <div class="item-numero">
                    <strong>{{ item.total }}</strong>
                    
                    <span>{{ item.legenda }}</span>
                </div>

                <p class="item-descricao">
                    {{ item.descricao }}
                </p>

                <button
                    type="button"
                    class="btn-zerar"
                    :disabled="!item.total"
                    @click="pedirConfirmacao(item)"
                >
                    <RotateCcw :size="15" />
                    {{ item.rotuloBotao }}
                </button>

            </article>

        </div>

        <article class="excluir">

            <div class="excluir-icone">
                <Trash2 :size="22" />
            </div>

            <div class="excluir-texto">

                <h3>Excluir conta</h3>

                <p>
                    Apaga permanentemente sua conta e todos os dados
                    armazenados (perfil, questões salvas, resolvidas e
                    marcadas para revisar), conforme previsto na LGPD.
                    Essa ação não pode ser desfeita.
                </p>

            </div>

            <button
                type="button"
                class="btn-excluir"
                @click="perfil.abrirExclusaoConta()"
            >
                <Trash2 :size="15" />
                Excluir conta
            </button>

        </article>

    <ConfirmarResetModal
        v-if="alvo"
        :titulo="`Zerar ${alvo.tituloCurto}?`"
        :descricao="alvo.confirmacao"
        :carregando="executando"
        :erro="erro"
        @cancelar="cancelar"
        @confirmar="confirmar"
    />

    <ExcluirContaModal v-if="perfil.excluindoContaConfirmacao" />

    </div>

</template>

<script setup>

import { ref, computed } from "vue"
import { CheckCircle2, Bookmark, Flag, RotateCcw, Trash2 } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"
import ConfirmarResetModal from "@/features/Perfil/ConfirmarResetModal.vue"
import ExcluirContaModal from "@/features/Perfil/ExcluirContaModal.vue"

const perfil = usePerfilStore()

const alvo = ref(null)
const executando = ref(false)
const erro = ref("")

const itens = computed(() => [

    {
        id: "resolvidas",
        tom: "verde",
        legenda: "Questões respondidas",
        tituloCurto: "questões respondidas",
        rotuloBotao: "Zerar respondidas",
        descricao: "Remove o histórico de questões respondidas e zera seu percentual de acertos.",
        confirmacao: "Todo o seu histórico de questões respondidas será apagado e o percentual de acertos voltará a zero.",
        icone: CheckCircle2,
        total: perfil.totalResolvidas,
        acao: () => perfil.resetarResolvidas()
    },

    {
        id: "salvas",
        tom: "azul",
        legenda: "Questões salvas",
        tituloCurto: "questões salvas",
        rotuloBotao: "Zerar salvas",
        descricao: "Remove todas as questões que você salvou para estudar depois.",
        confirmacao: "Todas as questões salvas serão removidas da sua lista.",
        icone: Bookmark,
        total: perfil.totalSalvas,
        acao: () => perfil.resetarSalvas()
    },

    {
        id: "revisar",
        tom: "amarelo",
        legenda: "Questões para revisar",
        tituloCurto: "questões para revisar",
        rotuloBotao: "Zerar para revisar",
        descricao: "Remove a marcação de revisão de todas as questões.",
        confirmacao: "Todas as marcações de “para revisar” serão removidas.",
        icone: Flag,
        total: perfil.totalRevisar,
        acao: () => perfil.resetarRevisar()
    }

])

function pedirConfirmacao(item) {

    erro.value = ""

    alvo.value = item

}

function cancelar() {

    if (executando.value) return

    alvo.value = null

}

async function confirmar() {

    if (!alvo.value) return

    executando.value = true
    erro.value = ""

    try {

        await alvo.value.acao()

        alvo.value = null

    } catch {

        erro.value = "Não foi possível zerar agora. Tente novamente."

    } finally {

        executando.value = false

    }

}

</script>

<style scoped>

.reset{
    width:100%;
    display:flex;
    flex-direction:column;
    gap:24px;
}

.topo h2{
    margin:0 0 4px;
    font-size:17px;
    font-weight:700;
    color:var(--cor-texto-principal);
}

.topo p{
    margin:0;
    font-size:13.5px;
    line-height:1.6;
    color:var(--cor-texto-suave);
}

/* três cards lado a lado */
.grade{
    display:grid;
    grid-template-columns:repeat(3, minmax(0, 1fr));
    gap:16px;
}

.item{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:14px;
    padding:24px;
    border:1px solid var(--cor-borda);
    border-radius:16px;
    background:var(--cor-fundo-card);
    transition:border-color .2s ease, box-shadow .2s ease;
}

.item:hover{
    box-shadow:0 10px 26px rgba(0,0,0,.05);
}

.item-icone{
    display:flex;
    align-items:center;
    justify-content:center;
    width:46px;
    height:46px;
    border-radius:12px;
}

.tom-verde .item-icone{
    background:var(--cor-primaria-fundo);
    color:var(--cor-primaria);
}

.tom-azul .item-icone{
    background:var(--cor-acento-azul-fundo);
    color:var(--cor-acento-azul);
}

.tom-amarelo .item-icone{
    background:var(--cor-acento-amarelo-fundo);
    color:var(--cor-acento-amarelo);
}

.item-numero{
    display:flex;
    flex-direction:row;
    gap:8px;
    text-align:center;
    align-items:center;
}

.item-numero strong{
    font-size:30px;
    font-weight:700;
    line-height:1.1;
    color:var(--cor-texto-principal);
}

.item-numero span{
    font-size:14px;
    font-weight:600;
    color:var(--cor-texto-secundario);
}

.item-descricao{
    flex:1;
    margin:0;
    font-size:13.5px;
    line-height:1.6;
    color:var(--cor-texto-suave);
}

.btn-zerar{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:7px;
    width:100%;
    height:42px;
    border-radius:10px;
    border:1px solid var(--cor-borda);
    background:var(--cor-fundo-card);
    color:var(--cor-texto-secundario);
    font-size:13.5px;
    font-weight:600;
    cursor:pointer;
    transition:.15s;
}

.btn-zerar:hover:not(:disabled){
    color:var(--cor-perigo);
    border-color:var(--cor-perigo);
    background:var(--cor-perigo-fundo);
}

.btn-zerar:disabled{
    opacity:.5;
    cursor:not-allowed;
}

/* excluir conta */
.excluir{
    display:flex;
    align-items:center;
    gap:20px;
    padding:22px 24px;
    border:1px solid var(--cor-perigo);
    border-radius:16px;
    background:var(--cor-fundo-card);
}

.excluir-icone{
    display:flex;
    align-items:center;
    justify-content:center;
    width:46px;
    height:46px;
    flex-shrink:0;
    border-radius:12px;
    background:var(--cor-perigo-fundo);
    color:var(--cor-perigo);
}

.excluir-texto{
    flex:1;
    min-width:0;
}

.excluir-texto h3{
    margin:0 0 4px;
    font-size:16px;
    font-weight:700;
    color:var(--cor-texto-principal);
}

.excluir-texto p{
    margin:0;
    max-width:760px;
    font-size:13.5px;
    line-height:1.6;
    color:var(--cor-texto-suave);
}

.btn-excluir{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:7px;
    flex-shrink:0;
    height:42px;
    padding:0 20px;
    border:none;
    border-radius:10px;
    background:var(--cor-perigo);
    color:var(--cor-texto-invertido);
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    white-space:nowrap;
    transition:opacity .2s;
}

.btn-excluir:hover{
    opacity:.9;
}

@media (max-width:1024px){

    .grade{
        grid-template-columns:1fr;
    }

    .item{
        flex-direction:row;
        flex-wrap:wrap;
        align-items:center;
    }

    .item-numero{
        flex:1;
    }

    .item-descricao{
        flex-basis:100%;
        order:3;
    }

    .btn-zerar{
        order:4;
    }

}

@media (max-width:640px){

    .excluir{
        flex-direction:column;
        align-items:flex-start;
    }

    .btn-excluir{
        width:100%;
    }

}

</style>
