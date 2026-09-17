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
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:32px;

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

    box-shadow:0 0 0 4px rgba(45,106,79,.04);

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

.divider{

    height:1px;

    margin:22px 0 18px;

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

.card::-webkit-scrollbar-thumb{
    background:var(--cor-primaria-translucida);
    border-radius:999px;
}

.card::-webkit-scrollbar-thumb:hover{
    background:var(--cor-primaria-translucida-forte);
}

[data-tema="escuro"] .forgot-password,
[data-tema="escuro"] .register-button{
    color:var(--cor-primaria-texto);
}

</style>