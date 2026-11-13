<template>

    <main class="auth-view">

        <header class="page-header">

            <button
                type="button"
                class="voltar"
                @click="goback()"
            >
                ⟵ Voltar
            </button>

            <h1>BioQuest</h1>

        </header>

        <div class="slider-wrapper">

            <div
                class="slider"
                :style="sliderStyle"
            >

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.LOGIN">
                    <LoginCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.REGISTER">
                    <RegisterCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.REGISTER_CONFIRM">
                    <ConfirmEmailCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.RECOVER_PASSWORD">
                    <RecoverPasswordCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.RECOVER_PASSWORD_CONFIRM">
                    <RecoverPasswordConfirmCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.EMAIL_TOKEN">
                    <EmailTokenCard/>
                </div>

                <div class="slide" :inert="auth.etapa !== auth.ETAPAS.NEW_PASSWORD">
                    <NewPasswordCard/>
                </div>

            </div>

        </div>

    </main>

</template>

<script setup>

import { computed, watch } from "vue"

import { useRoute, useRouter } from "vue-router"

import LoginCard from "@/features/Login/LoginCard.vue"
import RegisterCard from "@/features/Login/RegisterCard.vue"
import ConfirmEmailCard from "@/features/Login/ConfirmEmailCard.vue"
import RecoverPasswordCard from "@/features/Login/RecoverPassword.vue"
import RecoverPasswordConfirmCard from "@/features/Login/RecoverPasswordConfirm.vue"
import EmailTokenCard from "@/features/Login/EmailTokenCard.vue"
import NewPasswordCard from "@/features/Login/NewPasswordCard.vue"

import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

const route = useRoute()

const router = useRouter()

const TOTAL_ETAPAS = Object.keys(auth.ETAPAS).length

const sliderStyle = computed(() => ({

    width:`${TOTAL_ETAPAS * 100}%`,

    transform:`translateX(-${auth.etapa * (100 / TOTAL_ETAPAS)}%)`

}))

function tokenDaUrl() {

    return new URLSearchParams(route.hash.replace(/^#/, "")).get("token") ?? ""

}

watch(
    () => route.name,
    nome => {

        if (nome === "ConfirmarEmail" || nome === "RedefinirSenha") {

            auth.tokenAcao = tokenDaUrl()

            if (route.hash) router.replace({ name: nome })

            if (nome === "ConfirmarEmail") auth.confirmarPorToken()
            else auth.novaSenha()

            return

        }

        if (nome === "Login") auth.login()

    },
    { immediate: true }
)

function goback(){

    window.history.back()

}

</script>

<style scoped>

.auth-view{

    width:100vw;
    height:100vh;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background:
        linear-gradient(var(--filtro-fundo-login-1), var(--filtro-fundo-login-2)),
        url("@/assets/layout-espacamento-igual.png") bottom/cover no-repeat;

    overflow:hidden;

}

.page-header{

    position:absolute;

    top:30px;

    left:0;

    width:100%;

    display:flex;

    justify-content:center;

    pointer-events:none;

}

.page-header h1{

    margin:0;

    font-size:48px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    letter-spacing:.5px;

    user-select:none;

    pointer-events:auto;

}

.voltar{

    position:absolute;

    left:22px;

    top:0px;

    color:var(--cor-primaria);

    font-size:18px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

    user-select:none;

    pointer-events:auto;

}

.voltar:hover{

    transform:translateX(-4px);

}

[data-tema="escuro"] .page-header h1{

    color:var(--cor-texto-principal);

}

[data-tema="escuro"] .voltar{

    color:var(--cor-texto-principal);

}


.slider-wrapper{

    width:520px;

    overflow:hidden;

    margin-top:50px;
}

.slider{

    display:flex;

    will-change:transform;

    transition:transform .45s ease;

}

.slide{

    flex:1 1 0;
    min-width:0;

    display:flex;
    justify-content:center;
    align-items:center;

}

@media (max-width:1280px) and (orientation:landscape){
    .auth-view{
        background:
            linear-gradient(var(--filtro-fundo-login-1), var(--filtro-fundo-login-2)),
            url("@/assets/responsive/tablet_horizontal/layout-espacamento-igual__tablet_horizontal_1280x800.webp") bottom/cover no-repeat;
    }
}

@media (max-width:900px) and (orientation:portrait){
    .auth-view{
        background:
            linear-gradient(var(--filtro-fundo-login-1), var(--filtro-fundo-login-2)),
            url("@/assets/responsive/tablet_vertical/layout-espacamento-igual__tablet_vertical_900x1200.webp") bottom/cover no-repeat;
    }
}

@media (max-width:600px) and (orientation:portrait){
    .auth-view{
        background:
            linear-gradient(var(--filtro-fundo-login-1), var(--filtro-fundo-login-2)),
            url("@/assets/responsive/mobile_tela_cheia/layout-espacamento-igual__mobile_tela_cheia_720x1280.webp") bottom/cover no-repeat;
    }
}

@keyframes slide-colapsar{
    to{
        max-height:0;
        overflow:hidden;
        visibility:hidden;
    }
}

@media (max-width:768px), (max-height:700px){
    .auth-view{
        height:auto;
        min-height:100vh;
        min-height:100dvh;
        justify-content:flex-start;
        padding:12px 0 32px;
        overflow:visible;
    }

    .page-header{
        position:relative;
        top:auto;
        left:auto;
        width:100%;
        max-width:520px;
        flex-direction:column;
        align-items:center;
        padding:0 16px;
        box-sizing:border-box;
    }

    .page-header h1{
        font-size:clamp(32px, 9vw, 40px);
    }

    .voltar{
        position:static;
        align-self:flex-start;
        min-width:44px;
        min-height:44px;
        display:inline-flex;
        align-items:center;
        font-size:16px;
    }

    .voltar:focus-visible{
        outline:2px solid var(--cor-primaria);
        outline-offset:2px;
        border-radius:6px;
    }

    .slider-wrapper{
        width:100%;
        max-width:520px;
        margin-top:8px;
        padding:0;
    }

    .slider{
        align-items:flex-start;
    }

    .slide{
        box-sizing:border-box;
        align-items:flex-start;
        padding:4px 16px 8px;
    }

    .slide[inert]{
        animation:slide-colapsar 1ms .46s forwards;
    }

    .auth-view .slide :deep(input){
        font-size:16px;
    }

    .auth-view .slide > *{
        height:auto;
        min-height:0;
        max-height:none;
        overflow:visible;
    }
}

@media (prefers-reduced-motion:reduce){
    .slider{
        transition:none;
    }
}
</style>