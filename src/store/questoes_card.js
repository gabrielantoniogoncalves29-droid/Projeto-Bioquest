import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarQuestoes } from '@/services/card'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

export const useQuestoesStore = defineStore('questoes', () => {

  const questoes = ref([])
  const carregando = ref(false)

  const totalQuestoes = computed(() => questoes.value.length)

  const questoesOrdenadas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const lista = [...questoes.value]

    switch (filtrosStore.ordenacao) {

      case 'recentes':
        return lista.sort((a, b) => (b.ano - a.ano) || (a.serial - b.serial))

      case 'antigas':
        return lista.sort((a, b) => (a.ano - b.ano) || (a.serial - b.serial))

      case 'maiorDificuldade':
        return lista.sort((a, b) => (b.nivel - a.nivel) || (a.serial - b.serial))

      case 'menorDificuldade':
        return lista.sort((a, b) => (a.nivel - b.nivel) || (a.serial - b.serial))

      default:
        return lista

    }

  })

  async function carregarQuestoes() {

    carregando.value = true
    questoes.value = await buscarQuestoes()
    carregando.value = false

  }

  return {

    questoes,
    carregando,
    totalQuestoes,
    questoesOrdenadas,
    carregarQuestoes

  }

})
