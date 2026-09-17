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
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:32px;

    background:var(--cor-fundo-card-vidro);

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

    font-size:50px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    line-height:1;

}

h2{

    margin:8px 0 16px;

    font-size:20px;

    font-weight:500;

    color:var(--cor-texto-suave);

}

.description{

    margin:0;

    color:var(--cor-texto-suave);

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

    background:var(--cor-fundo-sutil);

    border:1px solid var(--cor-borda);

    color:var(--cor-primaria-texto);

    font-weight:600;

    word-break:break-word;

    box-sizing:border-box;

}

.primary-button{

    width:100%;

    flex-shrink:0;

    height:46px;

    margin-top:22px;

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

    margin-top:auto;

    padding-top:16px;

    border:none;

    background:none;

    color:var(--cor-primaria);

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.secondary-button:hover{

    color:var(--cor-primaria-texto);

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

</style>