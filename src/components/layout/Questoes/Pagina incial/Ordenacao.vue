<template>

<section class="ordenacao">

  <div class="resultado">
      <strong>
        1.248
      </strong>

      questões encontradas
  </div>

  <div class="direita">

    <div class="acoes">
      <label>
        Ordenar por:
      </label>

      <select>

        <option>
          Mais recentes
        </option>

        <option>
          Mais antigas
        </option>

        <option>
          Maior taxa de acerto
        </option>

        <option>
          Menor taxa de acerto
        </option>

        <option>
          Mais resolvidas
        </option>

        <option>
          Menos resolvidas
        </option>

      </select>
    </div>

    <div class="view-buttons">

<button
  class="view-btn"
  :class="{ active: modo === 'lista' }"
  @click="emit('alterarModo', 'lista')"
>
  <span class="material-icons">
    view_list
  </span>
</button>

<button
  class="view-btn"
  :class="{ active: modo === 'grade' }"
  @click="emit('alterarModo', 'grade')"
>
  <span class="material-icons">
    grid_view
  </span>
</button>

    </div>

  </div>

</section>

</template>

<script setup>

const props = defineProps({
  modo: String
})

const emit = defineEmits([
  'alterarModo'
])

</script>

<style scoped>
.direita {

  display: flex;

  align-items: center;

  gap: 25px;

}

.view-buttons {

  display: flex;

  gap: 10px;

}

.ordenacao {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

}

.resultado {

  color: #4b5563;

  font-size: 14px;

}

.resultado strong {

  color: #0d6b4d;

  font-size: 16px;

}

.acoes {

  display: flex;

  align-items: center;

  gap: 10px;

}

.acoes label {

  font-size: 14px;

  color: #6b7280;

}

.acoes select {

  height: 42px;

  border: 1px solid #d1d5db;

  border-radius: 10px;

  padding: 0 12px;

  background: white;

  cursor: pointer;

}


.view-btn{
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    transition: 0.2s;
}

.view-btn:hover{
    background: #f5f5f5;
}

.view-btn.active{
    background: #e8f5eb;
    border-color: #b6d8bd;
}


@media (max-width: 768px) {

  .ordenacao {

    flex-direction: column;

    align-items: stretch;

  }

  .acoes {

    justify-content: space-between;

  }

}

</style>