import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarQuestoes } from '@/services/card'
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

  function nomesDosSubconteudos(idsSelecionados) {

    return idsSelecionados
      .map(idComposto => {

        const [conteudoId, indice] = idComposto.split('-')

        const conteudo = obterConteudo(Number(conteudoId))

        return conteudo?.subconteudos?.[Number(indice)]

      })
      .filter(Boolean)

  }

  const questoesFiltradas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const perfil = usePerfilStore()

    const termo = filtrosStore.termoPesquisa.trim().toLowerCase()

    const nomesSubconteudos = filtrosStore.subconteudosSelecionados.length
      ? nomesDosSubconteudos(filtrosStore.subconteudosSelecionados)
      : []

    return questoes.value.filter(questao => {

      // Ano
      if (
        filtrosStore.anosSelecionados.length &&
        !filtrosStore.anosSelecionados.includes(questao.ano)
      ) {
        return false
      }

      // Nível
      if (
        filtrosStore.niveisSelecionados.length &&
        !filtrosStore.niveisSelecionados.includes(questao.nivel)
      ) {
        return false
      }

      // Conteúdo
      if (
        filtrosStore.conteudosSelecionados.length &&
        !filtrosStore.conteudosSelecionados.includes(questao.conteudoId)
      ) {
        return false
      }

      // Eixo (derivado do conteúdo da questão)
      if (filtrosStore.eixosSelecionados.length) {

        const conteudo = obterConteudo(questao.conteudoId)

        if (
          !conteudo ||
          !filtrosStore.eixosSelecionados.includes(conteudo.eixoId)
        ) {
          return false
        }

      }

      // Subconteúdo
      if (
        nomesSubconteudos.length &&
        !nomesSubconteudos.includes(questao.subconteudo)
      ) {
        return false
      }

      // Estado (respondidas / salvas)
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

      // Busca livre (resumo e subconteúdo)
      if (termo) {

        const alvo = `${questao.resumo ?? ''} ${questao.subconteudo ?? ''}`.toLowerCase()

        if (!alvo.includes(termo)) return false

      }

      return true

    })

  })

  const totalQuestoes = computed(() => questoesFiltradas.value.length)

  const questoesOrdenadas = computed(() => {

    const filtrosStore = useQuestoesFiltrosStore()
    const lista = [...questoesFiltradas.value]

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
    questoesFiltradas,
    questoesOrdenadas,
    carregarQuestoes

  }

})
