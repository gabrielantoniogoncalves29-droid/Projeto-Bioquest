<template>
    <div class="card">

        <div class="icon-container">

            <MailCheck
                :size="80"
                class="mail-icon"
            />

        </div>

      

        <h2>Confirme seu e-mail</h2>

        <p class="description">
            Sua conta foi criada com sucesso.
        </p>

        <p v-if="auth.emailEnviado" class="description">
            Enviamos um e-mail de confirmação para:
        </p>

        <p v-else class="description">
            Envie o link de confirmação para:
        </p>

        <div class="email">

            {{ auth.emailCadastro }}

        </div>

        <p class="description small">
            Clique no link enviado para ativar sua conta.
            Caso não encontre o e-mail, verifique a caixa de spam.
        </p>

        <p
            v-if="mensagem"
            class="mensagem"
            :class="mensagemErro ? 'erro' : 'sucesso'"
            role="alert"
        >
            {{ mensagem }}
        </p>

        <button
            type="button"
            class="primary-button"
            :disabled="enviando || restante > 0"
            @click="reenviarEmail"
        >
            {{ enviando ? "Enviando..." : restante > 0 ? `Reenviar em ${restante}s` : auth.emailEnviado ? "Reenviar e-mail" : "Enviar e-mail" }}
        </button>

        <button
            type="button"
            class="secondary-button"
            @click="auth.login()"
        >
            ← Voltar ao Login
        </button>

    </div>
</template>

<script setup>

import { ref } from "vue"

import { MailCheck } from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"

import { reenviarConfirmacao } from "@/services/auth"

import { mensagemDeErro } from "@/services/api"

import { useContagemRegressiva } from "@/utils/contagem"

const auth = useAuthStore()

const enviando = ref(false)
const mensagem = ref("")
const mensagemErro = ref(false)

const { restante, iniciar } = useContagemRegressiva(60)

async function reenviarEmail(){

    if (enviando.value || restante.value > 0) return

    enviando.value = true
    mensagem.value = ""

    try {

        const resposta = await reenviarConfirmacao(auth.emailCadastro)

        mensagemErro.value = false

        mensagem.value = resposta.mensagem

        iniciar()

    } catch (falha) {

        mensagemErro.value = true

        mensagem.value = mensagemDeErro(falha, "Não foi possível reenviar o e-mail agora.")

    } finally {

        enviando.value = false

    }

}

</script>

<style scoped>

.card{

    width:100%;
    max-width:430px;
    max-height:min(480px, calc(100vh - 140px));
    overflow-y:auto;
    padding:32px;

    background:var(--cor-fundo-card-vidro);

    border-radius:18px;

    border-radius:18px;

    box-shadow:var(--sombra-modal);

    backdrop-filter:blur(8px);

    box-sizing:border-box;

    text-align:center;

}

.icon-container{

    display:flex;

    justify-content:center;

    margin-bottom:16px;

}

.mail-icon{

    color:var(--cor-primaria);

    animation:pop .45s ease;

}

@keyframes pop{

    0%{

        transform:scale(.7);

        opacity:0;

    }

    70%{

        transform:scale(1.08);

    }

    100%{

        transform:scale(1);

        opacity:1;

    }

}

h1{

    margin:0;

    font-size:44px;

    font-weight:700;

    color:var(--cor-primaria-texto);

}

h2{

    margin:8px 0 18px;

    font-size:20px;

    font-weight:500;

    color:var(--cor-texto-suave);

}

.description{

    color:var(--cor-texto-suave);

    font-size:14px;

    line-height:1.55;

    margin-bottom:12px;

}

.description.small{

    margin:16px 0 24px;

    font-size:13px;

    color:var(--cor-texto-fraco);

}

.email{

    margin:18px 0;

    padding:12px 16px;

    border-radius:10px;

    background:var(--cor-fundo-sutil);

    border:1px solid var(--cor-borda);

    color:var(--cor-primaria-texto);

    font-size:15px;

    font-weight:600;

    word-break:break-word;

}

.primary-button{

    width:100%;

    flex-shrink:0;

    height:46px;

    border:none;

    border-radius:10px;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:
        background .25s,
        transform .2s;

}

.primary-button:hover{

    background:var(--cor-primaria);

    transform:translateY(-2px);

}

.primary-button:active{

    transform:translateY(0);

}

.secondary-button{

    width:100%;

    flex-shrink:0;

    margin-top:12px;

    border:none;

    background:none;

    color:var(--cor-primaria);

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.secondary-button:hover{

    text-decoration:underline;

}


.card::-webkit-scrollbar{
    width:6px;
}

.card::-webkit-scrollbar-track{
    background:transparent;
}

.card::-webkit-scrollbar-thumb{
    background:var(--cor-primaria-translucida);
    border-radius:999px;
}

.card::-webkit-scrollbar-thumb:hover{
    background:var(--cor-primaria-translucida-forte);
}

[data-tema="escuro"] .secondary-button{
    color:var(--cor-primaria-texto);
}

.primary-button:disabled{

    opacity:.6;

    cursor:not-allowed;

}

.mensagem{

    margin:0 0 12px;

    font-size:13px;

    line-height:1.4;

}

.mensagem.erro{

    color:var(--cor-erro);

}

.mensagem.sucesso{

    color:var(--cor-acerto);

}

.primary-button:focus-visible,
.secondary-button:focus-visible,
.continue-button:focus-visible,
.back-button:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:2px;

}

</style>