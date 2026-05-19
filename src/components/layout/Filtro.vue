<template> 
<div class="filtro-container" :class="{ collapsed }">
    
  <button class="toggle-bar" @click="toggleSidebar">
    <span>
      {{ collapsed ? '❯' : '❮' }}
    </span>
  </button>

  <div v-if="!collapsed" class="content">

    <div class="header">
      <span>Filtros</span>

      <button class="clear">
        ✕ Limpar filtros
      </button>
    </div>
    <div class="scroll-area">

      <div class="group">
        <div
          class="group-header"
          @click="open.ano = !open.ano"
        >
          <span>Ano da prova</span>
<span
  class="chevron"
  :class="{ open: open.ano }"
>
  ❯
</span>
        </div>

        <div v-if="open.ano" class="items grid">

          <label class="checkbox">
            <input type="checkbox">
            <span>2025</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2024</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2023</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2022</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2021</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2020</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2019</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>2018</span>
          </label>

        </div>

      </div>
      <div class="group">

        <div
          class="group-header"
          @click="open.eixo = !open.eixo"
        >
          <span>Eixo temático</span>

<span
  class="chevron"
  :class="{ open: open.eixo }"
>
  ❯
</span>
        </div>

        <div v-if="open.eixo" class="items">

          <label class="topic">
            <span class="dot green"></span>
            Moléculas, células e tecidos
          </label>

          <label class="topic">
            <span class="dot mint"></span>
            Hereditariedade e diversidade da vida
          </label>

          <label class="topic">
            <span class="dot purple"></span>
            Identidade dos seres vivos
          </label>

          <label class="topic">
            <span class="dot orange"></span>
            Ecologia e ciências ambientais
          </label>

<label class="topic">
  <span class="dot gray"></span>
  Saúde e qualidade de vida
</label>

        </div>

      </div>

      <div class="group">

        <div
          class="group-header"
          @click="open.nivel = !open.nivel"
        >
          <span>Nível cognitivo</span>

<span
  class="chevron"
  :class="{ open: open.nivel }"
>
  ❯
</span>
        </div>

        <div v-if="open.nivel" class="items">

          <label class="checkbox">
            <input type="checkbox">
            <span>Básico</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>Intermediário</span>
          </label>

          <label class="checkbox">
            <input type="checkbox">
            <span>Avançado</span>
          </label>

        </div>

      </div>

    </div>
<button class="btn-filtrar">Filtrar</button>
  </div>
</div>
</template>

<style scoped>

.filtro-container{
  width: 100%;
  height: 100%;
border-radius: 10px;
  position: relative;

  display: flex;
  flex-direction: column;

  background: #fff;

  overflow: hidden;
}

.filtro-container.collapsed{
  width: 30px;
}

.header{
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 18px;

  border-bottom: 1px solid #ececec;

  flex-shrink: 0;
}

.header span{
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

.clear{
  border: none;
  background: none;

  font-size: 13px;
  font-weight: 500;

  color: #666;

  cursor: pointer;

  transition: 0.2s;
}

.clear:hover{
  color: #111;
}

.scroll-area{
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.scroll-area::-webkit-scrollbar{
  width: 7px;
}

.scroll-area::-webkit-scrollbar-thumb{
  background: #d9d9d9;
  border-radius: 999px;
}

.group{
  border-bottom: 1px solid #ececec;
}

.group-header{
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 18px;

  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  color: #222;

  transition: 0.2s;
}

.group-header:hover{
  background: #fafafa;
}

.arrow{
  color: #777;
}

.items{
  display: flex;
  flex-direction: column;

  gap: 12px;

  padding: 0 18px 16px 18px;
}

.items.grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.checkbox{
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 14px;

  color: #444;

  cursor: pointer;
}

.checkbox input{
  width: 16px;
  height: 16px;

  accent-color: #3a8f71;
}

.topic{
  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 13px;

  color: #555;

  cursor: pointer;
}

.dot{
  width: 10px;
  height: 10px;

  border-radius: 50%;

  flex-shrink: 0;
}

.green{
  background: #8fd3a8;
}

.mint{
  background: #89d7c8;
}

.purple{
  background: #b49cff;
}

.orange{
  background: #f2c07f;
}

.gray{
  background: #ccc;
}
.see-more{
  margin: 0 18px 16px 18px;

  border: none;
  background: none;

  font-size: 13px;
  font-weight: 500;

  color: #5c8f7c;

  cursor: pointer;
}

.content{
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}


.toggle-bar{
  position: absolute;

  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  transform: translateX(-5px);
  width: 20px;
  height: 90px;

  border: none;

  border-radius: 0 12px 12px 0;

  background: white;

  border-right: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  z-index: 50;
}

.toggle-bar span{
  font-size: 18px;
  color: #777;

  transition: 0.2s;
}

.toggle-bar:hover{
  width: 24px;
  background: #f8f8f8;
}

.toggle-bar:hover span{
  color: #222;
}

.chevron{
  font-size: 16px;

  color: #777;

  transition: 0.25s ease;

  transform: rotate(0deg);

  display: flex;
  align-items: center;
  justify-content: center;
}

.chevron.open{
  transform: rotate(90deg);
}

    .btn-filtrar {
      background-color: white;
      color: #1f6f5c;
      margin: 6px;
     margin-bottom: 20px;
     margin-left: 12px;
     margin-right: 12px;
      border: 2px solid #1f6f5c;
      border-radius: 8px; 
      padding: 8px 20px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-filtrar:hover {
       background: #1f6f5c;
      color: white;
    }
</style>


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
