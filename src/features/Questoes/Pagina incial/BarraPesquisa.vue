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

    default: false

  }

})

defineEmits([
  'toggle-filtros'
])

</script>

<style scoped>

.barra-pesquisa {

  background: white;
  margin: 0px 20px;
  border-radius: 8px;

  padding: 0px;
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 10px;

}

.input-container {

  flex: 1;

  display: flex;

  align-items: center;

  gap: 15px;

  background: #f9fafb;

  border: 1px solid #c5c6c9;

  border-radius: 15px;

  padding: 0 14px;

}

.input-container input {

  flex: 1;

  height: 48px;

  border: none;

  background: transparent;

  outline: none;
  color: #000000a9;
  font-size: 16px;

}

.acoes {

  display: flex;

  gap: 5px;

}

.btn-buscar,
.btn-filtro,
.btn-limpar {

  height: 48px;

  padding: 0 26px;

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
  padding: 0 30px;
  background: #0d6b4d;
  font-weight: 700;
  font-size: 15px;
  font-family: bold;
  color: white;
  border-radius: 15px;
  margin-right: 25px;
}

.btn-buscar:hover {

  opacity: .95;

}

.btn-filtro {

  background: white;
  border: none;

}

.btn-filtro:hover {

  background: #f9fafb;

}

.btn-limpar {

  background: white;

  border:none;

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