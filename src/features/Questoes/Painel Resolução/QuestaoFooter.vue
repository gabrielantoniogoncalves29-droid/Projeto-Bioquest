<script setup>

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

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

function verExplicacao() {

    if (!questao.value) return

    console.log(
        'Mostrar explicação da questão',
        questao.value.id
    )

}

function proxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}
</script>





<template>




  <div class="acoes-direita">

  <button class="btn-responder" @click="responder">
    Responder
  </button>

    <button class="btn-proxima" @click="proxima" :disabled="!proximaQuestao">
      Próxima questão →
    </button>

  </div>


</template>


<style scoped>


.acoes-direita {

  display: flex;
  justify-content:flex-end;
  gap: 20px;
  align-items: center;

  padding: 16px 20px;

  border-top: 1px solid #eef1f3;

  background: #fafbfc;
}

.btn-explicacao {

  background: white;

  border: 1px solid #d8dee4;

  color: #374151;

  padding: 8px 14px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;

  transition: all .15s ease;

}

.btn-explicacao:hover {

  border-color: #0d6b4d;

  color: #0d6b4d;

  background: #f7fcf9;

}

.btn-proxima {

  background: #0d6b4d;

  color: white;

  border: none;

  padding: 8px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition: all .15s ease;

}

.btn-responder {
    margin-left: 18px;
    background: #0d6b4d;
    
    color: white;
    
    border: none;
    
    padding: 10px 20px;
    
    border-radius: 8px;
    
    font-size: 14px;
    
    font-weight: 600;
    
    cursor: pointer;
    
    transition: all .15s ease;
}
.btn-responder:hover ,
.btn-proxima:hover {

  opacity: .92;

}

</style>