import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarIdsQuestoes } from '@/services/questoes'

const CHAVE_VETOR = 'bioquest:vetor-navegacao'

function lerVetorSalvo() {

  try {

    const bruto = JSON.parse(sessionStorage.getItem(CHAVE_VETOR))

    return Array.isArray(bruto) && bruto.every(Number.isInteger) ? bruto : []

  } catch {

    return []

  }

}

function gravarVetor(ids) {

  try {

    sessionStorage.setItem(CHAVE_VETOR, JSON.stringify(ids))

  } catch {

    // sessionStorage indisponível: o vetor continua só na memória.

  }

}

export const useResolverStore = defineStore('resolver', () => {

  const questao = ref(null)

  // Vetor de navegação: ids na ordem da lista filtrada/ordenada da página inicial.
  // Persistido em sessionStorage para sobreviver a F5 e ao voltar/avançar.
  const idsQuestoes = ref(lerVetorSalvo())

  function definirVetor(ids) {

    idsQuestoes.value = [...ids]
    gravarVetor(idsQuestoes.value)

  }

  // Se o id aberto não está no vetor (acesso direto a /resolver/:id, ou vetor
  // antigo), usa o vetor global por serial como reserva.
  async function garantirVetor(id) {

    if (idsQuestoes.value.includes(Number(id))) return

    definirVetor(await buscarIdsQuestoes())

  }

  const indiceAtual = computed(() => {

    if (!questao.value) return -1

    return idsQuestoes.value.indexOf(questao.value.id)

  })

  // "x de N": x é a posição da questão no vetor (1 = primeira), não o id.
  const navegacao = computed(() => ({

    atual: indiceAtual.value === -1 ? 0 : indiceAtual.value + 1,

    total: idsQuestoes.value.length

  }))

  const questaoAnterior = computed(() => {

    if (indiceAtual.value <= 0) return null

    return idsQuestoes.value[indiceAtual.value - 1]

  })

  const proximaQuestao = computed(() => {

    if (
      indiceAtual.value === -1 ||
      indiceAtual.value >= idsQuestoes.value.length - 1
    ) return null

    return idsQuestoes.value[indiceAtual.value + 1]

  })

  function carregarQuestao(dados) {

    questao.value = dados

  }

  function limpar() {

    questao.value = null

  }

  return {

    questao,
    idsQuestoes,
    navegacao,
    questaoAnterior,
    proximaQuestao,

    definirVetor,
    garantirVetor,
    carregarQuestao,
    limpar

  }

})
