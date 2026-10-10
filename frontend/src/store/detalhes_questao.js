import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
    buscarQuestaoPorId,
    buscarExplicacao,
    buscarIdsQuestoes
} from '@/services/questoes'
import {
    buscarComentariosPorQuestao,
    enviarComentarioDaQuestao
} from '@/services/comentarios'

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

    const questaoId = ref(null)
    const carregando = ref(true)
    const detalhes = ref(null)
    const questao = ref(null)
    const idsQuestoes = ref([])
    const abaAtiva = ref('explicacao')

    const previaExpandida = ref(false)

    const comentarios = ref([])
    const carregandoComentarios = ref(true)
    const novoComentario = ref('')

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

    const totalComentarios = computed(() => comentarios.value.length)

    async function carregarComentarios(id) {
        if (!id) {
            comentarios.value = []
            carregandoComentarios.value = false
            return
        }

        carregandoComentarios.value = true

        try {
            const lista = await buscarComentariosPorQuestao(id)

            if (Number(questaoId.value) === Number(id)) {
                comentarios.value = lista
            }
        } catch {
            comentarios.value = []
        } finally {
            carregandoComentarios.value = false
        }
    }

    async function carregarQuestao(novoId) {
        if (!novoId) return

        const id = Number(novoId)

        questaoId.value = id
        carregando.value = true

        carregarComentarios(id)

        let dadosQuestao = null
        let explicacao = null

        try {
            const [questaoCarregada, explicacaoCarregada, ids] = await Promise.all([
                buscarQuestaoPorId(id),
                buscarExplicacao(id),
                idsQuestoes.value.length === 0
                    ? buscarIdsQuestoes()
                    : Promise.resolve(idsQuestoes.value)
            ])

            dadosQuestao = questaoCarregada
            explicacao = explicacaoCarregada
            idsQuestoes.value = ids
        } catch {
            dadosQuestao = null
        }

        if (questaoId.value !== id) return

        if (dadosQuestao && explicacao) {
            detalhes.value = { ...dadosQuestao, teoria: explicacao.teoria }
            questao.value = {
                ...dadosQuestao,
                resposta: explicacao.resposta,
                comentario: explicacao.comentario
            }
        } else {
            detalhes.value = null
            questao.value = null
        }

        carregando.value = false
    }

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

    async function enviarComentario() {
        const texto = novoComentario.value.trim()

        if (!texto || !questaoId.value) return

        const criado = await enviarComentarioDaQuestao(questaoId.value, texto)

        comentarios.value.unshift(criado)

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
