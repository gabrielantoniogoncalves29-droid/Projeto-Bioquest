import {createRouter , createWebHistory} from 'vue-router';
import Home from '@/pages/Home.vue'
import Questoes from '@/components/layout/Questoes/Pagina incial/Biblioteca.vue';
import Estatisticas from '@/pages/Estatisticas.vue';
import Ajuda from '@/pages/Ajuda.vue';
import Sobre from '@/pages/Sobre.vue';
import Perfil from '@/pages/Perfil.vue';
import Resolver from '@/components/layout/Questoes/Painel Resolução/ResolverQuestao.vue';
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
    component: Estatisticas
},
{
    path: '/ajuda',
    name: 'Ajuda',
    component: Ajuda
},
{
    path: '/perfil',
    name: 'Perfil',
    component: Perfil
},
{
    path: '/resolver',
    name: 'Resolver',
    component: Resolver
}

]

const router = createRouter({
    history: createWebHistory('/Projeto-Bioquest/'),
    routes
})

export default router
