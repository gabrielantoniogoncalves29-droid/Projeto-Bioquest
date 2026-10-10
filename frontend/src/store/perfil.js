import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {
    buscarPerfil,
    atualizarPerfil,
    enviarFotoPerfil,
    excluirDadosDoPerfil
} from "@/services/perfil"
import {
    salvarQuestaoNoServidor,
    removerQuestaoSalvaNoServidor,
    marcarRevisarNoServidor,
    desmarcarRevisarNoServidor
} from "@/services/questoes"

export const usePerfilStore = defineStore("perfil", () => {

    const carregando = ref(false)
    const carregado = ref(false)

    const nome = ref("")
    const email = ref("")
    const foto = ref(null)

    const editandoPerfil = ref(false)
    const salvandoPerfil = ref(false)
    const enviandoFoto = ref(false)
    const erroPerfil = ref("")

    const excluindoConta = ref(false)
    const excluindoContaConfirmacao = ref(false)

    const questoesRevisarLista = ref([])

    const questoesSalvasLista = ref([])
    const questoesResolvidasLista = ref([])
    const acertos = ref(0)


    const iniciais = computed(() => {

        return nome.value
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase()

    })

    const totalSalvas = computed(() => questoesSalvasLista.value.length)

    const totalResolvidas = computed(() => questoesResolvidasLista.value.length)

    const totalRevisar = computed(() => questoesRevisarLista.value.length)

    const questoesSalvas = totalSalvas
    const questoesResolvidas = totalResolvidas

    const porcentagemAcertos = computed(() => {

        if (totalResolvidas.value === 0) return 0

        const percentual = (acertos.value / totalResolvidas.value) * 100

        return Math.min(100, Math.round(percentual))

    })


    async function carregarPerfil(forcar = false) {

        if (carregando.value) return

        if (carregado.value && !forcar) return

        carregando.value = true

        try {

            const dados = await buscarPerfil()

            nome.value = dados.nome
            email.value = dados.email
            foto.value = dados.foto

            questoesSalvasLista.value = dados.questoesSalvas
            questoesResolvidasLista.value = dados.questoesResolvidas
            questoesRevisarLista.value = dados.questoesRevisar
            acertos.value = dados.acertos

            carregado.value = true

        } finally {

            carregando.value = false

        }

    }

    function alterarFoto(url) {

        foto.value = url

    }

    async function enviarFoto(arquivo) {

        if (!arquivo || enviandoFoto.value) return

        enviandoFoto.value = true

        try {

            foto.value = await enviarFotoPerfil(arquivo)

        } finally {

            enviandoFoto.value = false

        }

    }

    function resumoDaQuestao(questao) {

        return {
            id: questao.id,
            ano: questao.ano,
            nivel: questao.nivelId ?? questao.nivel,
            conteudoId: questao.conteudoId,
            subconteudo: questao.subconteudo,
            resumo: questao.resumo
        }

    }

    function abrirEdicaoPerfil() {

        erroPerfil.value = ""
        editandoPerfil.value = true

    }

    function fecharEdicaoPerfil() {

        editandoPerfil.value = false

    }

    async function salvarEdicaoPerfil({ nome: novoNome, email: novoEmail }) {

        salvandoPerfil.value = true
        erroPerfil.value = ""

        try {

            const dados = await atualizarPerfil({ nome: novoNome, email: novoEmail })

            nome.value = dados.nome
            email.value = dados.email

            editandoPerfil.value = false

        } catch (erro) {

            erroPerfil.value = erro.response?.data?.erro ?? "Não foi possível salvar o perfil"

        } finally {

            salvandoPerfil.value = false

        }

    }

    async function salvarQuestao(questao) {

        const jaSalva = questoesSalvasLista.value.some(
            item => item.id === questao.id
        )

        if (jaSalva) return

        const anterior = questoesSalvasLista.value

        questoesSalvasLista.value = [resumoDaQuestao(questao), ...anterior]

        try {

            await salvarQuestaoNoServidor(questao.id)

        } catch {

            questoesSalvasLista.value = anterior

        }

    }

    async function removerQuestaoSalva(id) {

        const anterior = questoesSalvasLista.value

        questoesSalvasLista.value = anterior.filter(
            questao => questao.id !== id
        )

        try {

            await removerQuestaoSalvaNoServidor(id)

        } catch {

            questoesSalvasLista.value = anterior

        }

    }

    async function marcarParaRevisar(questao) {

        const jaMarcada = questoesRevisarLista.value.some(
            item => item.id === questao.id
        )

        if (jaMarcada) return

        const anterior = questoesRevisarLista.value

        questoesRevisarLista.value = [resumoDaQuestao(questao), ...anterior]

        try {

            await marcarRevisarNoServidor(questao.id)

        } catch {

            questoesRevisarLista.value = anterior

        }

    }

    async function desmarcarParaRevisar(id) {

        const anterior = questoesRevisarLista.value

        questoesRevisarLista.value = anterior.filter(
            questao => questao.id !== id
        )

        try {

            await desmarcarRevisarNoServidor(id)

        } catch {

            questoesRevisarLista.value = anterior

        }

    }

    function estaMarcadaParaRevisar(id) {

        return questoesRevisarLista.value.some(
            questao => questao.id === id
        )

    }

    function abrirExclusaoConta() {

        excluindoContaConfirmacao.value = true

    }

    function fecharExclusaoConta() {

        excluindoContaConfirmacao.value = false

    }

    async function excluirConta() {

        excluindoConta.value = true

        try {

            await excluirDadosDoPerfil()

        } catch {

            excluindoConta.value = false

            return

        }

        nome.value = ""
        email.value = ""
        foto.value = null

        questoesSalvasLista.value = []
        questoesResolvidasLista.value = []
        questoesRevisarLista.value = []
        acertos.value = 0

        carregado.value = false
        excluindoConta.value = false
        excluindoContaConfirmacao.value = false

    }

    function obterQuestaoPorId(id) {

        return (
            questoesSalvasLista.value.find(questao => questao.id === id) ||
            questoesResolvidasLista.value.find(questao => questao.id === id) ||
            questoesRevisarLista.value.find(questao => questao.id === id)
        )

    }

    function adicionarQuestaoResolvida(questao, acertou = false, totalAcertos = null) {

        questoesResolvidasLista.value = [
            resumoDaQuestao(questao),
            ...questoesResolvidasLista.value.filter(item => item.id !== questao.id)
        ]

        if (totalAcertos !== null) {

            acertos.value = totalAcertos

        } else if (acertou) {

            acertos.value++

        }

    }

    return {

        carregando,
        carregado,

        nome,
        email,
        foto,
        iniciais,

        editandoPerfil,
        salvandoPerfil,
        enviandoFoto,
        erroPerfil,

        excluindoConta,
        excluindoContaConfirmacao,

        questoesSalvas,
        questoesResolvidas,
        acertos,

        porcentagemAcertos,

        questoesSalvasLista,
        questoesResolvidasLista,
        questoesRevisarLista,

        totalSalvas,
        totalResolvidas,
        totalRevisar,

        carregarPerfil,
        alterarFoto,
        enviarFoto,

        abrirEdicaoPerfil,
        fecharEdicaoPerfil,
        salvarEdicaoPerfil,

        salvarQuestao,
        removerQuestaoSalva,
        marcarParaRevisar,
        desmarcarParaRevisar,
        estaMarcadaParaRevisar,
        adicionarQuestaoResolvida,
        obterQuestaoPorId,

        abrirExclusaoConta,
        fecharExclusaoConta,
        excluirConta

    }

})
