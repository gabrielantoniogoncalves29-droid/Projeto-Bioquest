<script setup>
import { ref } from 'vue'
import { useQuestoesStore } from '@/store/questoes_card.js'
import { useQuestoesFiltrosStore } from '@/store/questoes_filtros.js'

const store = useQuestoesStore()
const filtrosStore = useQuestoesFiltrosStore()

const aberto = ref(false)

const opcoesOrdenacao = [
  { valor: 'recentes', nome: 'Mais recentes' },
  { valor: 'antigas', nome: 'Mais antigas' },
  { valor: 'maiorDificuldade', nome: 'Maior nível' },
  { valor: 'menorDificuldade', nome: 'Menor nível' }
]

function selecionar(valor) {
  filtrosStore.definirOrdenacao(valor)
  aberto.value = false
}
</script>


<template>

<section class="ordenacao">

  <div class="resultado">
    <strong>{{ store.totalQuestoes }}</strong>
    <span>questões encontradas</span>
  </div>

  <div class="direita">

    <div class="ordenar-por">

      <label>Ordenar por</label>

      <div
        class="custom-select"
        :class="{ open: aberto }"
      >

        <button
          class="select-btn"
          type="button"
          @click="aberto = !aberto"
        >

          <span>{{ opcoesOrdenacao.find(o => o.valor === filtrosStore.ordenacao)?.nome }}</span>

          <span class="material-icons seta">
            expand_more
          </span>

        </button>

        <Transition name="menu">
          <div
            v-if="aberto"
            class="select-menu"
          >

            <button
              v-for="opcao in opcoesOrdenacao"
              :key="opcao.valor"
              type="button"
              class="option"
              :class="{ active: filtrosStore.ordenacao === opcao.valor }"
              @click="selecionar(opcao.valor)"
            >

              {{ opcao.nome }}

            </button>

          </div>
        </Transition>

      </div>

    </div>

    <div class="view-buttons">

      <button
        class="view-btn"
        :class="{ active: filtrosStore.modoVisualizacao === 'lista' }"
        title="Visualizar em lista"
        @click="filtrosStore.definirModoVisualizacao('lista')"
      >
        <span class="material-icons">
          view_list
        </span>
      </button>

      <button
        class="view-btn"
        :class="{ active: filtrosStore.modoVisualizacao === 'grade' }"
        title="Visualizar em grade"
        @click="filtrosStore.definirModoVisualizacao('grade')"
      >
        <span class="material-icons">
          grid_view
        </span>
      </button>

    </div>

  </div>

</section>

</template>



<style scoped>
.direita {

  display: flex;

  align-items: center;

  gap: 25px;

}

.view-buttons {

  display: flex;

  gap: 10px;

}

.ordenacao {

  display: flex;
  margin: 0px 50px;
  justify-content: space-between;

  align-items: center;

  gap: 20px;

}

.resultado {

  color: #4b5563;

  font-size: 15px;

}

.resultado strong {

  color: #0d6b4d;

  font-size: 16px;

}

.acoes {

  display: flex;

  align-items: center;

  gap: 10px;

}

.acoes label {

  font-size: 14px;

  color: #6b7280;

}

.acoes select {

  height: 42px;

  border: 1px solid #d1d5db;

  border-radius: 10px;

  padding: 0 12px;

  background: white;

  cursor: pointer;

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

.ordenar-por{

  display:flex;

  align-items:center;

  gap:10px;

}

.ordenar-por label{

  font-size:14px;

  color:#6b7280;

  white-space:nowrap;

}

.custom-select{

  position:relative;

  width:180px;

}

.select-btn{

  width:100%;

  height:40px;

  display:flex;

  align-items:center;

  justify-content:space-between;

  padding:0 14px;

  background:#fff;

  border:1px solid #d1d5db;

  border-radius:10px;

  cursor:pointer;

  font-size:14px;

  color:#374151;

  transition:.2s;

}

.select-btn:hover{

  border-color:#0d6b4d;

}

.select-btn:focus{

  outline:none;

  border-color:#0d6b4d;

  box-shadow:0 0 0 3px rgba(13,107,77,.10);

}

.select-btn .material-icons{

  font-size:22px;

  color:#6b7280;

  transition:.25s;

}

.custom-select.open .seta{

  transform:rotate(180deg);

}

.select-menu{

  position:absolute;

  top:calc(100% + 6px);

  left:0;

  width:100%;

  display:flex;

  flex-direction:column;

  background:white;

  border:1px solid #e5e7eb;

  border-radius:10px;

  overflow:hidden;

  box-shadow:0 10px 30px rgba(0,0,0,.12);

  z-index:100;

}

.option{

  width:100%;

  display:flex;

  align-items:center;

  gap:10px;

  padding:12px 14px;

  border:none;

  background:white;

  text-align:left;

  cursor:pointer;

  font-size:14px;

  color:#374151;

  transition:.15s;

}

.option:hover{

  background:#f3f4f6;

  color:#0d6b4d;

}

.option.active{

  background:#e8f5eb;

  color:#0d6b4d;

  font-weight:500;

}

.select-btn .material-icons{
    font-size:22px;
    color:#6b7280;
}



.custom-select.open .select-menu{
    display:block;
}

.custom-select.open .material-icons{
    transform:rotate(180deg);
}

.option{
    padding:14px 14px;
    cursor:pointer;

    font-size:14px;

    transition:.15s;
}

.option:hover{
    color:#0d6b4d;
}

.option.active{
    background:#e8f5eb;
    color:#0d6b4d;
    font-weight:500;
}

.material-icons{
    transition:.25s;
}
.select-menu{
    position:absolute;

    left:0;

    width:100%;

    background:white;

    border:1px solid #e5e7eb;
    border-radius:12px;

    overflow:hidden;

    box-shadow:0 10px 30px rgba(0,0,0,.12);

    z-index:100;

    display:none;
}

.resultado-acoes{
    display: flex;
    align-items: center;
    gap: 32px;

    padding: 6px 0;
}

.resultado{
    display: flex;
    align-items: baseline;
    gap: 7px;
}

.resultado strong{
    font-size: 16px;
    font-weight: 700;
    color: #0d6b4d;
    line-height: 1;
}

.resultado span{
    font-size: 16px;
    color: #6b7280;
    white-space: nowrap;
}

.resolver-btn{
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 5px 8px;
    border: none;
    border-radius: 6px;
    color: #383939;
    font-family: Arial, sans-serif;
    background: #e8f5eb59;
    font-size: 15px;
    height: 32px;
    font-weight: 500;
    cursor: pointer;

    transition: .2s;
}

.resolver-btn .material-icons{
    font-size: 22px;
    transition: .2s;
}

.resolver-btn:hover{
    color: #0d6b4d;
}

.resolver-btn:hover .material-icons{
    transform: translateX(3px);
}

@media (max-width: 768px) {

  .ordenacao {

    flex-direction: column;

    align-items: stretch;

  }

  .acoes {

    justify-content: space-between;

  }

}

</style>