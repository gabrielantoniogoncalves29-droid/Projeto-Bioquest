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

        <p class="description">
            Enviamos um e-mail de confirmação para:
        </p>

        <div class="email">

            {{ auth.emailCadastro }}

        </div>

        <p class="description small">
            Clique no link enviado para ativar sua conta.
            Caso não encontre o e-mail, verifique a caixa de spam.
        </p>

        <button
            class="primary-button"
            @click="reenviarEmail"
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

function reenviarEmail(){


    console.log("Reenviando para:", auth.emailCadastro)

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

    box-shadow:0 18px 40px rgba(0,0,0,.15);

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

</style>