import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buscarTaxonomia, buscarConfig } from '@/services/questoes'
import * as estaticos from '@/features/Questoes/data/filtros.js'

// Mesma regra do backend: id estável do subconteúdo = objeto do livro * 100 + número do C#.
const idDoSubconteudo = (conteudoId, numero) => conteudoId * 100 + numero

// Usado só se a API falhar: o arquivo estático (subconteúdos como lista de nomes)
// é convertido para o mesmo formato da API.
function taxonomiaEstatica() {

  return {
    niveis: estaticos.niveis,
    eixos: estaticos.eixos.map(eixo => ({ ...eixo, nome: eixo.nome.trim() })),
    conteudos: estaticos.conteudos.map(conteudo => ({
      id: conteudo.id,
      eixoId: conteudo.eixoId,
      nome: conteudo.nome.trim(),
      subconteudos: conteudo.subconteudos.map((nome, indice) => ({
        id: idDoSubconteudo(conteudo.id, indice + 1),
        codigo: `C${indice + 1}`,
        numero: indice + 1,
        nome: nome.trim()
      }))
    })),
    anos: estaticos.anos.map(ano => ano.id)
  }

}

export const useTaxonomiaStore = defineStore('taxonomia', () => {

  const dados = ref(taxonomiaEstatica())
  const config = ref({ forumAberto: false, taxaAcertoAtiva: false })
  const carregada = ref(false)

  let pendente = null

  const niveis = computed(() => dados.value.niveis)
  const eixos = computed(() => dados.value.eixos)
  const conteudos = computed(() => dados.value.conteudos)
  const anos = computed(() => dados.value.anos.map(ano => ({ id: ano, nome: String(ano) })))
  const estados = estaticos.estado

  // Carrega uma vez e reaproveita (a API é a fonte; o arquivo estático é só reserva).
  function carregar() {

    if (carregada.value) return Promise.resolve()

    if (!pendente) {

      pendente = Promise.allSettled([buscarTaxonomia(), buscarConfig()])
        .then(([taxonomia, flags]) => {

          if (taxonomia.status === 'fulfilled') {

            dados.value = taxonomia.value
            carregada.value = true

          }

          if (flags.status === 'fulfilled') config.value = flags.value

        })
        .finally(() => {

          pendente = null

        })

    }

    return pendente

  }

  function nomeDoConteudo(id) {

    return conteudos.value.find(conteudo => conteudo.id === id)?.nome ?? ''

  }

  return { niveis, eixos, conteudos, anos, estados, config, carregada, carregar, nomeDoConteudo }

})
