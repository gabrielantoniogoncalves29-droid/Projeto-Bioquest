import {createRouter , createWebHistory} from 'vue-router';
import Home from '@/pages/Home.vue'
import Questoes from '@/pages/Questoes.vue';
import Estatisticas from '@/pages/Estatisticas.vue';

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
}
]

const router = createRouter({
    history: createWebHistory('/Projeto-Bioquest/'),
    routes
})

export default router
