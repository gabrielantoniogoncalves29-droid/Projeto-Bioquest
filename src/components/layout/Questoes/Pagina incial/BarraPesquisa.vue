<template>

  <section class="barra-pesquisa">

    <div class="input-container">

      <span class="material-icons">
        search
      </span>

      <input
        type="text"
        placeholder="Pesquisar por assunto, habilidade, palavra-chave..."
      >

    </div>

    <div class="acoes">

      <button class="btn-buscar">

        <span class="material-icons">
          search
        </span>

        Buscar

      </button>

      <button
        class="btn-filtro"
        @click="$emit('toggle-filtros')"
      >

        <span class="material-icons">

          {{
            filtrosAbertos
              ? 'expand_less'
              : 'expand_more'
          }}

        </span>

        {{ filtrosAbertos
          ? 'Ocultar filtros'
          : 'Mostrar filtros'
        }}

      </button>

      <button class="btn-limpar">

        <span class="material-icons">
          restart_alt
        </span>

        Limpar

      </button>

    </div>

  </section>

</template>

<script setup>

defineProps({

  filtrosAbertos: {

    type: Boolean,

    default: true

  }

})

defineEmits([
  'toggle-filtros'
])

</script>

<style scoped>

.barra-pesquisa {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 16px;

  padding: 18px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 16px;

}

.input-container {

  flex: 1;

  display: flex;

  align-items: center;

  gap: 10px;

  background: #f9fafb;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  padding: 0 14px;

}

.input-container input {

  flex: 1;

  height: 48px;

  border: none;

  background: transparent;

  outline: none;

  font-size: 14px;

}

.acoes {

  display: flex;

  gap: 10px;

}

.btn-buscar,
.btn-filtro,
.btn-limpar {

  height: 48px;

  padding: 0 16px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  transition: .2s;

  font-weight: 600;

}

.btn-buscar {

  border: none;

  background: #0d6b4d;

  color: white;

}

.btn-buscar:hover {

  opacity: .95;

}

.btn-filtro {

  background: white;

  border: 1px solid #d1d5db;

}

.btn-filtro:hover {

  background: #f9fafb;

}

.btn-limpar {

  background: white;

  border: 1px solid #d1d5db;

}

.btn-limpar:hover {

  background: #f9fafb;

}

.material-icons {

  font-size: 20px;

}

@media (max-width: 900px) {

  .barra-pesquisa {

    flex-direction: column;

    align-items: stretch;

  }

  .acoes {

    width: 100%;

    flex-wrap: wrap;

  }

}

</style>