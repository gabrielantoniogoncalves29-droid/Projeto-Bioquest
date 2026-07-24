import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('painel', () => {

    const aberto = ref(false)

    const alternativaSelecionada = ref(null)

    function alternarBarra() {
        aberto.value = !aberto.value
    }

    function selecionarAlternativa(letra) {
        alternativaSelecionada.value = letra
    }

    function limparAlternativa() {
        alternativaSelecionada.value = null
    }

    return {

        aberto,

        alternativaSelecionada,

        alternarBarra,

        selecionarAlternativa,

        limparAlternativa

    }

})