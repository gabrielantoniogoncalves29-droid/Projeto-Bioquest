<template>

    <div class="card">

        <div class="icon-container">

            <MailCheck
                :size="80"
                class="mail-icon"
            />

        </div>



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

    width:100%;
    max-width:430px;
    height:480px;

    padding:32px;

    background:rgba(255,255,255,0.441);

    border-radius:18px;

    box-shadow:none;

    box-sizing:border-box;

    display:flex;
    flex-direction:column;
    align-items:center;

    text-align:center;

}

.icon-container{

    display:flex;

    justify-content:center;

    margin-bottom:6px;

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

    font-size:50px;

    font-weight:700;

    color:#234b3b;

    line-height:1;

}

h2{

    margin:8px 0 16px;

    font-size:20px;

    font-weight:500;

    color:#666;

}

.description{

    margin:0;

    color:#666;

    line-height:1.5;

    font-size:15px;

}

.description.small{

    margin:18px 0 0;

    font-size:14px;

}

.email{

    width:100%;

    margin:18px 0;

    padding:14px;

    border-radius:12px;

    background:#ffffff87;

    border:1px solid #d9d9d9;

    color:#234b3b;

    font-weight:600;

    word-break:break-word;

    box-sizing:border-box;

}

.primary-button{

    width:100%;

    height:46px;

    margin-top:22px;

    border:none;

    border-radius:12px;

    background:#2d6a4f;

    color:#fff;

    font-size:16px;

    font-weight:600;

    cursor:pointer;

    transition:background .25s,
               transform .2s;

}

.primary-button:hover{

    background:#255740;

    transform:translateY(-2px);

}

.primary-button:active{

    transform:translateY(0);

}

.secondary-button{

    width:100%;

    margin-top:auto;

    padding-top:16px;

    border:none;

    background:none;

    color:#2d6a4f;

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.secondary-button:hover{

    color:#234b3b;

    text-decoration:underline;

}

</style>