import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/tema.css'
import { useTemaStore } from './store/tema.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useTemaStore()

app.mount('#app')

