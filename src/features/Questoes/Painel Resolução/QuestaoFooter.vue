<script setup>

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useResolverStore } from '@/store/resolver/resolver'

const router = useRouter()

const resolver = useResolverStore()

const {
    questao,
    proximaQuestao,
    questaoAnterior

} = storeToRefs(resolver)

function responder() {

    if (!questao.value) return

    router.push(`/resolver/${questao.value.id}`)

}


function proxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}

function anterior() {

    if (!questaoAnterior.value) return

    router.push(`/resolver/${questaoAnterior.value}`)

}
</script>


<template>


  <div class="acoes-direita">

    <button class="btn-prox" @click="anterior" :disabled="!proximaQuestao">
       ← Questão anterior
    </button>

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

  padding: 16px 20px;

  border-top: 1px solid #eef1f3;

  background: #fafbfc;
}

.grupo-direita {

  display: flex;
  align-items: center;
  gap: 40px;

}

.btn-prox {

  background: white;

  border: 1px solid #d8dee4;

  color: #374151;

  padding: 9px 14px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;

  transition: all .15s ease;

}

.btn-prox:hover {

  border-color: #0d6b4d;

  color: #0d6b4d;

  background: #f7fcf9;

}


.btn-responder {

    background: #0d6b4d;

    color: white;

    border:none;

    padding: 10px 35px;

    border-radius: 8px;

    font-size: 15px;

    font-weight: 600;

    cursor: pointer;

    transition: all .15s ease;
}
.btn-responder:hover ,
.btn-proxima:hover {

  opacity: .92;

}

</style>