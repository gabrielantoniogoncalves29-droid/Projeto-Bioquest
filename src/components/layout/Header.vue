<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';

let nome = "Gabriel";

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


    <h1 id="logo">BioQuest</h1>
    <p id="subtitle">Plataforma de questões de Biologia</p>
    </div>

    <nav class="nav">
      <router-link to="/"><span class="material-icons">home</span>Início</router-link>
      <router-link to="/questoes"><span class="material-icons">format_list_bulleted</span>Questões</router-link>
      <router-link to="/estatisticas"><span class="material-icons">leaderboard</span>Estatísticas</router-link>
      <router-link to="/sobre"><span class="material-icons">info</span>Sobre o projeto</router-link>
      <router-link to="/ajuda"><span class="material-icons">help</span>Ajuda</router-link>
    </nav>

<div class="user">
  <div class="menu-box">
    <button
      class="icon-btn"
      @click="barra(1)"
    >
      <img
        src="@/components/icons/image.png"
        alt="Notificações"
      />
    </button>


<div
  v-if="aberta === 1"
  class="menu-dropdown notifications"
>

  <div class="dropdown-header">
    <h3>Notificações</h3>
    <span class="badge">3 novas</span>
  </div>

  <div class="notification-list">

    <div class="notification-item">
      <img src="@/features/Questões/Imagens/Botanica-rmv.png" alt="">
      
      <div class="notification-content">
        <p>
          Novas Questões adicionadas ao banco de dados.
        </p>
        <span>12 de Abril</span>
      </div>
    </div>
    <div class="notification-item">
      <img src="@/features/Questões/Imagens/Botanica-rmv.png" alt="">
      
      <div class="notification-content">
        <p>
          Novo simulado disponível.
        </p>
        <span>Ontem</span>
      </div>
    </div>
  </div>
</div>
</div>




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
        Olá, {{ nome }}
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

    <a href="#">
      <i class="fa-solid fa-user"></i>
      Meu Perfil
    </a>

    <a href="#">
      <i class="fa-solid fa-chart-line"></i>
      Meu Desempenho
    </a>

    <a href="#">
      <i class="fa-solid fa-gear"></i>
      Configurações
    </a>

    <a href="#">
      <i class="fa-solid fa-book"></i>
      Minhas Questões
    </a>

  </div>

  <div class="profile-footer">
    <button class="logout-btn">
      Sair da Conta
    </button>
  </div>

</div>
  </div>
</div>
  </header>
</template>

<style>
.header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: white;
  border-bottom: 2px solid rgba(54, 54, 54, 0.248);
}

#logo {
  color: #1c4a3d;
  font-weight: bold;
  transform: translateY(9px);
  margin-left: 20px;
}


#subtitle{
font-family:'Times New Roman', Times, serif;
font-size: 15px;
transform: translateY(-16px);
}

.nav a{
  font-weight: bold;
  padding: 10px 10px;
  margin: 0 10px;
  text-decoration: none;
  color: #296f5b;
}

.nav a:hover{
  background-color: #f0f0f06d;
}
.user {
  font-size: 14px;
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

.icon-btn{
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 10px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;
}

.icon-btn:hover{
  background: #ececec94;
}

.icon-btn img{
  width: 20px;
  height: 20px;
}

#user_box{
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;

  background: #f7f7f7;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
}

#user_box:hover{
  background: #ececec;
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
  color: #333;
}

.arrow{
  font-size: 20px;
  color: #666;
}

.menu-dropdown{
  position: absolute;
  top: 65px;
  right: 0;
  width: 340px;
  background: #fff;
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
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.menu-dropdown a:hover{
  background: #f5f5f5;
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
  color: #333;
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
  color: #296f5b;
  font-size: 14px;
}

.profile-footer{
  margin-top: 8px;
  border-top: 1px solid #eee;
  padding: 8px 18px;
  font-size: 10px;
}


.badge{
  background: #e8f0ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
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
  background: #f5f7fb;
}

.notification-item img{
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.notification-content p{
  font-size: 14px;
  color: #222;
}

.notification-content span{
  font-size: 12px;
  color: #888;
}
</style>

