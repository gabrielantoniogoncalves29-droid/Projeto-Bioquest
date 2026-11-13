
<template>
  <div v-if="clientId" class="google">
    <div ref="alvo" class="google-botao"></div>

    <p v-if="erro" class="google-erro" role="alert">
      {{ erro }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/store/auth"
import { useTemaStore } from "@/store/tema"
import { buscarConfig } from "@/services/questoes"
import { carregarGoogle } from "@/services/google"
import { mensagemDeErro } from "@/services/api"
import { destinoSeguro } from "@/utils/destino"

const auth = useAuthStore()
const tema = useTemaStore()
const route = useRoute()
const router = useRouter()

const clientId = ref("")
const alvo = ref(null)
const erro = ref("")

let googleApi = null
let observador = null
let ultimaLargura = 0
let ultimoTema = ""
let desmontado = false

async function aoReceberCredencial({ credential }) {
  erro.value = ""

  try {
    await auth.entrarComGoogle(credential)
    await router.push(destinoSeguro(route.query.redirect))
  } catch (falha) {
    erro.value = mensagemDeErro(
      falha,
      "Não foi possível entrar com o Google."
    )
  }
}

function renderizarBotao(forcar = false) {
  if (!googleApi || !alvo.value) return

  const largura = Math.min(
    400,
    Math.floor(alvo.value.getBoundingClientRect().width)
  )

  if (largura <= 0) return

  const temaAtual = tema.tema === "escuro"
    ? "outline_dark"
    : "outline"

  if (
    !forcar &&
    largura === ultimaLargura &&
    temaAtual === ultimoTema
  ) return

  ultimaLargura = largura
  ultimoTema = temaAtual

  alvo.value.replaceChildren()

  googleApi.accounts.id.renderButton(alvo.value, {
    type: "standard",
    theme: temaAtual,
    size: "large",
    shape: "rectangular",
    text: "continue_with",
    logo_alignment: "left",
    locale: "pt-BR",
    width: largura
  })
}

watch(
  () => tema.tema,
  () => renderizarBotao(true)
)

onMounted(async () => {
  try {
    const { googleClientId } = await buscarConfig()

    if (!googleClientId || desmontado) return

    clientId.value = googleClientId

    await nextTick()

    const google = await carregarGoogle()

    if (desmontado || !alvo.value) return

    googleApi = google

    googleApi.accounts.id.initialize({
      client_id: googleClientId,
      callback: aoReceberCredencial
    })

    renderizarBotao()

    if (typeof ResizeObserver !== "undefined") {
      observador = new ResizeObserver(() => {
        renderizarBotao()
      })

      observador.observe(alvo.value)
    }
  } catch {
    if (!desmontado) {
      clientId.value = ""
    }
  }
})

onUnmounted(() => {
  desmontado = true
  observador?.disconnect()
  observador = null
  googleApi = null
})
</script>

<style scoped>
.google {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  min-width: 0;
   min-height: 46px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.google-botao {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  min-height: 46px;
  box-sizing: border-box;
}

.google-botao :deep(iframe) {
  max-width: 100%;
}

.google-erro {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  color: var(--cor-erro);
}
</style>
