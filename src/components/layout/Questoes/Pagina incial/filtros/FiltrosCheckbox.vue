<template>

  <div class="filtro-checkbox">

    <label class="titulo">
      {{ titulo }}
    </label>

    <div class="opcoes">

      <label
        v-for="opcao in opcoes"
        :key="opcao"
        class="opcao"
      >

        <input
          type="checkbox"
        >

        <span>
          {{ opcao }}
        </span>

      </label>

    </div>

  </div>

</template>

<script setup>

defineProps({

  titulo: {
    type: String,
    required: true
  },

  opcoes: {
    type: Array,
    default: () => []
  }

})

</script>

<style scoped>

.filtro-checkbox {

  display: flex;

  flex-direction: column;

  gap: 10px;

}

.titulo {

  font-size: 13px;

  font-weight: 600;

  color: #374151;

}

.opcoes {

  display: flex;

  flex-wrap: wrap;

  gap: 16px;

}

.opcao {

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-size: 14px;

  color: #4b5563;

}

input[type="checkbox"] {

  width: 16px;

  height: 16px;

  cursor: pointer;

  accent-color: #0d6b4d;

}

</style>