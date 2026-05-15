<template> 
<div class="filtro-container" :class="{ collapsed }">
    
<button class="toggle-btn" @click="toggleSidebar">
  {{ collapsed ? '⮞' : '⮜' }}
</button>

    <div v-if="!collapsed" class="content">

      <div class="header">
        <span>Filtros</span>

        <button class="clear">Limpar</button>
      </div>

<div class="scroll-area">
      <div class="group">
        <div class="group-header" @click="open.ano = !open.ano">
          Ano da prova <span>{{ open.ano ? '▾' : '▸' }}</span>
        </div>

        <div v-if="open.ano" class="items">
          <label><input type="checkbox"> 2025 <span class="tag">Novo</span></label>
          <label><input type="checkbox"> 2024</label>
          <label><input type="checkbox"> 2023</label>
        </div>
      </div>

      <div class="group">
        <div class="group-header" @click="open.eixo = !open.eixo">
          Eixo temático <span>{{ open.eixo ? '▾' : '▸' }}</span>
        </div>

        <div v-if="open.eixo" class="items">
          <label><input type="checkbox"> Ecologia</label>
          <label><input type="checkbox"> Genética</label>
          <label><input type="checkbox"> Evolução</label>
        </div>
      </div>

      <div class="group">
        <div class="group-header" @click="open.nivel = !open.nivel">
          Nível <span>{{ open.nivel ? '▾' : '▸' }}</span>
        </div>

        <div v-if="open.nivel" class="items">
          <label><input type="checkbox"> Básico</label>
          <label><input type="checkbox"> Intermediário</label>
          <label><input type="checkbox"> Avançado</label>
        </div>
      </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const collapsed = ref(false)

const props = defineProps({
  width: Number
})

const emit = defineEmits([
  'update:width'
])

function toggleSidebar() {

  collapsed.value = !collapsed.value

  emit(
    'update:width',
    collapsed.value ? 60 : 280
  )
}

const open = ref({
  ano: true,
  eixo: true,
  nivel: true
})
</script>

<style scoped>
.filtro-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  position: relative;

  overflow: hidden;
}
.filtro-container.collapsed {
  width: 55px;
}


.header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  font-weight: bold;
  border-bottom: 1px solid #e5e5e5;
}

.clear {
  font-size: 12px;
  border: none;
  background: none;
  cursor: pointer;
  color: #777;
}

.group {
  border-top: 1px solid #e5e5e5;
}

.group-header {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.items {
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
}

.tag {
  background: #d4edda;
  color: #155724;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 5px;
  margin-left: 5px;
}

.toggle-btn {
  position: absolute;
  right: -15px;
  top: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: #f0f0f0;
  cursor: pointer;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px 16px;
}

.scroll-area::-webkit-scrollbar {
  width: 8px;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: #d2ddd8;
  border-radius: 999px;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background: #b8c7c1;
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>