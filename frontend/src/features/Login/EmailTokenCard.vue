<template>
    <div class="card">

        <div class="icon-container">

            <Loader2
                v-if="estado === 'carregando'"
                :size="80"
                class="mail-icon girando"
            />

            <MailCheck
                v-else-if="estado === 'sucesso'"
                :size="80"
                class="mail-icon"
            />

            <MailX
                v-else
                :size="80"
                class="mail-icon falha"
            />

        </div>

        <h2>{{ titulo }}</h2>

        <p
            class="description"
            role="status"
        >
            {{ mensagem }}
        </p>

        <button
            v-if="estado !== 'carregando'"
            type="button"
            class="primary-button"
            @click="irParaLogin"
        >
            {{ auth.autenticado && estado === 'sucesso' ? "Continuar" : "Ir para o login" }}
        </button>

    </div>
</template>

<script setup>

import { ref, computed, watch } from "vue"

import { useRouter } from "vue-router"

import { MailCheck, MailX, Loader2 } from "lucide-vue-next"

import { useAuthStore, ETAPAS } from "@/store/auth"

import { usePerfilStore } from "@/store/perfil"

import { confirmarEmailComToken } from "@/services/auth"

import { mensagemDeErro } from "@/services/api"

const auth = useAuthStore()

const perfil = usePerfilStore()

const router = useRouter()

const estado = ref("carregando")
const mensagem = ref("Confirmando seu e-mail...")

const titulo = computed(() => ({
    carregando: "Confirmando e-mail",
    sucesso: "E-mail confirmado",
    erro: "Não foi possível confirmar"
}[estado.value]))

let processado = null

async function confirmar(token) {

    if (!token) {

        estado.value = "erro"

        mensagem.value = "Link inválido ou expirado. Entre com seu e-mail e senha para receber um novo link de confirmação."

        return

    }

    estado.value = "carregando"
    mensagem.value = "Confirmando seu e-mail..."

    try {

        const resultado = await confirmarEmailComToken(token)

        estado.value = "sucesso"

        if (resultado.tipo === "alterar_email") {

            mensagem.value = `Seu novo e-mail foi confirmado: ${resultado.email}. Use-o para entrar.`

            if (auth.autenticado) {

                auth.atualizarUsuario({ email: resultado.email })

                perfil.carregarPerfil(true).catch(() => {})

            }

        } else {

            mensagem.value = "Sua conta foi ativada. Agora você já pode entrar."

        }

    } catch (falha) {

        estado.value = "erro"

        mensagem.value = falha.response?.data?.codigo === "token_invalido"
            ? "Link inválido ou expirado. Entre com seu e-mail e senha para receber um novo link de confirmação."
            : mensagemDeErro(falha, "Não foi possível confirmar o e-mail agora.")

    }

}

watch(
    () => [auth.etapa, auth.tokenAcao],
    ([etapa, token]) => {

        if (etapa !== ETAPAS.EMAIL_TOKEN) return

        if (processado === token && token) return

        processado = token

        confirmar(token)

    },
    { immediate: true }
)

function irParaLogin() {

    auth.tokenAcao = ""

    auth.login()

    router.push(auth.autenticado ? "/perfil" : "/login")

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


.falha{

    color:var(--cor-erro);

}

.girando{

    animation:girar 1s linear infinite;

}

@keyframes girar{

    to{

        transform:rotate(360deg);

    }

}

.card .primary-button:disabled{

    opacity:.6;

}

</style>