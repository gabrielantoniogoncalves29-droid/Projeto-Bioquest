import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {
    buscarPerfil,
    atualizarPerfil,
    enviarFotoPerfil,
    excluirDadosDoPerfil,
    solicitarTrocaDeEmail,
    apagarRespostas,
    apagarSalvas,
    apagarRevisar
} from "@/services/perfil"
import { solicitarRecuperacaoSenha } from "@/services/auth"
import { lerToken, mensagemDeErro } from "@/services/api"
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
    const temSenha = ref(true)
    const emailPendente = ref("")

    const editandoPerfil = ref(false)
    const salvandoPerfil = ref(false)
    const enviandoFoto = ref(false)
    const erroPerfil = ref("")

    const excluindoConta = ref(false)
    const excluindoContaConfirmacao = ref(false)
    const erroExclusao = ref("")

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

        if (!lerToken()) return

        if (carregando.value) return

        if (carregado.value && !forcar) return

        carregando.value = true

        try {

            const dados = await buscarPerfil()

            nome.value = dados.nome
            email.value = dados.email
            foto.value = dados.foto
            temSenha.value = dados.temSenha

            questoesSalvasLista.value = dados.questoesSalvas
            questoesResolvidasLista.value = dados.questoesResolvidas
            questoesRevisarLista.value = dados.questoesRevisar
            acertos.value = dados.acertos

            carregado.value = true

        } finally {

            carregando.value = false

        }

    }

    function limpar() {

        nome.value = ""
        email.value = ""
        foto.value = null
        temSenha.value = true
        emailPendente.value = ""
        erroPerfil.value = ""
        erroExclusao.value = ""

        questoesSalvasLista.value = []
        questoesResolvidasLista.value = []
        questoesRevisarLista.value = []
        acertos.value = 0

        editandoPerfil.value = false
        excluindoContaConfirmacao.value = false
        carregado.value = false

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
            objetoId: questao.objetoId ?? questao.objeto?.id ?? null,
            conteudoId: questao.conteudoId,
            conteudoNome: questao.conteudoNome ?? questao.conteudo?.area?.nome ?? '',
            subconteudoId: questao.subconteudoId ?? null,
            subconteudo: questao.subconteudo,
            resumo: questao.resumo,
            palavrasChave: questao.palavrasChave ?? []
        }

    }

    function abrirEdicaoPerfil() {

        erroPerfil.value = ""
        editandoPerfil.value = true

    }

    function fecharEdicaoPerfil() {

        editandoPerfil.value = false

    }

    async function salvarEdicaoPerfil({ nome: novoNome, email: novoEmail, senha }) {

        salvandoPerfil.value = true
        erroPerfil.value = ""
        emailPendente.value = ""

        try {

            if (novoNome !== nome.value) {

                const dados = await atualizarPerfil({ nome: novoNome })

                nome.value = dados.nome

            }

            if (novoEmail.toLowerCase() !== email.value.toLowerCase()) {

                await solicitarTrocaDeEmail({ novoEmail, senha: temSenha.value ? senha : undefined })

                emailPendente.value = novoEmail

            }

            editandoPerfil.value = false

            return true

        } catch (erro) {

            erroPerfil.value = mensagemDeErro(erro, "Não foi possível salvar o perfil")

            return false

        } finally {

            salvandoPerfil.value = false

        }

    }

    async function solicitarRedefinicaoSenha() {

        await solicitarRecuperacaoSenha(email.value)

    }

    async function resetarResolvidas() {

        await apagarRespostas()

        questoesResolvidasLista.value = []
        acertos.value = 0

    }

    async function resetarSalvas() {

        await apagarSalvas()

        questoesSalvasLista.value = []

    }

    async function resetarRevisar() {

        await apagarRevisar()

        questoesRevisarLista.value = []

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

        erroExclusao.value = ""
        excluindoContaConfirmacao.value = true

    }

    function fecharExclusaoConta() {

        excluindoContaConfirmacao.value = false

    }

    async function excluirConta({ senha, confirmacao }) {

        excluindoConta.value = true
        erroExclusao.value = ""

        try {

            await excluirDadosDoPerfil({ senha: temSenha.value ? senha : undefined, confirmacao })

        } catch (erro) {

            erroExclusao.value = mensagemDeErro(erro, "Não foi possível excluir a conta")

            return false

        } finally {

            excluindoConta.value = false

        }

        limpar()

        return true

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
        temSenha,
        emailPendente,
        iniciais,

        editandoPerfil,
        salvandoPerfil,
        enviandoFoto,
        erroPerfil,

        excluindoConta,
        excluindoContaConfirmacao,
        erroExclusao,

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
        limpar,
        alterarFoto,
        enviarFoto,

        abrirEdicaoPerfil,
        fecharEdicaoPerfil,
        salvarEdicaoPerfil,
        solicitarRedefinicaoSenha,
        resetarResolvidas,
        resetarSalvas,
        resetarRevisar,

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
