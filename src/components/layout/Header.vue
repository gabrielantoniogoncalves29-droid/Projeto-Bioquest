<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';

let nome = "Gabriel";
const open = ref(false);

function mostrarMenu()
{
open.value = !open.value;
}

const showAlerts = ref(false);

function Alerts()
{
showAlerts.value = !showAlerts.value;
}

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
      <router-link to="/"><span class="material-icons">info</span>Sobre o projeto</router-link>
      <router-link to="/"><span class="material-icons">help</span>Ajuda</router-link>
    </nav>
    <div class="user">
    <button @click="Alerts"> <img src="@/components/icons/image.png" alt="Notificações" /></button>
    <div v-show="showAlerts" class="alerts"> 
      <div>
      <a href="#">Notificação 1</a>
      <a href="#">Notificação 2</a>
      </div>
    </div>
    <div @click="mostrarMenu" id="user_box">
    <img class="avatar" width="10px" height="auto" src="@/components/icons/account_circle_45dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.png" >
    <p>Olá, {{nome}}</p>
    <img v-show="open" style="margin-left: 12px;" width="10px" height="auto" src="@/components/icons/keyboard_arrow_up_45dp_000000_FILL0_wght400_GRAD0_opsz48.png" >
    <img v-show="!open" style="margin-left: 12px;" width="10px" height="auto" src="@/components/icons/keyboard_arrow_down_45dp_000000_FILL0_wght400_GRAD0_opsz48.png" >
    </div>
    <div v-show="open" class="dropdown"> 
      <a href="#">Perfil</a>
      <a href="#">Configurações</a>
      <a href="#">Sair</a>
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

.alerts{
position: absolute;
top: 50px;
right: 100px;
background: white;
border: 1px solid #ccc;
border-radius: 8px;
display: flex;
flex-direction: column;
min-width: 150px;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.alerts a{
display: block;
padding: 10px;
text-decoration: none;
color: black;
}

.alerts a:hover{
background: #f0f0f0;
text-anchor: start;
}


.dropdown{
position: absolute;
top: 50px;
right: 50px;
background: white;
border: 1px solid #ccc;
border-radius: 8px;
display: flex;
flex-direction: column;
min-width: 150px;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.dropdown a{
display: block;
padding: 10px;
text-decoration: none;
color: black;
}

.dropdown a:hover{
background: #f0f0f0;
text-anchor: start;
}

#user_box{
margin: 20px;
background-color: #f0f0f02f;
border-radius: 8px;
border-collapse: collapse;
border-bottom: 2px solid #04040455;
display: flex;
align-items: center;
cursor: pointer;
width:150px;
}

#user_box p{
margin-left: 10px;
}

.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}
</style>