<script setup>
import { ref } from 'vue'

const aberta = ref(null);
const opcaoSelecionada = ref("Ordenar por");

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
 
        <header class="topbar">

            <div class="resultado">
                1.248 questões encontradas
            </div>

            <div class="acoes">

                <div class="dropdown">

                    <div @click="barra(1)" id="ordenar">
                        <span>{{ opcaoSelecionada }}</span>
                        <span class="material-icons">
                            expand_more
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
</template>

<style>
  .dropdown{
    position:sticky;
    top: 0;
    flex-shrink: 0;
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
    font-size: 19px;
    color: #2d2b2b;
}

.acoes{
   display: flex;
    align-items: center;
    gap: 12px;
}

#ordenar{
    width: 210px;
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
    position: relative;
}

.descolapsado{
    position: absolute;

    top: calc(100% + 8px);
    left: 0;

    width: 100%;

    background: white;

    border-radius: 10px;
    border: 1px solid #ddd;

    overflow: hidden;

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

</style>