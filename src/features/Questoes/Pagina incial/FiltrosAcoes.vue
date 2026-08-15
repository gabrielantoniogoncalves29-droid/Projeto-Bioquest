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

  color: #4b5563;

  font-size: 16px;

}

.resultado strong {

  color: #0d6b4d;

  font-size: 17px;

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

.acoes-filtros{
    display:flex;
    align-items:center;
    gap:14px;



    margin:0px 40px 35px;
}


.btn-aplicar {

  height: 44px;

  padding: 0 22px;

  border: 1px solid #0d6b4d;

  border-radius: 8px;

  background: #0d6b4d;

  color: white;

  display: flex;

  align-items: center;

  gap: 8px;

  cursor: pointer;

  font-weight: 600;

  transition: .2s;
    margin-left:auto;
}

.btn-aplicar:hover {

  border-color: #0d6b4d;

  color: #0d6b4d;

  background: #0d6b4d0c;


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

</style>
