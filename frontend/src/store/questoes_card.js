import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarQuestoes } from '@/services/questoes'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'
import { usePerfilStore } from '@/store/perfil.js'
import { conteudos } from '@/features/Questoes/data/filtros.js'

export const useQuestoesStore = defineStore('questoes', () => {

  const questoes = ref([])
  const carregando = ref(false)

  function obterConteudo(conteudoId) {

    return conteudos.find(
      item => item.id === conteudoId
    )

  }

  function normalizar(texto) {

    return String(texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

  }

  const questoesFiltradas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const perfil = usePerfilStore()

    const termo = normalizar(filtrosStore.termoPesquisa.trim())

    return questoes.value.filter(questao => {

      if (
        filtrosStore.anosSelecionados.length &&
        !filtrosStore.anosSelecionados.includes(questao.ano)
      ) {
        return false
      }

      if (
        filtrosStore.niveisSelecionados.length &&
        !filtrosStore.niveisSelecionados.includes(questao.nivel)
      ) {
        return false
      }

      if (
        filtrosStore.conteudosSelecionados.length &&
        !filtrosStore.conteudosSelecionados.includes(questao.conteudoId)
      ) {
        return false
      }

      if (filtrosStore.eixosSelecionados.length) {

        const conteudo = obterConteudo(questao.conteudoId)

        if (
          !conteudo ||
          !filtrosStore.eixosSelecionados.includes(conteudo.eixoId)
        ) {
          return false
        }

      }

      if (
        filtrosStore.subconteudosSelecionados.length &&
        !filtrosStore.subconteudosSelecionados.includes(
          `${questao.conteudoId}-${questao.subconteudoIndice}`
        )
      ) {
        return false
      }

      if (filtrosStore.estadoSelecionado.length) {

        const respondida = perfil.questoesResolvidasLista.some(
          item => item.id === questao.id
        )

        const salva = perfil.questoesSalvasLista.some(
          item => item.id === questao.id
        )

        const atendeEstado = filtrosStore.estadoSelecionado.some(estadoId => {

          if (estadoId === 1) return respondida
          if (estadoId === 2) return salva

          return false

        })

        if (!atendeEstado) return false

      }

      if (termo) {

        const alvo = normalizar([
          questao.id,
          questao.resumo,
          questao.subconteudo,
          obterConteudo(questao.conteudoId)?.nome,
          ...(questao.palavrasChave ?? [])
        ].join(' '))

        if (!alvo.includes(termo)) return false

      }

      return true

    })

  })

  const totalQuestoes = computed(() => questoesFiltradas.value.length)

  const ORDEM_DIFICULDADE = [
    'Cognitiva',
    'Conhecimento básico',
    'Conhecimento específico'
  ]

  function posicaoDificuldade(questao) {

    const posicao = ORDEM_DIFICULDADE.indexOf(questao.dificuldade)

    return posicao === -1 ? ORDEM_DIFICULDADE.length : posicao

  }

  const questoesOrdenadas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const lista = [...questoesFiltradas.value]

    switch (filtrosStore.ordenacao) {

      case 'recentes':
        return lista.sort((a, b) => (b.ano - a.ano) || (a.serial - b.serial))

      case 'antigas':
        return lista.sort((a, b) => (a.ano - b.ano) || (a.serial - b.serial))

      case 'maiorDificuldade':
        return lista.sort((a, b) => (posicaoDificuldade(b) - posicaoDificuldade(a)) || (a.serial - b.serial))

      case 'menorDificuldade':
        return lista.sort((a, b) => (posicaoDificuldade(a) - posicaoDificuldade(b)) || (a.serial - b.serial))

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
    questoesFiltradas,
    questoesOrdenadas,
    carregarQuestoes

  }

})