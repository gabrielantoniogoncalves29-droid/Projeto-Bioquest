<template>

  <div class="filtro-select">

    <label>
      {{ titulo }}
    </label>

    <select>

      <option>
        {{ placeholder }}
      </option>

      <option
        v-for="opcao in opcoes"
        :key="opcao"
      >
        {{ opcao }}
      </option>

    </select>

  </div>

</template>

<script setup>

defineProps({

  titulo: {
    type: String,
    required: true
  },

  placeholder: {
    type: String,
    default: 'Selecione'
  },

  opcoes: {
    type: Array,
    default: () => []
  }

})

</script>

<style scoped>

.filtro-select {

  display: flex;

  flex-direction: column;

  gap: 6px;

}

label {

  font-size: 13px;

  font-weight: 600;

  color: #374151;

}

select {

  height: 42px;

  padding: 0 12px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  color: #374151;

  font-size: 14px;

  cursor: pointer;

  transition: .2s;

}

select:hover {

  border-color: #9ca3af;

}

select:focus {

  outline: none;

  border-color: #0d6b4d;

  box-shadow: 0 0 0 3px rgba(13,107,77,.1);

}

</style>