<script setup>
import { ref } from 'vue'

import CardQuestao  from '@/components/layout/Questoes_card.vue'
import Filtros  from '@/components/layout/Filtro.vue'

const aberta = ref(null);
const opcaoSelecionada = ref("Ordenar por");
const sidebarWidth = ref(280);

function barra(id){
    if(aberta.value === id){
      aberta.value = null
    }
    else{
      aberta.value = id
    }
  }

function selecionar(opcao){
    opcaoSelecionada.value = opcao
    aberta.value = null
}
</script>

<template>

<div class="layout-geral">

<Filtros class="sidebar" :v-model="sidebarWidth" />
    <main class="conteudo">

        <header class="topbar">

            <div class="resultado">
                1.248 questões encontradas
            </div>

            <div class="acoes">

                <div class="dropdown">

                    <div @click="barra(1)" id="ordenar">
                        <span>{{ opcaoSelecionada }}</span>
                        <span class="material-icons">
                            arrow_drop_down
                        </span>

                    </div>

                    <div
                      class="descolapsado"
                      v-if="aberta === 1"
                    >

                        <div
                          class="item"
                          @click="selecionar('Mais recentes')"
                        >
                            Mais recentes
                        </div>

                        <div
                          class="item"
                          @click="selecionar('Ordem alfabetica')"
                        >
                            Ordem alfabetica
                        </div>

                        <div
                          class="item"
                          @click="selecionar('Nivel de dificuldade')"
                        >
                            Nivel de dificuldade
                        </div>

                    </div>

                </div>

                <button class="view-btn active">
                    <span class="material-icons">
                        view_list
                    </span>
                </button>

                <button class="view-btn">
                    <span class="material-icons">
                        grid_view
                    </span>
                </button>

            </div>

        </header>

        <section class="cards">

            <div class="lista-cards">

                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />
                <CardQuestao />

            </div>

        </section>

    </main>

</div>

</template>

<style scoped>
*{
    box-sizing: border-box;
}

body{
    margin: 0;
}

.layout-geral{
    display: flex;

    width: 100%;
    height: 100vh;

    overflow: hidden;

    background: #f7f7f7;
}

.sidebar{
    flex-shrink: 0;
    width: 240px;
    height: 100vh;

    background: white;

    border-right: 1px solid #e5e5e5;

    overflow: hidden;
}

.conteudo{
    flex: 1;

    display: flex;
    flex-direction: column;

    min-width: 0;

    padding: 24px;

    overflow: hidden;
}

.topbar{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.resultado{
    font-size: 22px;
    color: #222;
}

.acoes{
    display: flex;
    align-items: stretch;
    gap: 12px;
    height: 50px;
}

.dropdown{
    position: relative;
}

#ordenar{
    width: 240px;
    height: 50px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.descolapsado{
    position: absolute;

    top: 58px;
    left: 0;
    width: 100%;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #ddd;
    z-index: 100;
}

.item{
    padding: 14px 18px;
    cursor: pointer;
    transition: 0.2s;
}

.item:hover{
    background: #f5f5f5;
}

.view-btn{
    width: 50px;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    transition: 0.2s;
}

.view-btn:hover{
    background: #f5f5f5;
}

.view-btn.active{
    background: #e8f5eb;
    border-color: #b6d8bd;
}

.cards{
    flex: 1;
    overflow: hidden;
}

.lista-cards{
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding-right: 8px;
}

.material-icons{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
</style>