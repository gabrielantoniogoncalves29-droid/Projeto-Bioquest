<template>
  <div class="card">

    <h2>Acessar a plataforma</h2>

    <div class="field">
      <label>E-mail</label>

      <div class="input-container">
        <Mail class="icon" :size="20"/>

        <input
          v-model="email"
          type="email"
          placeholder="Digite seu e-mail"
        >
      </div>
    </div>

    <div class="field">

      <label>Senha</label>

      <div class="input-container">

        <Lock class="icon" :size="20"/>

        <input
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          placeholder="Digite sua senha"
        >

        <button
          class="eye-button"
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

    <button
      class="login-button"
      @click="entrar"
    >
      Entrar
    </button>

    <div class="divider"></div>

    <p class="register-text">
      Não possui uma conta?

      <button
        class="register-button"
        @click="auth.cadastro()"
      >
        Cadastre-se
      </button>

    </p>

  </div>
</template>

<script setup>

import { ref } from "vue"

import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

import { computed } from "vue"

const email = computed({

    get: () => auth.email,

    set: value => auth.email = value

})
const senha = ref("")
const mostrarSenha = ref(false)

function entrar(){

   
    console.log(email.value)
    console.log(senha.value)

}

function esqueciSenha() {

    auth.recuperarSenha()

}

</script>

<style scoped>

.card{
    width:100%;
    max-width:430px;
    height:450px;

    padding:32px;

    background:rgba(255,255,255,0.441);

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

    color:#234b3b;

    line-height:1;
}

h2{

    margin:8px 0 24px;

    text-align:center;

    font-size:20px;

    font-weight:500;

    color:#666;

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

    color:#444;

}

.input-container{

    display:flex;

    align-items:center;

    height:48px;

    padding:0 18px;

    border:1px solid #D9D9D9;

    border-radius:12px;

    background:#ffffff87;

    transition:border-color .25s,
               box-shadow .25s;

}

.input-container:focus-within{

    border-color:#2d6a4f;

    box-shadow:0 0 0 4px rgba(45,106,79,.04);

}

.icon{

    margin-right:12px;

    color:#8a8a8a;

    flex-shrink:0;

}

input{

    flex:1;

    border:none;

    outline:none;

    background:transparent;

    font-size:15px;

    color:#333;

}

input::placeholder{

    color:#AAA;

}

.eye-button{

    display:flex;

    align-items:center;

    justify-content:center;

    background:none;

    border:none;

    cursor:pointer;

    color:#7b7b7b;

    transition:.2s;

}

.eye-button:hover{

    color:#2d6a4f;

}

.forgot-password,

.register-button{

    border:none;

    background:none;

    cursor:pointer;

    color:#2d6a4f;

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

    color:#234b3b;

    text-decoration:underline;

}

.login-button{

    width:100%;

    height:46px;

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

.login-button:hover{

    background:#255740;

    transform:translateY(-2px);

}

.login-button:active{

    transform:translateY(0);

}

.login-button:disabled{

    background:#D5D5D5;

    cursor:not-allowed;

    transform:none;

}

.divider{

    height:1px;

    margin:22px 0 18px;

    background:#ECECEC;

}

.register-text{

    margin-top:auto;

    text-align:center;

    color:#666;

    font-size:15px;

}

input::-ms-reveal,
input::-ms-clear{

    display:none;

}

input[type="password"]::-webkit-textfield-decoration-container{

    display:none;

}

</style>