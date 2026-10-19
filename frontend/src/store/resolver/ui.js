import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('painel', () => {

    const aberto = ref(false)

    const alternativaSelecionada = ref(null)

    const respondendo = ref(false)

    // { correta, resposta, comentario, acertos } devolvido pelo servidor.
    const resultado = ref(null)

    // Mensagem amigável quando enviar a resposta falha.
    const erro = ref('')

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

        alternarBarra,

        selecionarAlternativa,

        limparAlternativa,

        definirResultado,

        definirErro

    }

})
