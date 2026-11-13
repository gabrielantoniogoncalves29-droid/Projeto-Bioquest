import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('painel', () => {

    const aberto = ref(false)

    const alternativaSelecionada = ref(null)

    const respondendo = ref(false)

    const resultado = ref(null)

    const erro = ref('')

    const respostasSessao = ref({})

    function guardarRespostaSessao(id, alternativa, dados) {
        respostasSessao.value = { ...respostasSessao.value, [Number(id)]: { alternativa, resultado: dados } }
    }

    function respostaSessao(id) {
        return respostasSessao.value[Number(id)] ?? null
    }

    function limparRespostasSessao() {
        respostasSessao.value = {}
    }

    function alternarBarra() {
        aberto.value = !aberto.value
    }

    function selecionarAlternativa(letra) {
        alternativaSelecionada.value = letra
    }

    function limparAlternativa() {
        alternativaSelecionada.value = null
        resultado.value = null
        erro.value = ''
    }

    function definirResultado(dados) {
        resultado.value = dados
        erro.value = ''
    }

    function definirErro(mensagem) {
        erro.value = mensagem
    }

    return {

        aberto,

        alternativaSelecionada,

        respondendo,

        resultado,

        erro,

        respostasSessao,

        guardarRespostaSessao,

        respostaSessao,

        limparRespostasSessao,

        alternarBarra,

        selecionarAlternativa,

        limparAlternativa,

        definirResultado,

        definirErro

    }

})
