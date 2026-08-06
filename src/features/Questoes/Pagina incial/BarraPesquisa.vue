<template>

  <section class="barra-pesquisa">

    <div class="input-container">


        <span class="material-icons">
          search
        </span>
      <input
        type="text"
        placeholder="Pesquisar por assunto, conteudo, palavra-chave, código da questão..."
      >

    </div>

    <div class="acoes">

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

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter-x text-sub-text stroke-sub-text group-hover:text-headings group-focus:text-action group-disabled:text-disabled group-hover:stroke-headings group-disabled:stroke-disabled "><path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055"></path><path d="m22 3-5 5"></path><path d="m17 3 5 5"></path></svg>

      Limpar filtros

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

.btn-limpar {

  height: 44px;


  padding: 0 15px;

  border: 1px solid #d1d5dbcc;

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
.btn-filtro:hover,
.btn-limpar:hover {

  border-color: #0d6b4d;

  color: #0d6b4d;

}
.barra-pesquisa {

  background: white;
  margin: 0px 40px;
  border-radius: 8px;

  padding: 0px;
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 150px;

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


.btn-buscar:hover {

  opacity: .95;

}

.btn-filtro {
  color: #3f4752;
  background: white;
  border: none;

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