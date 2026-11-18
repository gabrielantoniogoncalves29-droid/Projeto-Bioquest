import {createRouter , createWebHistory} from 'vue-router';
import Home from '@/pages/Home.vue'
import Questoes from '@/pages/Questoes.vue';
import Estatisticas from '@/pages/Estatisticas.vue';
import Ajuda from '@/pages/Ajuda.vue';
import Perfil from '@/pages/Perfil.vue';
import Login from '@/pages/Login.vue'
import Resolver from '@/features/Questoes/Painel Resolucao/ResolverQuestao.vue';
import DetalhesQuestao from '@/features/Questoes/Detalhes/DetalhesQuestao.vue';
import NaoEncontrada from '@/pages/NaoEncontrada.vue'
import { useAuthStore } from '@/store/auth'
import { destinoSeguro } from '@/utils/destino'
const routes = [
{
    path: '/',
    name: 'Home',
    component: Home
},
{
    path: '/questoes',
    name: 'Questoes',
    component: Questoes
},
{
    path: '/estatisticas',
    name: 'Estatisticas',
    component: Estatisticas,
    meta: { requerLogin: true }
},
{
    path: '/ajuda',
    name: 'Ajuda',
    component: Ajuda
},
{
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta: { requerLogin: true }
},
{
    path: '/login',
    name: 'Login',
    component: Login
},
{
    path: '/confirmar-email',
    name: 'ConfirmarEmail',
    component: Login
},
{
    path: '/redefinir-senha',
    name: 'RedefinirSenha',
    component: Login
},
{
    path:'/resolver/:id(\\d+)',
    name:'Resolver',
    component: Resolver
},
{
    path:'/resolver/:id(\\d+)/detalhes',
    name:'DetalhesQuestao',
    component: DetalhesQuestao
},
{
    path: '/:caminho(.*)*',
    name: 'NaoEncontrada',
    component: NaoEncontrada
}

]

const router = createRouter({
    history: createWebHistory('/Projeto-Bioquest/'),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash, top: 16, behavior: 'smooth' }
        }
        return savedPosition ?? undefined
    }
})

router.beforeEach(async to => {

    const auth = useAuthStore()

    await auth.iniciar()

    if (to.meta.requerLogin && !auth.autenticado) {

        return { name: 'Login', query: { redirect: to.fullPath } }

    }

    if (to.name === 'Login' && auth.autenticado) {

        return destinoSeguro(to.query.redirect)

    }

})

export default router
