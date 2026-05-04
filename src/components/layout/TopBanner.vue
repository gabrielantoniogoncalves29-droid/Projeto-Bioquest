<script setup>
import { ref } from 'vue'

const show = ref(false) 
const busca = ref('')
const nome = ref('Gabriel')

let lastY = 0

function handleWheel(e) {
  if (e.deltaY > 0) {
    show.value = true 
  } else {
    show.value = false 
  }
}

function handleTouchStart(e) {
  lastY = e.touches[0].clientY
}

function handleTouchMove(e) {
  const currentY = e.touches[0].clientY
  const diff = currentY - lastY

  if (diff < -12) {
    show.value = true
  } else if (diff > 12) { 
    show.value = false
  }
  lastY = currentY
}
</script>

<template>
  <section
    class="banner"
    :class="{ compacto: show }"
    @wheel="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove" >
    <div class="content">
      <h2 v-show="!show">Bem-vindo de volta {{ nome }}!</h2>
      <p v-show="!show">Explore questões de Biologia do ENEM</p>

      <div class="search">
        <input v-model="busca" placeholder="Buscar por assunto, palavras-chave..." />
        <button>Buscar</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-image: url('@/assets/banner2.png');
  background-size: cover;
  background-position: center;

  transition: all 0.3s ease;
  top: 0;
  overflow: hidden;
}

.banner.compacto {
  height: 80px; 
}

.content {
  text-align: center;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
}

.banner.compacto.content h2,
.banner.compacto.content p {
  opacity: 0;
  transform: translateY(-20px);
}

.search {
  margin-top: 15px;
  transition: all 0.3s ease;
}

input {
  padding: 10px;
  width: 250px;
  border-radius: 6px 0 0 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background: #2e7d66;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
}
</style>