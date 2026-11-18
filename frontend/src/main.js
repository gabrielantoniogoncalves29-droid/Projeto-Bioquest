import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/tema.css'
import { useTemaStore } from './store/tema.js'
import { useAuthStore } from './store/auth.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useTemaStore()

const auth = useAuthStore()

watch(() => auth.status, status => {
  const rota = router.currentRoute.value

  if (status === 'anonimo' && rota.meta.requerLogin) {
    router.replace({ name: 'Login', query: { redirect: rota.fullPath } })
  }
})

app.mount('#app')

