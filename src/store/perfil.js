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

    // Questões
    const questoesSalvasLista = ref([])
    const questoesResolvidasLista = ref([])
    const acertos = ref(0)


    const totalSalvas = computed(() => questoesSalvasLista.value.length)

    const totalResolvidas = computed(() => questoesResolvidasLista.value.length)

    const questoesSalvas = totalSalvas
    const questoesResolvidas = totalResolvidas

    const porcentagemAcertos = computed(() => {

        if (totalResolvidas.value === 0) return 0

        return Math.round(
            (acertos.value / totalResolvidas.value) * 100
        )

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

        editandoPerfil,
        salvandoPerfil,

        questoesSalvas,
        questoesResolvidas,
        acertos,

        porcentagemAcertos,

        questoesSalvasLista,
        questoesResolvidasLista,

        totalSalvas,
        totalResolvidas,

        carregarPerfil,
        alterarFoto,

        abrirEdicaoPerfil,
        fecharEdicaoPerfil,
        salvarEdicaoPerfil,

        salvarQuestao,
        removerQuestaoSalva,
        adicionarQuestaoResolvida

    }

})
