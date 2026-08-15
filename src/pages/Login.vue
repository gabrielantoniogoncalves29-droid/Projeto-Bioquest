<template>

    <main class="auth-view">

        <header class="page-header">

            <span
                class="voltar"
                @click="goback()"
            >
                ⟵ Voltar
            </span>

            <h1>BioQuest</h1>

        </header>

        <div class="slider-wrapper">

            <div
                class="slider"
                :style="sliderStyle"
            >

                <div class="slide">
                    <LoginCard/>
                </div>

                <div class="slide">
                    <RegisterCard/>
                </div>

                <div class="slide">
                    <ConfirmEmailCard/>
                </div>

                <div class="slide">
                    <RecoverPasswordCard/>
                </div>

                <div class="slide">
                    <RecoverPasswordConfirmCard/>
                </div>

            </div>

        </div>

    </main>

</template>

<script setup>

import { computed } from "vue"

import LoginCard from "@/features/Login/LoginCard.vue"
import RegisterCard from "@/features/Login/RegisterCard.vue"
import ConfirmEmailCard from "@/features/Login/ConfirmEmailCard.vue"
import RecoverPasswordCard from "@/features/Login/RecoverPassword.vue"
import RecoverPasswordConfirmCard from "@/features/Login/RecoverPasswordConfirm.vue"

import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

const sliderStyle = computed(() => ({

    width:"500%",

    transform:`translateX(-${auth.etapa * 20}%)`

}))

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
        linear-gradient(rgba(255, 255, 255, 0.606), rgba(255, 255, 255, 0.356)),
        url("@/assets/Design sem nome_20260723_125812_0000.png") top/cover no-repeat;

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

    color:#234b3b;

    letter-spacing:.5px;

    user-select:none;

    pointer-events:auto;

}

.voltar{

    position:absolute;

    left:22px;

    top:0px;

    color:#0d6b4d;

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

    flex:0 0 20%;

    display:flex;
    justify-content:center;
    align-items:center;

}

@media (max-width:768px){

    .auth-view{

        background:
            linear-gradient(rgba(255,255,255,.45), rgba(255,255,255,.45)),
            url("@/assets/Design-fundo-grande.jpg") center/cover no-repeat;

    }

    .page-header{

        width:92vw;

        top:22px;

    }

    .page-header h1{

        font-size:40px;

    }

    .voltar{

        font-size:15px;

    }

    .slider-wrapper{

        width:100%;

        max-width:520px;

        padding:0 14px;

        box-sizing:border-box;

    }

}

</style>