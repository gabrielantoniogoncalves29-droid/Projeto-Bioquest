import {createRouter , createWebHistory} from 'vue-router';
import Home from '@/pages/Home.vue'
import Questoes from '@/pages/Questoes.vue';
import Estatisticas from '@/pages/Estatisticas.vue';
import Ajuda from '@/pages/Ajuda.vue';
import Perfil from '@/pages/Perfil.vue';
import Resolver from '@/features/Questoes/Painel Resolução/ResolverQuestao.vue';
import Detalhes from '@/features/Questoes/Detalhes/Detalhes.vue';
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
    path:'/resolver/:id',
    name:'Resolver',
    component: Resolver
},
{
    path: '/detalhes/:id',
    name: 'Detalhes',
    component: Detalhes
}

]

const router = createRouter({
    history: createWebHistory('/Projeto-Bioquest/'),
    routes
})

export default router
