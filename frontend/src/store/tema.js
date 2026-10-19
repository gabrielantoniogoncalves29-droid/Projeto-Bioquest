import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const CHAVE_ARMAZENAMENTO = 'bioquest-tema'
const PREFERENCIAS = ['claro', 'escuro', 'sistema']

function lerPreferenciaSalva() {

    try {

        const salva = localStorage.getItem(CHAVE_ARMAZENAMENTO)

        return PREFERENCIAS.includes(salva) ? salva : 'sistema'

    } catch {

        return 'sistema'

    }

}

function gravarPreferencia(valor) {

    try {

        localStorage.setItem(CHAVE_ARMAZENAMENTO, valor)

    } catch {

        return

    }

}

export const useTemaStore = defineStore('tema', () => {

    const preferencia = ref(lerPreferenciaSalva())

    const consultaEscuro = typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null

    const sistemaEscuro = ref(Boolean(consultaEscuro?.matches))

    consultaEscuro?.addEventListener?.('change', (evento) => {

        sistemaEscuro.value = evento.matches

    })

    const tema = computed(() => {

        if (preferencia.value === 'sistema') {

            return sistemaEscuro.value ? 'escuro' : 'claro'

        }

        return preferencia.value

    })

    function definirPreferencia(valor) {

        if (PREFERENCIAS.includes(valor)) {

            preferencia.value = valor
            gravarPreferencia(valor)

        }

    }

    function alternarTema() {

        definirPreferencia(tema.value === 'claro' ? 'escuro' : 'claro')

    }

    watch(

        tema,

        (valor) => {

            document.documentElement.setAttribute('data-tema', valor)

        },

        { immediate: true }

    )

    return {

        preferencia,
        tema,
        definirPreferencia,
        alternarTema

    }

})
