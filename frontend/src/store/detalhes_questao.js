import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import {
    buscarQuestaoPorId,
    buscarExplicacao
} from '@/services/questoes'
import { mensagemDeErro } from '@/services/api'
import { useResolverStore } from '@/store/resolver/resolver'
import { useTaxonomiaStore } from '@/store/taxonomia'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/resolver/ui'
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

    const enviandoComentario = ref(false)
    const erroComentario = ref('')

    const questaoId = ref(null)
    const carregando = ref(true)
    const detalhes = ref(null)
    const questao = ref(null)

    const resolver = useResolverStore()
    const taxonomia = useTaxonomiaStore()
    const auth = useAuthStore()
    const painel = useUiStore()
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

    const taxaAcerto = computed(() =>
        detalhes.value?.taxaAcerto ?? null
    )

    const deslocamentoAnel = computed(() =>
        CIRCUNFERENCIA_ANEL * (1 - (taxaAcerto.value ?? 0) / 100)
    )

    const forumAberto = computed(() => taxonomia.config.forumAberto)

    const precisaLogin = computed(() => !auth.autenticado)

    const podeComentar = computed(() => Boolean(forumAberto.value) && auth.autenticado)

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

            const sessao = auth.autenticado ? null : painel.respostaSessao(id)
            const liberada = Boolean(explicacao.liberada || sessao)

            questao.value = {
                ...dadosQuestao,
                liberada,
                resposta: explicacao.resposta ?? sessao?.resultado.resposta ?? null,
                comentario: explicacao.comentario || sessao?.resultado.comentario || ''
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

        if (!texto || !questaoId.value || !podeComentar.value || enviandoComentario.value) return

        enviandoComentario.value = true
        erroComentario.value = ''

        try {
            const criado = await enviarComentarioDaQuestao(questaoId.value, texto)

            comentarios.value.unshift(criado)

            novoComentario.value = ''
                } catch (erro) {
            erroComentario.value = mensagemDeErro(erro, 'Não foi possível enviar o comentário.')
        } finally {
            enviandoComentario.value = false
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
        enviandoComentario,
        erroComentario,

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
        podeComentar,
        precisaLogin,

        carregarQuestao,
        carregarComentarios,
        reiniciarInterface,
        definirAba,
        alternarPrevia,
        enviarComentario
    }

})
