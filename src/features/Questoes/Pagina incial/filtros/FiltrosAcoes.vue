<template>

  <div class="acoes-filtros">

    <button class="btn-limpar">

      <span class="material-icons">
        refresh
      </span>

      Limpar filtros

    </button>

    <button class="btn-aplicar">

      <span class="material-icons">
        search
      </span>

      Aplicar filtros

    </button>

  </div>

</template>

<script setup>
</script>

<style scoped>

.acoes-filtros {

  display: flex;

  justify-content: flex-end;

  align-items: center;

  gap: 14px;

  width: 100%;

}

.btn-limpar {

  height: 44px;

  padding: 0 18px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  color: #4b5563;

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-weight: 500;

  transition: .2s;

}

.btn-limpar:hover {

  background: #f9fafb;

}

.btn-aplicar {

  height: 44px;

  padding: 0 22px;

  border: none;

  border-radius: 8px;

  background: #0d6b4d;

  color: white;

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-weight: 600;

  transition: .2s;

}

.btn-aplicar:hover {

  background: #0b5a40;

}

.material-icons {

  font-size: 18px;

}

@media (max-width: 768px) {

  .acoes-filtros {

    flex-direction: column;

    align-items: stretch;

  }

  .btn-limpar,
  .btn-aplicar {

    width: 100%;

    justify-content: center;

  }

}

</style>