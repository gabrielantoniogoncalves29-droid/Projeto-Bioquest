<template>
  <div class="card">

    <h2>Acessar a plataforma</h2>

    <form novalidate @submit.prevent="entrar" @keydown.enter="avancarComEnter">

    <div class="field">
      <label for="login-email">E-mail</label>

      <div class="input-container">
        <Mail class="icon" :size="20" aria-hidden="true"/>

        <input
          id="login-email"
          v-model.trim="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Digite seu e-mail"
          :disabled="enviando"
        >
      </div>
    </div>

    <div class="field">

      <label for="login-senha">Senha</label>

      <div class="input-container">

        <Lock class="icon" :size="20" aria-hidden="true"/>

        <input
          id="login-senha"
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          name="senha"
          autocomplete="current-password"
          placeholder="Digite sua senha"
          :disabled="enviando"
        >

        <button
          type="button"
          class="eye-button"
          :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
          @click="mostrarSenha = !mostrarSenha"
        >
          <Eye
            v-if="!mostrarSenha"
            :size="18"
          />

          <EyeOff
            v-else
            :size="18"
          />
        </button>

      </div>

    </div>

    <button
        type="button"
        class="forgot-password"
        @click="esqueciSenha"
    >
        Esqueci minha senha
    </button>

    <p
      v-if="erro"
      class="mensagem erro"
      role="alert"
    >
      {{ erro }}
    </p>

    <button
      v-if="emailNaoConfirmado"
      type="button"
      class="link-confirmacao"
      @click="auth.confirmar(email, false)"
    >
      Reenviar e-mail de confirmação
    </button>

    <button
      type="submit"
      class="login-button"
      :disabled="enviando"
    >
      {{ enviando ? "Entrando..." : "Entrar" }}
    </button>

    </form>

    <div class="divider"></div>

    <BotaoGoogle />

    <p class="register-text">
      Não possui uma conta?

      <button
        type="button"
        class="register-button"
        @click="auth.cadastro()"
      >
        Cadastre-se
      </button>

    </p>

  </div>
</template>

<script setup>

import { ref, computed } from "vue"

import { useRoute, useRouter } from "vue-router"

import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"
import { avancarComEnter } from "@/utils/teclado"

import { codigoDeErro, mensagemDeErro } from "@/services/api"

import { destinoSeguro } from "@/utils/destino"

import BotaoGoogle from "@/features/Login/BotaoGoogle.vue"

const auth = useAuthStore()

const route = useRoute()

const router = useRouter()

const email = computed({

    get: () => auth.email,

    set: value => auth.email = value

})
const senha = ref("")
const mostrarSenha = ref(false)
const enviando = ref(false)
const erro = ref("")
const emailNaoConfirmado = ref(false)

const emailValido = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

async function entrar(){

    if (enviando.value) return

    erro.value = ""
    emailNaoConfirmado.value = false

    if (!emailValido.value) {

        erro.value = "Digite um e-mail válido."

        return

    }

    if (!senha.value) {

        erro.value = "Digite sua senha."

        return

    }

    enviando.value = true

    try {

        await auth.entrar(email.value, senha.value)

        senha.value = ""

        await router.push(destinoSeguro(route.query.redirect))

    } catch (falha) {

        emailNaoConfirmado.value = codigoDeErro(falha) === "email_nao_confirmado"

        erro.value = mensagemDeErro(falha, "Não foi possível entrar. Tente novamente.")

    } finally {

        enviando.value = false

    }

}

function esqueciSenha() {

    auth.recuperarSenha()

}

</script>

<style scoped>

form{

    display:contents;

}

.card{
    width:100%;
    max-width:430px;
    min-height:450px;
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:25px 31px;

    background:var(--cor-fundo-card-vidro);

    border-radius:18px;

    box-shadow:none;

    box-sizing:border-box;

    display:flex;
    flex-direction:column;
}

h1{
    margin:0;

    text-align:center;

    font-size:50px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    line-height:1;
}

h2{

    margin:8px 0 24px;

    text-align:center;

    font-size:20px;

    font-weight:500;

    color:var(--cor-texto-suave);

}

.field{

    display:flex;

    flex-direction:column;

    gap:6px;

    margin-bottom:14px;

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

    box-shadow:0 0 0 4px var(--cor-foco-login);

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

.eye-button{

    display:flex;

    align-items:center;

    justify-content:center;

    background:none;

    border:none;

    cursor:pointer;

    color:var(--cor-texto-suave);

    transition:.2s;

}

.eye-button:hover{

    color:var(--cor-primaria);

}

.forgot-password,

.register-button{

    border:none;

    background:none;

    cursor:pointer;

    color:var(--cor-primaria);

    font-size:14px;

    font-weight:600;

    transition:.2s;

}

.forgot-password{

    padding:0;

    margin:2px 0 16px;

    align-self:flex-start;

}

.forgot-password:hover,

.register-button:hover{

    color:var(--cor-primaria-texto);

    text-decoration:underline;

}

.login-button{

    width:100%;

    flex-shrink:0;

    height:46px;

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

.login-button:hover{

    background:var(--cor-primaria);

    transform:translateY(-2px);

}

.login-button:active{

    transform:translateY(0);

}

.login-button:disabled{

    background:var(--cor-borda);

    cursor:not-allowed;

    transform:none;

}

.mensagem{

    margin:0 0 12px;

    font-size:13px;

    line-height:1.4;

}

.mensagem.erro{

    color:var(--cor-erro);

}

.link-confirmacao{

    align-self:flex-start;

    margin:-4px 0 12px;

    padding:0;

    border:none;

    background:none;

    cursor:pointer;

    color:var(--cor-primaria);

    font-size:13px;

    font-weight:600;

    text-decoration:underline;

}

.eye-button:focus-visible,
.forgot-password:focus-visible,
.register-button:focus-visible,
.link-confirmacao:focus-visible,
.login-button:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:2px;

}

.divider{

    height:1px;

    margin:2px 0 18px;

    background:var(--cor-fundo-sutil);

}

.register-text{

    margin-top:auto;

    text-align:center;

    color:var(--cor-texto-suave);

    font-size:15px;

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



[data-tema="escuro"] .forgot-password,
[data-tema="escuro"] .register-button{
    color:var(--cor-primaria-texto);
}

</style>