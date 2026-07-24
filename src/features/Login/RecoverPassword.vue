<template>

    <div class="card">

        <h1>BioQuest</h1>

        <h2>Recuperar senha</h2>

        <p class="description">
            Informe seu e-mail para receber um link de redefinição de senha.
        </p>

        <div class="field">

            <label>E-mail</label>

            <div
                class="input-container"
                :class="{ valid: emailValido }"
            >

                <Mail
                    class="icon"
                    :size="20"
                />

                <input
                    v-model.trim="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                >

            </div>

            <span
                v-if="email"
                class="feedback"
                :class="{ success: emailValido }"
            >
                {{ emailValido ? "✔ E-mail válido" : "Digite um e-mail válido." }}
            </span>

        </div>

        <button
            class="continue-button"
            :disabled="!emailValido"
            @click="avancar"
        >

            Avançar

        </button>

        <button
            class="back-button"
            @click="auth.login()"
        >

            ← Voltar ao login

        </button>

    </div>

</template>

<script setup>

import { computed } from "vue"
import { Mail } from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

const email = computed({

    get: () => auth.email,

    set: value => auth.email = value

})

const emailValido = computed(() =>

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)

)

function avancar(){

    if(!emailValido.value) return


    // auth.enviarRecuperacao()

    auth.recuperarSenhaConfirmacao()

}

</script>

<style scoped>

.card{

    width:430px;

    padding:40px;

    background:white;

    border-radius:20px;

    box-shadow:0 20px 45px rgba(0,0,0,.15);

}

h1{

    margin:0;

    text-align:center;

    font-size:52px;

    color:#224235;

}

h2{

    margin:12px 0 15px;

    text-align:center;

    color:#666;

    font-weight:500;

}

.description{

    text-align:center;

    color:#777;

    line-height:1.5;

    margin-bottom:30px;

}

.field{

    display:flex;

    flex-direction:column;

    gap:8px;

}

label{

    font-weight:600;

    color:#444;

}

.input-container{

    display:flex;

    align-items:center;

    height:52px;

    border:1px solid #d9d9d9;

    border-radius:10px;

    padding:0 14px;

    transition:.25s;

}

.input-container:focus-within{

    border-color:#2d6a4f;

}

.input-container.valid{

    border-color:#2d6a4f;

}

.icon{

    color:#777;

    margin-right:10px;

}

input{

    flex:1;

    border:none;

    outline:none;

    font-size:15px;

}

.feedback{

    font-size:13px;

    color:#d9534f;

}

.feedback.success{

    color:#2d6a4f;

}

.continue-button{

    width:100%;

    height:48px;

    margin-top:25px;

    border:none;

    border-radius:10px;

    background:#2d6a4f;

    color:white;

    font-size:16px;

    cursor:pointer;

    transition:.25s;

}

.continue-button:disabled{

    background:#d7d7d7;

    cursor:not-allowed;

}

.continue-button:hover:not(:disabled){

    background:#255740;

}

.back-button{

    width:100%;

    margin-top:15px;

    border:none;

    background:none;

    color:#255740;

    font-size:15px;

    cursor:pointer;

}

</style>