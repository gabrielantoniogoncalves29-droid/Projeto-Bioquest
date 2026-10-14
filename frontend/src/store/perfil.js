import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { buscarPerfil, atualizarPerfil } from "@/services/perfil"

export const usePerfilStore = defineStore("perfil", () => {

    // Estado de carregamento
    const carregando = ref(false)
    const carregado = ref(false)

    // Dados do usuário
    const nome = ref("")
    const email = ref("")
    const foto = ref(null)

    // Edição de perfil (controla o modal)
    const editandoPerfil = ref(false)
    const salvandoPerfil = ref(false)

    // Exclusão de conta (LGPD)
    const excluindoConta = ref(false)
    const excluindoContaConfirmacao = ref(false)

    // Questões marcadas para revisar
    const questoesRevisarLista = ref([])

    // Questões
    const questoesSalvasLista = ref([])
    const questoesResolvidasLista = ref([])
    const acertos = ref(0)


    // Iniciais do nome, usadas como avatar quando não há foto
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


    async function carregarPerfil() {

        if (carregando.value) return

        carregando.value = true

        const dados = await buscarPerfil()

        nome.value = dados.nome
        email.value = dados.email
        foto.value = dados.foto

        questoesSalvasLista.value = dados.questoesSalvas
        questoesResolvidasLista.value = dados.questoesResolvidas
        acertos.value = dados.acertos

        carregando.value = false
        carregado.value = true

    }

    function alterarFoto(url) {

        foto.value = url

    }

    function abrirEdicaoPerfil() {

        editandoPerfil.value = true

    }

    function fecharEdicaoPerfil() {

        editandoPerfil.value = false

    }

    async function salvarEdicaoPerfil({ nome: novoNome, email: novoEmail }) {

        salvandoPerfil.value = true

        await atualizarPerfil({ nome: novoNome, email: novoEmail })

        nome.value = novoNome
        email.value = novoEmail

        salvandoPerfil.value = false
        editandoPerfil.value = false

    }

    function salvarQuestao(questao) {

        const jaSalva = questoesSalvasLista.value.some(
            item => item.id === questao.id
        )

        if (jaSalva) return

        questoesSalvasLista.value.unshift(questao)

    }

    function removerQuestaoSalva(id) {

        questoesSalvasLista.value = questoesSalvasLista.value.filter(
            questao => questao.id !== id
        )

    }

    function marcarParaRevisar(questao) {

        const jaMarcada = questoesRevisarLista.value.some(
            item => item.id === questao.id
        )

        if (jaMarcada) return

        questoesRevisarLista.value.unshift(questao)

    }

    function desmarcarParaRevisar(id) {

        questoesRevisarLista.value = questoesRevisarLista.value.filter(
            questao => questao.id !== id
        )

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

        // Simula a chamada ao backend que apaga os dados do usuário
        await new Promise(resolve => setTimeout(resolve, 600))

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
            questoesResolvidasLista.value.find(questao => questao.id === id)
        )

    }

    function adicionarQuestaoResolvida(questao, acertou = false) {

        const jaResolvida = questoesResolvidasLista.value.some(
            item => item.id === questao.id
        )

        if (!jaResolvida) {

            questoesResolvidasLista.value.unshift(questao)

        }

        if (acertou) {

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
