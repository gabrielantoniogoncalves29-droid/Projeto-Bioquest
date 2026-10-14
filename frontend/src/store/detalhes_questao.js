import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { buscarDetalhesPorId } from '@/services/detalhes'
import { buscarQuestaoResolver } from '@/services/resolver'
import { buscarIdsQuestoes } from '@/services/questoes'
import { buscarComentariosPorQuestao } from '@/services/comentarios'

// Store da tela "Saiba mais sobre a questão".
// Substitui todos os props/emits entre DetalhesQuestao, InfoQuestao,
// PreviaQuestao, ExplicacaoQuestao e ForumQuestao.

const OBJETOS_ENEM = {
    1: 'Moléculas, células e tecidos',
    2: 'Hereditariedade e diversidade da vida',
    3: 'Identidade dos seres vivos',
    4: 'Ecologia e ciências ambientais',
    5: 'Origem e evolução da vida',
    6: 'Qualidade de vida das populações humanas'
}

export const RAIO_ANEL = 38
export const CIRCUNFERENCIA_ANEL = 2 * Math.PI * RAIO_ANEL

export const useDetalhesQuestaoStore = defineStore('detalhesQuestao', () => {

    // ---------- estado ----------

    const questaoId = ref(null)
    const carregando = ref(true)
    const detalhes = ref(null)
    const questao = ref(null)
    const idsQuestoes = ref([])
    const abaAtiva = ref('explicacao')

    // prévia da questão
    const previaExpandida = ref(false)

    // fórum
    const comentarios = ref([])
    const carregandoComentarios = ref(true)
    const novoComentario = ref('')

    // ---------- navegação entre questões ----------

    const indiceAtual = computed(() =>
        idsQuestoes.value.indexOf(Number(questaoId.value))
    )

    const idAnterior = computed(() =>
        indiceAtual.value > 0
            ? idsQuestoes.value[indiceAtual.value - 1]
            : null
    )

    const idProximo = computed(() =>
        indiceAtual.value !== -1 &&
        indiceAtual.value < idsQuestoes.value.length - 1
            ? idsQuestoes.value[indiceAtual.value + 1]
            : null
    )

    const posicaoNavegacao = computed(() => ({
        atual: indiceAtual.value === -1 ? 0 : indiceAtual.value + 1,
        total: idsQuestoes.value.length
    }))

    // ---------- derivados: prévia / explicação ----------

    const alternativas = computed(() =>
        questao.value?.alternativas ?? []
    )

    const alternativaCorreta = computed(() =>
        questao.value?.alternativas?.find(
            alt => alt.letra === questao.value?.resposta
        )
    )

    const teoria = computed(() =>
        detalhes.value?.teoria ?? []
    )

    // ---------- derivados: cards de informação ----------

    const nomeObjeto = computed(() =>
        OBJETOS_ENEM[detalhes.value?.objeto?.id] ?? 'Não informado'
    )

    const conteudo = computed(() =>
        detalhes.value?.conteudo ?? {}
    )

    const nivel = computed(() =>
        detalhes.value?.nivel ?? 'Não informado'
    )

    const taxaAcerto = computed(() =>
        detalhes.value?.taxaAcerto ?? 0
    )

    const deslocamentoAnel = computed(() =>
        CIRCUNFERENCIA_ANEL * (1 - taxaAcerto.value / 100)
    )

    // ---------- derivados: fórum ----------

    const totalComentarios = computed(() => comentarios.value.length)

    // ---------- ações ----------

    async function carregarComentarios(id) {
        if (!id) {
            comentarios.value = []
            carregandoComentarios.value = false
            return
        }

        carregandoComentarios.value = true
        comentarios.value = await buscarComentariosPorQuestao(id)
        carregandoComentarios.value = false
    }

    async function carregarQuestao(novoId) {
        if (!novoId) return

        const id = Number(novoId)

        questaoId.value = id
        carregando.value = true

        // o fórum acompanha a questão exibida
        carregarComentarios(id)

        const [dadosDetalhes, dadosQuestao] = await Promise.all([
            buscarDetalhesPorId(id),
            buscarQuestaoResolver(id)
        ])

        detalhes.value = dadosDetalhes
        questao.value = dadosQuestao

        if (idsQuestoes.value.length === 0) {
            idsQuestoes.value = await buscarIdsQuestoes()
        }

        carregando.value = false
    }

    // estado de interface volta ao padrão ao entrar na tela
    function reiniciarInterface() {
        abaAtiva.value = 'explicacao'
        previaExpandida.value = false
        novoComentario.value = ''
    }

    function definirAba(aba) {
        abaAtiva.value = aba
    }

    function alternarPrevia() {
        previaExpandida.value = !previaExpandida.value
    }

    function enviarComentario() {
        const texto = novoComentario.value.trim()

        if (!texto) return

        comentarios.value.unshift({
            id: Date.now(),
            autor: 'Você',
            texto,
            data: new Date().toISOString().slice(0, 10)
        })

        novoComentario.value = ''
    }

    return {
        questaoId,
        carregando,
        detalhes,
        questao,
        idsQuestoes,
        abaAtiva,
        previaExpandida,
        comentarios,
        carregandoComentarios,
        novoComentario,

        indiceAtual,
        idAnterior,
        idProximo,
        posicaoNavegacao,
        alternativas,
        alternativaCorreta,
        teoria,
        nomeObjeto,
        conteudo,
        nivel,
        taxaAcerto,
        deslocamentoAnel,
        totalComentarios,

        carregarQuestao,
        carregarComentarios,
        reiniciarInterface,
        definirAba,
        alternarPrevia,
        enviarComentario
    }

})
