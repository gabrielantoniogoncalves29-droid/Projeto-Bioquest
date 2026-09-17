import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTemaStore = defineStore('tema', () => {

    const temaSalvo = localStorage.getItem('bioquest-tema')

    const tema = ref(temaSalvo === 'escuro' ? 'escuro' : 'claro')

    function aplicarNoDocumento() {

        document.documentElement.setAttribute('data-tema', tema.value)

    }

    function alternarTema() {

        tema.value = tema.value === 'claro' ? 'escuro' : 'claro'

    }

    watch(

        tema,

        (valor) => {

            localStorage.setItem('bioquest-tema', valor)
            aplicarNoDocumento()

        },

        { immediate: true }

    )

    return {

        tema,
        alternarTema

    }

})
