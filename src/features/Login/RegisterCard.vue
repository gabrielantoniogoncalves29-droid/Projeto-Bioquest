<template>
  <div class="card">

    <h2>Criar uma conta</h2>

    <div class="field">

      <label>Nome</label>

      <div
        class="input-container"
        :class="{ valid: nomeValido }"
      >
        <User class="icon" :size="20"/>

        <input
          v-model.trim="nome"
          type="text"
          placeholder="Digite seu nome"
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

      <label>E-mail</label>

      <div
        class="input-container"
        :class="{ valid: emailValido }"
      >

        <Mail class="icon" :size="20"/>

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
        {{ emailValido ? "✔ E-mail válido" : "E-mail inválido" }}
      </span>

    </div>

    <div class="field">

      <label>Senha</label>

      <div
        class="input-container"
        :class="{ valid: senhaValida }"
      >

        <Lock class="icon" :size="20"/>

        <input
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          placeholder="Crie uma senha"
        >

        <button
          class="eye-button"
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
        {{ senhaValida ? "✔ Senha válida" : "Mínimo de 5 caracteres" }}
      </span>

    </div>

    <div class="field">

      <label>Confirmar senha</label>

      <div
        class="input-container"
        :class="{ valid: confirmacaoValida }"
      >

        <Lock class="icon" :size="20"/>

        <input
          v-model="confirmarSenha"
          :type="mostrarConfirmarSenha ? 'text' : 'password'"
          placeholder="Digite a senha novamente"
        >

        <button
          class="eye-button"
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

    <button
      class="create-button"
      :disabled="!formValido"
      @click="criarConta"
    >
      Criar conta
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

import { ref, computed } from "vue"

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

const nome = ref("")
const email = ref("")
const senha = ref("")
const confirmarSenha = ref("")
const aceitaTermos = ref(false)

const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)

const nomeValido = computed(() => nome.value.length >= 3)

const emailValido = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const senhaValida = computed(() =>
    senha.value.length >= 5
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

function criarConta(){

    if(!formValido.value) return

    auth.emailCadastro = email.value

    auth.confirmar(email.value)

}

</script>

<style scoped>

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

    box-shadow:0 0 0 4px rgba(45,106,79,.04);

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

</style>