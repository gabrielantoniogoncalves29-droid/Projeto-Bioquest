import { ref, onUnmounted } from "vue"

export function useContagemRegressiva(segundos) {

    const restante = ref(0)

    let temporizador = null

    function iniciar() {

        clearInterval(temporizador)

        restante.value = segundos

        temporizador = setInterval(() => {

            restante.value--

            if (restante.value <= 0) clearInterval(temporizador)

        }, 1000)

    }

    onUnmounted(() => clearInterval(temporizador))

    return { restante, iniciar }

}
