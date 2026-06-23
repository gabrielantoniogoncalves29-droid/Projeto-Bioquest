<script setup>


import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import { useQuestoesStore } from '@/store/questoes_card.js'



import QuestaoHeader from '@/features/Questoes/Detalhes/Header.vue'

import ClassificacaoEnem from '@/features/Questoes/Detalhes/Classififca.vue'

import EstruturaDidatica from '@/features/Questoes/Detalhes/EstruturaDidatica.vue'

import InformacoesGerais from '@/features/Questoes/Detalhes/InformacoesGerais.vue'

import PalavrasChave from '@/features/Questoes/Detalhes/PalavrasChave.vue'

import Enunciado from '@/features/Questoes/Detalhes/Enunciado.vue'


import NavegacaoLateral from '@/features/Questoes/Detalhes/NavegacaoLateral.vue'

import Estatisticas from '@/features/Questoes/Detalhes/Estatisticas.vue'

import Compartilhar from '@/features/Questoes/Detalhes/compartilhar.vue'

import Header from '@/components/layout/Header.vue'


const route = useRoute()


const store = useQuestoesStore()



const id = Number(route.params.id)




onMounted(async()=>{


const detalhe =
await buscarDetalhesPorId(id)



detalhesStore.carregarDetalhes(detalhe)


})

import { useDetalhesStore }
from '@/store/detalhes.js'

import { buscarDetalhesPorId }
from '@/services/detalhes.js'

const detalhesStore = useDetalhesStore()


const questao = computed(()=>{

    return detalhesStore.detalheAtual

})
</script>





<template>
<Header/>

<div class="pagina">



<div
v-if="!questao"
class="loading"
>

Carregando questão...

</div>





<div
v-else
class="layout"
>



<section class="principal">



<QuestaoHeader

:questao="questao"

/>





<ClassificacaoEnem

:questao="questao"

/>






<EstruturaDidatica

:questao="questao"

/>







<InformacoesGerais

:questao="questao"

/>







<PalavrasChave

:questao="questao"

/>







<Enunciado

:questao="questao"

/>





</section>









<aside class="lateral">





<NavegacaoLateral

:questao="questao"

/>







<Estatisticas

:questao="questao"

/>







<Compartilhar

:questao="questao"

/>





</aside>





</div>



</div>


</template>








<style scoped>


.pagina{


background:#f7f9f8;


min-height:100vh;


padding:30px;


box-sizing:border-box;


}







.layout{


max-width:1400px;


margin:auto;


display:grid;


grid-template-columns:

minmax(0,1fr) 320px;


gap:22px;


align-items:start;


}






.principal{


min-width:0;


}






.lateral{


position:sticky;


top:20px;


}







.loading{


height:300px;


display:flex;


align-items:center;


justify-content:center;


color:#6b7280;


font-size:18px;


}







@media(max-width:1000px){


.layout{


grid-template-columns:1fr;


}



.lateral{


position:static;


}


}





</style>