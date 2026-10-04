<template>

    <div class="card">


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

    width:100%;
    max-width:430px;
    height:420px;
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:40px 32px 32px;

    background:var(--cor-fundo-card-vidro);

    border-radius:18px;

    box-shadow:none;

    box-sizing:border-box;

    display:flex;
    flex-direction:column;

}

h2{

    margin:0 0 18px;

    text-align:center;

    font-size:28px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    line-height:1.2;

}

.description{

    margin:0 0 34px;

    text-align:center;

    color:var(--cor-texto-suave);

    font-size:15px;

    line-height:1.6;

}

.field{

    display:flex;

    flex-direction:column;

    gap:6px;

}

label{

    font-size:15px;

    font-weight:600;

    color:var(--cor-texto-secundario);

}

.input-container{

    display:flex;

    align-items:center;

    flex-shrink:0;

    height:48px;

    padding:0 18px;

    border:1px solid var(--cor-borda);

    border-radius:12px;

    background:var(--cor-fundo-sutil);

    transition:border-color .25s,
               box-shadow .25s;

}

.input-container:focus-within{

    border-color:var(--cor-primaria);

    box-shadow:0 0 0 4px rgba(45,106,79,.04);

}

.input-container.valid{

    border-color:var(--cor-primaria);

}

.icon{

    margin-right:12px;

    color:var(--cor-texto-fraco);

    flex-shrink:0;

}

input{

    flex:1;

    border:none;

    outline:none;

    background:transparent;

    font-size:15px;

    color:var(--cor-texto-principal);

}

input::placeholder{

    color:var(--cor-texto-fraco);

}

.feedback{

    min-height:18px;

    margin-top:4px;

    font-size:12px;

    color:var(--cor-perigo);

}

.feedback.success{

    color:var(--cor-primaria);

}

.continue-button{

    width:100%;

    flex-shrink:0;

    height:46px;

    margin-top:28px;

    border:none;

    border-radius:12px;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-size:16px;

    font-weight:600;

    cursor:pointer;

    transition:background .25s,
               transform .2s;

}

.continue-button:hover:not(:disabled){

    background:var(--cor-primaria);

    transform:translateY(-2px);

}

.continue-button:active{

    transform:translateY(0);

}

.continue-button:disabled{

    background:var(--cor-borda);

    cursor:not-allowed;

}

.back-button{

    width:100%;

    flex-shrink:0;

    margin-top:auto;

    border:none;

    background:none;

    color:var(--cor-primaria);

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.back-button:hover{

    color:var(--cor-primaria-texto);

    text-decoration:underline;

}

input::-ms-reveal,
input::-ms-clear{

    display:none;

}

input[type="password"]::-webkit-textfield-decoration-container{

    display:none;

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

[data-tema="escuro"] .back-button,
[data-tema="escuro"] .feedback.success{
    color:var(--cor-primaria-texto);
}

</style>