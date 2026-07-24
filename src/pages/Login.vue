<template>

    <main class="auth-view">

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

</script>

<style scoped>

.auth-view{

    width:100vw;
    height:100vh;

    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(rgba(255, 255, 255, 0.311), rgba(255, 255, 255, 0.311)), url("@/assets/Design sem nome_20260723_125812_0000.png") center/cover no-repeat;
    overflow:hidden;


}

.slider-wrapper{

    width:520px;

    overflow:hidden;

}

.slider{

    display:flex;

    will-change:transform;

}

.slide{

    flex:0 0 20%;

    display:flex;
    justify-content:center;
    align-items:center;

}
@media (max-width: 768px) {
  .auth-view {
    background:
      linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
      url("@/assets/Design-sem-nome.jpg") center/cover no-repeat;
  }
}



</style>