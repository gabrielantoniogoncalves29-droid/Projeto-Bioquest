import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('painel', () => {

    const aberto = ref(false)

    const alternativaSelecionada = ref(null)

    const respondendo = ref(false)

    const resultado = ref(null)

    function alternarBarra() {
        aberto.value = !aberto.value
    }

    function selecionarAlternativa(letra) {
        alternativaSelecionada.value = letra
    }

    function limparAlternativa() {
        alternativaSelecionada.value = null
        resultado.value = null
    }

    function definirResultado(dados) {
        resultado.value = dados
    }

    return {

        aberto,

        alternativaSelecionada,

        respondendo,

        resultado,

        alternarBarra,

        selecionarAlternativa,

        limparAlternativa,

        definirResultado

    }

})