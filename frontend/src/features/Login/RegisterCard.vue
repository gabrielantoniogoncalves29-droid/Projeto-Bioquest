<template>
  <div class="card">

    <h2>Criar uma conta</h2>

    <form novalidate @submit.prevent="criarConta" @keydown.enter="avancarComEnter">

    <div class="field">

      <label for="cad-nome">Nome</label>

      <div
        class="input-container"
        :class="{ valid: nomeValido }"
      >
        <User class="icon" :size="20"/>

        <input
          id="cad-nome"
          v-model.trim="nome"
          type="text"
          name="nome"
          autocomplete="name"
          maxlength="80"
          placeholder="Digite seu nome"
          :disabled="enviando"
        >

      </div>

      <span
        v-if="nome"
        class="feedback"
        :class="{ success: nomeValido }"
      >
        {{ nomeValido ? "✔ Nome válido" : "Digite seu nome" }}
      </span>

    </div>

    <div class="field">

      <label for="cad-email">E-mail</label>

      <div
        class="input-container"
        :class="{ valid: emailValido }"
      >

        <Mail class="icon" :size="20"/>

        <input
          id="cad-email"
          v-model.trim="email"
          type="email"
          name="email"
          autocomplete="email"
          maxlength="120"
          placeholder="Digite seu e-mail"
          :disabled="enviando"
        >

      </div>

      <span
        v-if="email"
        class="feedback"
        :class="{ success: emailValido }"
      >
        {{ emailValido ? "✔ E-mail válido" : "E-mail inválido" }}
      </span>

    </div>

    <div class="field">

      <label for="cad-senha">Senha</label>

      <div
        class="input-container"
        :class="{ valid: senhaValida }"
      >

        <Lock class="icon" :size="20"/>

        <input
          id="cad-senha"
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          name="nova-senha"
          autocomplete="new-password"
          maxlength="72"
          placeholder="Crie uma senha"
          :disabled="enviando"
        >

        <button
          type="button"
          class="eye-button"
          :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
          @click="mostrarSenha = !mostrarSenha"
        >
          <Eye v-if="!mostrarSenha" :size="18"/>
          <EyeOff v-else :size="18"/>
        </button>

      </div>

      <span
        class="feedback"
        :class="{ success: senhaValida }"
      >
        {{ senhaValida ? "✔ Senha válida" : "Mínimo de 8 caracteres" }}
      </span>

    </div>

    <div class="field">

      <label for="cad-confirmar">Confirmar senha</label>

      <div
        class="input-container"
        :class="{ valid: confirmacaoValida }"
      >

        <Lock class="icon" :size="20"/>

        <input
          id="cad-confirmar"
          v-model="confirmarSenha"
          :type="mostrarConfirmarSenha ? 'text' : 'password'"
          name="confirmar-senha"
          autocomplete="new-password"
          maxlength="72"
          placeholder="Digite a senha novamente"
          :disabled="enviando"
        >

        <button
          type="button"
          class="eye-button"
          :aria-label="mostrarConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'"
          @click="mostrarConfirmarSenha = !mostrarConfirmarSenha"
        >
          <Eye v-if="!mostrarConfirmarSenha" :size="18"/>
          <EyeOff v-else :size="18"/>
        </button>

      </div>

      <span
        v-if="confirmarSenha"
        class="feedback"
        :class="{ success: confirmacaoValida }"
      >
        {{ confirmacaoValida ? "✔ As senhas coincidem" : "As senhas não coincidem" }}
      </span>

    </div>

    <label class="lgpd-field">

      <input
        v-model="aceitaTermos"
        type="checkbox"
      >

      <span>
        Li e concordo com o armazenamento e uso dos meus dados pessoais para fins da plataforma, em conformidade com a
        <abbr title="Lei Geral de Proteção de Dados">LGPD</abbr>.
      </span>

    </label>

    <p
      v-if="erro"
      class="mensagem erro"
      role="alert"
    >
      {{ erro }}
    </p>

    <button
      type="submit"
      class="create-button"
      :disabled="!formValido || enviando"
    >
      {{ enviando ? "Criando conta..." : "Criar conta" }}
    </button>

    </form>

    <button
      type="button"
      class="back-button"
      @click="auth.login()"
    >
      ← Voltar ao login
    </button>

  </div>
</template>

<script setup>

import { ref, computed } from "vue"

import { mensagemDeErro } from "@/services/api"

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"
import { avancarComEnter } from "@/utils/teclado"

const auth = useAuthStore()

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const aceitaTermos = ref(false)

const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)
const enviando = ref(false)
const erro = ref("")

const nomeValido = computed(() => nome.value.length >= 2 && nome.value.length <= 80 && !/[<>]/.test(nome.value))

const emailValido = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const senhaValida = computed(() =>
    senha.value.length >= 8 && senha.value.length <= 72
)

const confirmacaoValida = computed(() =>
    confirmarSenha.value.length > 0 &&
    confirmarSenha.value === senha.value
)

const formValido = computed(() =>
    nomeValido.value &&
    emailValido.value &&
    senhaValida.value &&
    confirmacaoValida.value &&
    aceitaTermos.value
)

async function criarConta(){

    if(!formValido.value || enviando.value) return

    erro.value = ""

    enviando.value = true

    try {

        const resposta = await auth.cadastrar(nome.value, email.value, senha.value)

        auth.confirmar(email.value, resposta.emailEnviado)

        senha.value = ""

        confirmarSenha.value = ""

    } catch (falha) {

        erro.value = mensagemDeErro(falha, "Não foi possível criar a conta. Tente novamente.")

    } finally {

        enviando.value = false

    }

}

</script>

<style scoped>

form{

    display:contents;

}

.card{

    width:100%;
    max-width:430px;
    min-height:480px;
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:28px 32px;

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

    font-size:48px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    line-height:1;

}

h2{

    margin:8px 0 18px;

    text-align:center;

    font-size:20px;

    font-weight:500;

    color:var(--cor-texto-suave);

}

.field{

    display:flex;

    flex-direction:column;

    gap:4px;

    margin-bottom:10px;

}

label{

    font-size:14px;

    font-weight:600;

    color:var(--cor-texto-secundario);

}

.input-container{

    display:flex;

    align-items:center;

    flex-shrink:0;

    height:46px;

    padding:0 16px;

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

.input-container.valid{

    border-color:var(--cor-primaria);

}

.icon{

    margin-right:10px;

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

    border:none;

    background:none;

    cursor:pointer;

    color:var(--cor-texto-fraco);

    transition:.2s;

}

.eye-button:hover{

    color:var(--cor-primaria);

}

.feedback{

    min-height:14px;

    font-size:11px;

    color:var(--cor-perigo);

    margin-top:2px;

}

.feedback.success{

    color:var(--cor-primaria);

}

.lgpd-field{

    display:flex;

    align-items:flex-start;

    gap:10px;

    margin:4px 0 18px;

    cursor:pointer;

}

.lgpd-field input[type="checkbox"]{

    margin-top:2px;

    width:16px;

    height:16px;

    flex-shrink:0;

    accent-color:var(--cor-primaria);

    cursor:pointer;

}

.lgpd-field span{

    font-size:12.5px;

    line-height:1.5;

    color:var(--cor-texto-secundario);

}

.lgpd-field abbr{

    color:var(--cor-primaria);

    font-weight:600;

    text-decoration:none;

}

.create-button{

    width:100%;

    flex-shrink:0;

    height:45px;

    margin-top:auto;

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

.create-button:hover:not(:disabled){

    background:var(--cor-primaria);

    transform:translateY(-2px);

}

.create-button:disabled{

    background:var(--cor-borda);

    cursor:not-allowed;

    transform:none;

}

.back-button{

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

.back-button:hover{

    text-decoration:underline;

    color:var(--cor-primaria-texto);

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
[data-tema="escuro"] .feedback.success,
[data-tema="escuro"] .lgpd-field abbr{
    color:var(--cor-primaria-texto);
}


.mensagem{

    margin:0 0 12px;

    font-size:13px;

    line-height:1.4;

}

.mensagem.erro{

    color:var(--cor-erro);

}

.eye-button:focus-visible,
.back-button:focus-visible,
.create-button:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:2px;

}

</style>