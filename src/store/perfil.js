import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const usePerfilStore = defineStore("perfil", () => {


    const nome = ref("Gabriel Antônio ")

    const email = ref("gabriel@email.com")

    const foto = ref("@/components/icons/account_circle_45dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.png")


    const questoesSalvas = ref(48)

    const questoesResolvidas = ref(236)

    const acertos = ref(174)

    const porcentagemAcertos = computed(() => {

        if (questoesResolvidas.value === 0) return 0

        return Math.round(
            (acertos.value / questoesResolvidas.value) * 100
        )

    })


    const questoesSalvasLista = ref([

        {
            id: 1,
            ano: 2023,
            numeroQuestao: 91,
            conteudoId: 5,
            subconteudo: "Citologia",
            resumo: "Organelas celulares e suas funções."
        },

        {
            id: 2,
            ano: 2022,
            numeroQuestao: 103,
            conteudoId: 8,
            subconteudo: "Ecologia",
            resumo: "Relações ecológicas."
        },

        {
            id: 3,
            ano: 2021,
            numeroQuestao: 114,
            conteudoId: 11,
            subconteudo: "Genética",
            resumo: "Primeira Lei de Mendel."
        }

    ])

    const questoesResolvidasLista = ref([

        {
            id: 10,
            ano: 2023,
            numeroQuestao: 102,
            conteudoId: 4,
            subconteudo: "Fisiologia",
            resumo: "Sistema digestório."
        },

        {
            id: 11,
            ano: 2022,
            numeroQuestao: 88,
            conteudoId: 2,
            subconteudo: "Botânica",
            resumo: "Tecidos vegetais."
        },

        {
            id: 12,
            ano: 2021,
            numeroQuestao: 97,
            conteudoId: 14,
            subconteudo: "Evolução",
            resumo: "Seleção natural."
        },

        {
            id: 13,
            ano: 2020,
            numeroQuestao: 105,
            conteudoId: 9,
            subconteudo: "Citologia",
            resumo: "Membrana plasmática."
        }

    ])


    const totalSalvas = computed(() => questoesSalvasLista.value.length)

    const totalResolvidas = computed(() => questoesResolvidasLista.value.length)


    function alterarFoto(url) {

        foto.value = url

    }

    function salvarQuestao(questao) {

        questoesSalvasLista.value.unshift(questao)

        questoesSalvas.value = questoesSalvasLista.value.length

    }

    function removerQuestaoSalva(id) {

        questoesSalvasLista.value = questoesSalvasLista.value.filter(

            questao => questao.id !== id

        )

        questoesSalvas.value = questoesSalvasLista.value.length

    }

    function adicionarQuestaoResolvida(questao, acertou = false) {

        questoesResolvidasLista.value.unshift(questao)

        questoesResolvidas.value = questoesResolvidasLista.value.length

        if (acertou) {

            acertos.value++

        }

    }

    return {

        nome,

        email,

        foto,

        questoesSalvas,

        questoesResolvidas,

        acertos,

        porcentagemAcertos,

        questoesSalvasLista,

        questoesResolvidasLista,

        totalSalvas,

        totalResolvidas,

        alterarFoto,

        salvarQuestao,

        removerQuestaoSalva,

        adicionarQuestaoResolvida

    }

})