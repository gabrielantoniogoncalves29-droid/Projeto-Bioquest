<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';
import { useTemaStore } from '@/store/tema.js';

const tema = useTemaStore();

let nome = "Gabriel Antônio";

const aberta = ref(null);

function barra(id){
    if(aberta.value === id){
      aberta.value = null
    }
    else{
      aberta.value = id
    }
  }

function fecharAoClicarFora(event){

  const clicouDentro =
    event.target.closest('.menu-box');

  if(!clicouDentro){
    aberta.value = null;
  }

}

onMounted(() => {
  document.addEventListener(
    'click',
    fecharAoClicarFora
  );
});

onUnmounted(() => {
  document.removeEventListener(
    'click',
    fecharAoClicarFora
  );
});
</script>

<template>
  <header class="header">
    <div class="left">


    <h1 id="logo"><router-link to="/">BioQuest</router-link></h1>

    </div>

    <nav class="nav">
      <router-link to="/" class="linha"><span class="material-icons">home</span>Início</router-link>
      <router-link to="/questoes" class="linha"><span class="material-symbols-outlined">description</span>Questões</router-link>
      <router-link to="/estatisticas" class="linha"><span class="material-icons">leaderboard</span>Estatísticas</router-link>
      <router-link to="/ajuda" class="linha"><span class="material-symbols-outlined">help</span>Ajuda</router-link>
    </nav>

<div class="user">
  <button
    class="botao-tema"
    type="button"
    :title="tema.tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo noturno'"
    @click="tema.alternarTema()"
  >
    <Sun v-if="tema.tema === 'escuro'" :size="18" />
    <Moon v-else :size="18" />
  </button>
  <div class="menu-box">
    <div
      @click="barra(2)"
      id="user_box"
    >
      <img
        class="avatar"
        src="@/components/icons/account_circle_45dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.png"
      >
      <p>
        {{ nome }}
      </p>
      <span class="material-icons arrow">
        {{ aberta === 2 ? 'expand_less' : 'expand_more' }}
      </span>
    </div>
<div
  v-if="aberta === 2"
  class="menu-dropdown profile-dropdown"
>

  <div class="profile-options">

    <router-link to="/login">
      <i class="fa-solid fa-user"></i>
      Login/cadastro
    </router-link>

    <router-link to="/perfil">
      <i class="fa-solid fa-user"></i>
      Meu Perfil
    </router-link>


    <a >
      <i class="fa-solid fa-gear"></i>
      Configurações
    </a>
    
    <a href="#" class="logout-btn">
      Sair da Conta
    </a>
  </div>
</div>
  </div>
</div>
  </header>
</template>

<style>
.header {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: var(--cor-fundo-card);
  border-bottom: 2px solid rgba(54, 54, 54, 0.086);
}

#logo {
  color: var(--cor-primaria-texto);
  font-weight: bold;
  font-size: clamp(0rem, 5vw, 2.5rem);
}

#logo a{
  text-decoration: none;
  color: inherit;
}

.nav{
  display: flex;
}

.nav a{
  font-weight: bold;
  padding:  clamp(0.3rem, 1vw, 0.6rem)
            clamp(0.5rem, 2vw, 1rem);
  margin: 0 0.6rem;
  text-decoration: none;
  color: var(--cor-primaria-texto);
}

.nav a:hover{
  background-color: var(--cor-fundo-sutil-translucida);
}

.user {
  font-size: 1rem;
  position: relative;
  display: flex;
  gap: 25px;
  align-items: center;
}

.user button{
border: none;
scale: 1.15;
background: none;
cursor: pointer;
}

.user img{
width: 20px;
height: 20px;
}

.avatar{
scale: 1.7;
filter: grayscale(1) brightness(0.3);
margin-left: 10px;
}

.user{
  display: flex;
  align-items: center;
  gap: 18px;

  position: relative;
}

.menu-box{
  position: relative;

  display: flex;
  align-items: center;
}
.botao-tema{
  width: 42px;
  height: 42px;
  min-width: 42px;
  border: 1px solid var(--cor-borda);
  border-radius: 12px;
  background: var(--cor-fundo-sutil);
  color: var(--cor-texto-secundario);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .2s;
}

.botao-tema:hover{
  border-color: var(--cor-primaria);
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
}


.icon-btn{
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 10px;
  background: var(--cor-fundo-sutil);
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;
}

.icon-btn:hover{
  background: var(--cor-fundo-sutil-translucida);
}

.icon-btn img{
  width: 20px;
  height: 20px;
}

#user_box{
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;

  background: var(--cor-fundo-sutil);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
}

#user_box:hover{
  background: var(--cor-fundo-sutil);
}

.avatar{
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

#user_box p{
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--cor-texto-principal);
}

.arrow{
  font-size: 20px;
  color: var(--cor-texto-suave);
}

.menu-dropdown{
  position: absolute;
  top: 65px;
  right: 0;
  width: 340px;
  background: var(--cor-fundo-card);
  border-radius: 18px;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.12);
  padding: 15px;
  z-index: 999;
}

.menu-dropdown a{
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 16px;
  text-decoration: none;
  color: var(--cor-texto-principal);
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.menu-dropdown a:hover{
  background: var(--cor-fundo-sutil);
}

.material-symbols-outlined{
  font-size: 20px;
  vertical-align: middle;
}

.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}

.profile-options{
  display: flex;
  flex-direction: column;
  padding: 2px;
  gap: 2px;
}

.profile-options a,
.logout-btn{
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  text-decoration: none;
  color: var(--cor-texto-principal);
  background: transparent;
  border: none;
  padding: 10px 13px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: .15s;
  text-align: left;
}

.profile-options i{
  color: var(--cor-primaria-texto);
  font-size: 14px;
}

.profile-footer{
  margin-top: 8px;
  border-top: 1px solid var(--cor-borda-suave);
  padding: 8px 18px;
  font-size: 10px;
}

.notification-list{
  display: flex;
  flex-direction: column;
  gap: 12px;

  max-height: 300px;
  overflow-y: auto;
}

.notification-item{
  display: flex;
  gap: 12px;

  padding: 10px;

  border-radius: 12px;

  transition: .2s;
  cursor: pointer;
}

.notification-item:hover{
  background: var(--cor-fundo-sutil);
}

.notification-item img{
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.notification-content p{
  font-size: 14px;
  color: var(--cor-texto-principal);
}

.notification-content span{
  font-size: 12px;
  color: var(--cor-texto-fraco);
}

@media (min-width: 1024px) and (max-width: 2000px) {
  .header {
    height: 90px;
  }
}
</style>

