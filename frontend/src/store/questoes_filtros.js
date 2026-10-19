import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useTaxonomiaStore } from '@/store/taxonomia.js'

export const useQuestoesFiltrosStore = defineStore('questoesFiltros', () => {

  const taxonomia = useTaxonomiaStore()

  const anosOpcoes = computed(() => taxonomia.anos)
  const niveisOpcoes = computed(() => taxonomia.niveis)
  const eixosOpcoes = computed(() => taxonomia.eixos)
  const conteudosOpcoes = computed(() => taxonomia.conteudos)
  const estadoOpcoes = computed(() => taxonomia.estados)

  const buscaRealizada = ref(false)
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

      const conteudo = conteudosOpcoes.value.find(item => item.id === id)

      if (!conteudo) return

      conteudo.subconteudos.forEach(sub => {

        lista.push({
          id: sub.id,
          nome: sub.nome
        })

      })

    })

    return lista

  })

  // Desmarcar um conteúdo também descarta os subconteúdos dele que estavam marcados.
  watch(conteudosSelecionados, () => {

    const validos = new Set(subconteudosDisponiveis.value.map(sub => sub.id))
    const restantes = subconteudosSelecionados.value.filter(id => validos.has(id))

    if (restantes.length !== subconteudosSelecionados.value.length) {

      subconteudosSelecionados.value = restantes

    }

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
    buscaRealizada.value = false

  }

  return {

    anosOpcoes,
    niveisOpcoes,
    eixosOpcoes,
    conteudosOpcoes,
    estadoOpcoes,

    buscaRealizada,
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

    definirModoVisualizacao,
    definirOrdenacao,
    limparFiltros

  }

})
