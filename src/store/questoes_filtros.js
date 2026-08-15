import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  anos,
  niveis,
  eixos,
  conteudos,
  estado
} from '@/features/Questoes/data/filtros.js'

export const useQuestoesFiltrosStore = defineStore('questoesFiltros', () => {

  const anosOpcoes = anos
  const niveisOpcoes = niveis
  const eixosOpcoes = eixos
  const conteudosOpcoes = conteudos
  const estadoOpcoes = estado

  const mostrarFiltros = ref(true)
  const modoVisualizacao = ref('lista')
  const ordenacao = ref('recentes')
  const termoPesquisa = ref('')

  const anosSelecionados = ref([])
  const niveisSelecionados = ref([])
  const eixosSelecionados = ref([])
  const conteudosSelecionados = ref([])
  const subconteudosSelecionados = ref([])
  const estadoSelecionado = ref([])

  const subconteudosDisponiveis = computed(() => {

    const lista = []

    conteudosSelecionados.value.forEach(id => {

      const conteudo = conteudosOpcoes.find(item => item.id === id)

      if (!conteudo) return

      conteudo.subconteudos.forEach((sub, index) => {

        lista.push({
          id: `${id}-${index}`,
          nome: sub
        })

      })

    })

    return lista

  })

  const totalFiltrosAtivos = computed(() => {

    return (
      anosSelecionados.value.length +
      niveisSelecionados.value.length +
      eixosSelecionados.value.length +
      conteudosSelecionados.value.length +
      subconteudosSelecionados.value.length +
      estadoSelecionado.value.length
    )

  })

  function toggleFiltros() {

    mostrarFiltros.value = !mostrarFiltros.value

  }

  function definirModoVisualizacao(modo) {

    modoVisualizacao.value = modo

  }

  function definirOrdenacao(valor) {

    ordenacao.value = valor

  }

  function limparFiltros() {

    anosSelecionados.value = []
    niveisSelecionados.value = []
    eixosSelecionados.value = []
    conteudosSelecionados.value = []
    subconteudosSelecionados.value = []
    estadoSelecionado.value = []
    termoPesquisa.value = ''

  }

  return {

    anosOpcoes,
    niveisOpcoes,
    eixosOpcoes,
    conteudosOpcoes,
    estadoOpcoes,

    mostrarFiltros,
    modoVisualizacao,
    ordenacao,
    termoPesquisa,

    anosSelecionados,
    niveisSelecionados,
    eixosSelecionados,
    conteudosSelecionados,
    subconteudosSelecionados,
    estadoSelecionado,

    subconteudosDisponiveis,
    totalFiltrosAtivos,

    toggleFiltros,
    definirModoVisualizacao,
    definirOrdenacao,
    limparFiltros

  }

})
