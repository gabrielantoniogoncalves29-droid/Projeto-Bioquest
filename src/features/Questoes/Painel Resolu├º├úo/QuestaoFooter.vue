<script setup>

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Info } from 'lucide-vue-next'

import { useResolverStore } from '@/store/resolver/resolver'

const router = useRouter()

const resolver = useResolverStore()

const {
    questao,
    proximaQuestao

} = storeToRefs(resolver)

function responder() {

    if (!questao.value) return

    router.push(`/resolver/${questao.value.id}`)

}


function proxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}

function saibaMais() {

    if (!questao.value) return

    router.push(`/resolver/${questao.value.id}/detalhes`)

}
</script>


<template>


  <div class="acoes-direita">

    <div class="grupo-esquerda">

      <button class="btn-saiba-mais" @click="saibaMais">
       <Info :size="15" />
        Saiba mais sobre a questão
      </button>

    </div>

    <div class="grupo-direita">

      <button class="btn-responder" @click="responder">
        Responder
      </button>

      <button class="btn-prox" @click="proxima" :disabled="!proximaQuestao">
        Próxima questão →
      </button>

    </div>

  </div>


</template>


<style scoped>


.acoes-direita {

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 14px;

  padding: 16px 20px;

  border-top: 1px solid var(--cor-borda-suave);

  background: var(--cor-fundo-sutil);
}

.grupo-direita {

  display: flex;
  align-items: center;
  gap: 40px;

}

.grupo-esquerda{

  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

}

.btn-saiba-mais{

  display: flex;
  align-items: center;
  gap: 6px;


  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-borda);

  color: var(--cor-texto-secundario);

  padding: 10px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;
  white-space: nowrap;

  transition: all .15s ease;

}

.btn-saiba-mais:hover{
  border-color: var(--cor-primaria);

  color: var(--cor-primaria);

  background: var(--cor-primaria-fundo);
}

[data-tema="escuro"] .btn-saiba-mais{

  color: var(--cor-texto-principal);

}

.btn-prox {

  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-borda);

  color: var(--cor-texto-secundario);

  padding: 10px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;
  white-space: nowrap;

  transition: all .15s ease;
}

.btn-prox:hover {

  border-color: var(--cor-primaria);

  color: var(--cor-primaria);

  background: var(--cor-primaria-fundo);

}

.btn-prox:disabled {

  opacity: .45;
  cursor: not-allowed;

}

.btn-prox:disabled:hover {

  border-color: var(--cor-borda);
  color: var(--cor-texto-secundario);
  background: var(--cor-fundo-card);

}


.btn-responder {

    background: var(--cor-primaria);

    color: var(--cor-texto-invertido);

    border:none;

    padding: 10px 35px;

    border-radius: 8px;

    font-size: 15px;

    font-weight: 600;

    cursor: pointer;

    white-space: nowrap;

    transition: all .15s ease;
}
.btn-responder:hover ,
.btn-proxima:hover {

  opacity: .92;

}

@container questao (max-width:760px){

  .acoes-direita{

    flex-direction: column-reverse;
    align-items: stretch;

  }

  .grupo-direita,
  .grupo-esquerda{

    justify-content: space-between;
    gap: 14px;

  }

  .btn-prox,
  .btn-responder,
  .btn-saiba-mais{

    flex: 1;
    text-align: center;

  }

  .btn-responder{

    padding: 10px 20px;

  }

}

@container questao (max-width:420px){

  .acoes-direita{

    padding: 14px 16px;

  }

  .btn-prox,
  .btn-saiba-mais{

    font-size: 12.5px;
    padding: 9px 10px;

  }

}

@media (max-width:600px){

  .acoes-direita{

    flex-direction: column-reverse;
    align-items: stretch;

  }

  .grupo-direita,
  .grupo-esquerda{

    justify-content: space-between;
    gap: 14px;

  }

  .btn-prox,
  .btn-responder,
  .btn-saiba-mais{

    flex: 1;
    text-align: center;

  }

}

</style>
