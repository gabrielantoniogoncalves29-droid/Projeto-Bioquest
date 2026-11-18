import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarQuestoes } from '@/services/questoes'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import { useTaxonomiaStore } from '@/store/taxonomia.js'
import { usePerfilStore } from '@/store/perfil.js'
import { filtrarQuestoes, ordenarQuestoes } from '@/utils/filtrarQuestoes.js'

export const useQuestoesStore = defineStore('questoes', () => {

  const questoes = ref([])
  const carregando = ref(false)

  const questoesFiltradas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const perfil = usePerfilStore()

    return filtrarQuestoes(
      questoes.value,
      {
        anos: filtrosStore.anosSelecionados,
        niveis: filtrosStore.niveisSelecionados,
        objetos: filtrosStore.eixosSelecionados,
        conteudos: filtrosStore.conteudosSelecionados,
        subconteudos: filtrosStore.subconteudosSelecionados,
        estados: filtrosStore.estadoSelecionado,
        termo: filtrosStore.termoPesquisa
      },
      {
        respondidas: new Set(perfil.questoesResolvidasLista.map(item => item.id)),
        salvas: new Set(perfil.questoesSalvasLista.map(item => item.id)),
        revisar: new Set(perfil.questoesRevisarLista.map(item => item.id))
      }
    )

  })

  const totalQuestoes = computed(() => questoesFiltradas.value.length)

  const questoesOrdenadas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()

    return ordenarQuestoes(questoesFiltradas.value, filtrosStore.ordenacao)

  })

  async function carregarQuestoes(forcar = false) {

    carregando.value = true

    try {

      const [lista] = await Promise.all([
        buscarQuestoes(forcar),
        useTaxonomiaStore().carregar(),
        usePerfilStore().carregarPerfil().catch(() => {})
      ])

      questoes.value = lista

    } finally {

      carregando.value = false

    }

  }

  return {

    questoes,
    carregando,
    totalQuestoes,
    questoesFiltradas,
    questoesOrdenadas,
    carregarQuestoes

  }

})
