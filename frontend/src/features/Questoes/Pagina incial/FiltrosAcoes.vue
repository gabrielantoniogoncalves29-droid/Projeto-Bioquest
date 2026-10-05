<script setup>
import { useQuestoesStore } from '@/store/questoes_card.js'

const store = useQuestoesStore()
</script>
<template>

  <div class="acoes-filtros">

    <button
      class="btn-aplicar"
      @click="store.carregarQuestoes()"
    >

      <span class="material-icons">
        search
      </span>

      Buscar Questões

    </button>

  </div>

</template>

<style scoped>

.resultado {

  color: var(--cor-texto-secundario);

  font-size: 16px;

}

.resultado strong {

  color: var(--cor-primaria);

  font-size: 17px;

}

.acoes {

  display: flex;

  align-items: center;

  gap: 10px;

}

.acoes label {

  font-size: 14px;

  color: var(--cor-texto-suave);

}

.acoes-filtros{
    display:flex;
    align-items:center;
    gap:14px;



    margin:0px 40px 35px;
}


.btn-aplicar {

  height: 44px;

  padding: 0 22px;

  border: 1px solid var(--cor-primaria);

  border-radius: 8px;

  background: var(--cor-primaria);

  color: var(--cor-texto-invertido);

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-weight: 600;

  transition: .2s;
    margin-left:auto;
}

.btn-aplicar:hover {

  border-color: var(--cor-primaria);

  color: var(--cor-primaria);

  background: color-mix(in srgb, var(--cor-primaria) 5%, transparent);


}

.material-icons {

  font-size: 18px;

}

@media (max-width: 768px) {

  .acoes-filtros {

    flex-direction: column;

    align-items: stretch;

    margin: 0px 20px 24px;

  }

  .btn-limpar,
  .btn-aplicar {

    width: 100%;

    justify-content: center;

  }

}

@media (max-width: 480px) {

  .acoes-filtros {

    margin: 0px 12px 20px;

  }

  .btn-aplicar {

    height: 46px;

  }

}


[data-tema="escuro"] .resultado strong{
  color: var(--cor-primaria-texto);
}

</style>
