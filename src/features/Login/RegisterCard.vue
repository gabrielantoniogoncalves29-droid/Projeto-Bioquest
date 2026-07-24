<template>
  <div class="card">

    <h1>BioQuest</h1>
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

const mostrarSenha = ref(false)

const nomeValido = computed(() => nome.value.length >= 3)

const emailValido = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const senhaValida = computed(() =>
    senha.value.length >= 5
)

const formValido = computed(() =>
    nomeValido.value &&
    emailValido.value &&
    senhaValida.value
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
    max-width:400px;

    padding:30px;

    border-radius:18px;

    background:rgba(255,255,255,.92);

    box-shadow:0 18px 40px rgba(0,0,0,.15);

    backdrop-filter:blur(8px);

    box-sizing:border-box;

}

h1{

    margin:0;

    text-align:center;

    font-size:46px;

    font-weight:700;

    color:#224235;

}

h2{

    margin:6px 0 24px;

    text-align:center;

    font-size:20px;

    font-weight:500;

    color:#666;

}

.field{

    display:flex;

    flex-direction:column;

    gap:6px;

    margin-bottom:16px;

}

label{

    font-size:14px;

    font-weight:600;

    color:#444;

}

.input-container{

    display:flex;

    align-items:center;

    height:48px;

    padding:0 14px;

    border:1px solid #D8D8D8;

    border-radius:10px;

    background:#FFF;

    transition:
        border-color .25s,
        box-shadow .25s;

}

.input-container:focus-within{

    border-color:#2d6a4f;

    box-shadow:0 0 0 3px rgba(45,106,79,.12);

}

.input-container.valid{

    border-color:#2d6a4f;

}

.icon{

    margin-right:10px;

    color:#888;

    flex-shrink:0;

}

input{

    flex:1;

    border:none;

    outline:none;

    background:transparent;

    font-size:15px;

}

input::placeholder{

    color:#AAA;

}

.eye-button{

    display:flex;

    align-items:center;

    justify-content:center;

    border:none;

    background:none;

    cursor:pointer;

    color:#777;

    transition:.2s;

}

.eye-button:hover{

    color:#2d6a4f;

}

.feedback{

    min-height:16px;

    font-size:12px;

    color:#d9534f;

}

.feedback.success{

    color:#2d6a4f;

}

.create-button{

    width:100%;

    height:46px;

    margin-top:10px;

    border:none;

    border-radius:10px;

    background:#2d6a4f;

    color:#FFF;

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:
        background .25s,
        transform .2s;

}

.create-button:hover:not(:disabled){

    background:#255740;

    transform:translateY(-2px);

}

.create-button:disabled{

    background:#D6D6D6;

    cursor:not-allowed;

}

.back-button{

    width:100%;

    margin-top:12px;

    border:none;

    background:none;

    color:#2d6a4f;

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.back-button:hover{

    text-decoration:underline;

}


input::-ms-reveal,
input::-ms-clear{

    display:none;

}

input[type="password"]::-webkit-textfield-decoration-container{

    display:none;

}



</style>