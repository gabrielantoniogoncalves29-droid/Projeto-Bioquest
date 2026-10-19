import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
    buscarQuestaoPorId,
    buscarExplicacao
} from '@/services/questoes'
import { useResolverStore } from '@/store/resolver/resolver'
import { useTaxonomiaStore } from '@/store/taxonomia'
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

    const resolver = useResolverStore()
    const taxonomia = useTaxonomiaStore()
    const idsQuestoes = computed(() => resolver.idsQuestoes)
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
        detalhes.value?.objeto?.nome ??
        OBJETOS_ENEM[detalhes.value?.objeto?.id] ??
        'Não informado'
    )

    const palavrasChave = computed(() =>
        detalhes.value?.palavrasChave ?? []
    )

    const conteudo = computed(() =>
        detalhes.value?.conteudo ?? {}
    )

    const nivel = computed(() =>
        detalhes.value?.nivel ?? 'Não informado'
    )

        // Percentual de acertos congelado até existir login: a API devolve null e a
    // tela mostra "—" (nunca muda quando o usuário demo responde).
    const taxaAcerto = computed(() =>
        detalhes.value?.taxaAcerto ?? null
    )

    const deslocamentoAnel = computed(() =>
        CIRCUNFERENCIA_ANEL * (1 - (taxaAcerto.value ?? 0) / 100)
    )

    const forumAberto = computed(() => taxonomia.config.forumAberto)

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
                        const [questaoCarregada, explicacaoCarregada] = await Promise.all([
                buscarQuestaoPorId(id),
                buscarExplicacao(id),
                resolver.garantirVetor(id).catch(() => {}),
                taxonomia.carregar()
            ])

            dadosQuestao = questaoCarregada
            explicacao = explicacaoCarregada
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

                // Comentar exige login (ainda não existe): o servidor também recusa com 401.
        if (!texto || !questaoId.value || !forumAberto.value) return

        try {
            const criado = await enviarComentarioDaQuestao(questaoId.value, texto)

            comentarios.value.unshift(criado)

            novoComentario.value = ''
        } catch {
            // 401 (sem login) ou falha de rede: o texto digitado é mantido.
        }
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
        palavrasChave,
        nomeObjeto,
        conteudo,
        nivel,
        taxaAcerto,
        deslocamentoAnel,
                totalComentarios,
        forumAberto,

        carregarQuestao,
        carregarComentarios,
        reiniciarInterface,
        definirAba,
        alternarPrevia,
        enviarComentario
    }

})
