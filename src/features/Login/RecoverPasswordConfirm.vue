<template>

    <div class="card">

        <div class="icon-container">

            <MailCheck
                :size="80"
                class="mail-icon"
            />

        </div>

        <h1>BioQuest</h1>

        <h2>Verifique seu e-mail</h2>

        <p class="description">
            Enviamos um link para redefinição de senha para:
        </p>

        <div class="email">

            {{ auth.email }}

        </div>

        <p class="description small">
            Abra seu e-mail e clique no link recebido para criar uma nova senha.
            Caso não encontre a mensagem, verifique sua caixa de spam.
        </p>

        <button
            class="primary-button"
            @click="reenviar"
        >

            Reenviar e-mail

        </button>

        <button
            class="secondary-button"
            @click="auth.login()"
        >

            ← Voltar ao Login

        </button>

    </div>

</template>

<script setup>

import { MailCheck } from "lucide-vue-next"
import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

function reenviar(){


    // auth.enviarEmailRecuperacao()

    console.log("Reenviando para:", auth.email)

}

</script>

<style scoped>

.card{

    width:430px;

    padding:40px;

    background:white;

    border-radius:20px;

    box-shadow:0 20px 45px rgba(0,0,0,.15);

    text-align:center;

}

.icon-container{

    display:flex;

    justify-content:center;

    margin-bottom:20px;

}

.mail-icon{

    color:#2d6a4f;

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

    font-size:48px;

    color:#224235;

}

h2{

    margin:12px 0 20px;

    color:#666;

    font-weight:500;

}

.description{

    color:#666;

    line-height:1.6;

}

.description.small{

    margin-top:20px;

    margin-bottom:30px;

    font-size:14px;

}

.email{

    margin:22px 0;

    padding:14px;

    border-radius:12px;

    background:#f5f7f8;

    color:#224235;

    font-weight:600;

    word-break:break-word;

}

.primary-button{

    width:100%;

    height:48px;

    border:none;

    border-radius:10px;

    background:#2d6a4f;

    color:white;

    font-size:16px;

    cursor:pointer;

    transition:.25s;

}

.primary-button:hover{

    background:#255740;

}

.secondary-button{

    width:100%;

    margin-top:15px;

    border:none;

    background:none;

    color:#255740;

    font-size:15px;

    cursor:pointer;

}

</style>