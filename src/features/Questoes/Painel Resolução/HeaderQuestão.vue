<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useResolverStore } from '@/store/resolver/resolver'
import { useUiStore } from '@/store/resolver/ui'

const router = useRouter()

const resolver = useResolverStore()
const ui = useUiStore()

const {
    questao,
    questaoAnterior,
    proximaQuestao,
    navegacao
} = storeToRefs(resolver)

const salvo = ref(false)

function salvarQuestao() {

    salvo.value = true

    setTimeout(() => {

        salvo.value = false

    }, 3000)

}

function irAnterior() {

    if (!questaoAnterior.value) return

    router.push(`/resolver/${questaoAnterior.value}`)

}

function irProxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}
</script>

<template>

<div
    v-if="questao"
    class="header-questao"
>


  <div class="header-linha">



    <div class="navegacao">



      <span

        class="texto-info"
        @click="irAnterior"
        :class="{ disabled: !questaoAnterior}"

      >

        ← Anterior

      </span>





      <span class="texto-info-static">


Questão

{{ navegacao.atual }}
de
{{ navegacao.total }}

      </span>





      <span

        class="texto-info"
        @click="irProxima"
        :class="{
          disabled: !proximaQuestao
        }"

      >

        Próxima →

      </span>




    </div>



    <div class="info-prova">

      <span class="badge-ano">

        {{ questao.ano }}

      </span>

      <span class="codigo">

        Código:
        {{ questao.id }}

      </span>

    </div>



    <div class="acoes">



      <button
          class="btn-salvar"
          :class="{ salvo }"
          @click="salvarQuestao"
      >

          <span class="material-icons salvar">

              {{ salvo ? 'bookmark' : 'bookmark_border' }}

          </span>

          {{ salvo ? 'Salvo' : 'Salvar questão' }}

      </button>



      <button
          @click="ui.alternarBarra"
          class="details-btn"
      >

          <svg
              class="botao-toggle"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
          >

              <polyline
                  v-if="!ui.aberto"
                  points="15 18 9 12 15 6"
              />

              <polyline
                  v-else
                  points="9 18 15 12 9 6"
              />

          </svg>

          <span>Ver detalhes</span>

      </button>



    </div>



  </div>


</div>

</template>

<style scoped>

.header-questao {
  padding: 18px 28px;
  border-bottom: 1px solid #e9ecef;
}

.header-linha {
  display: flex;
  align-items: center;
  gap: 110px;
  margin-left: 0px;  
}

.navegacao {

  display: flex;
  align-items: center;
  gap: 17px;

}

.texto-info {

  color: #2a313dc6;
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  cursor: pointer;
  transition: all .15s ease;
}

.texto-info-static {

  color: #282f3bd7;
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
}

.texto-info:hover {
  color: #0d6b4d;
}

.info-prova {
  display: flex;
  align-items: center;
  gap: 14px;
}

.acoes {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-left: auto;
}

.badge-ano {
  background: none;
  color: #0d6b4d;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
}

.codigo {
  color: #5d636f;
  font-size: 14px;
}


/* ===========================================
BOTÃO SALVAR — com animação de confirmação
=========================================== */

.btn-salvar {
  display: flex;
  align-items: center;
  gap: 6px;

  background: transparent;
  color: #0d6b4d;
  font-weight: 600;
  font-size: 14px;

  border: 1px solid white;
  border-radius: 10px;
  padding: 8px 10px;

  cursor: pointer;
  transition: background .25s ease, color .25s ease;
}

.btn-salvar.salvo {
  color: #0d6b4d;
}

.btn-salvar .salvar {
  display: inline-flex;
  transition: transform .25s ease;
}

.btn-salvar.salvo .salvar {
  animation: pop-salvo .45s ease;
}

@keyframes pop-salvo {

  0% {
    transform: scale(1);
  }

  45% {
    transform: scale(1.35) rotate(-8deg);
  }

  100% {
    transform: scale(1);
  }

}


.details-btn{

    display:flex;

    align-items:center;

    gap:4px;

    padding:8px 14px;

    border:none;

    border-radius:10px;

    background:transparent;

    color:#707070;

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    transition:
        background .25s,
        color .25s,
        transform .2s;

}

.details-btn:hover{

    color:#0d6b4d;

}



.botao-toggle{

    flex-shrink:0;

    transition:transform 5s ease;

}

.details-btn.aberto .botao-toggle{

    transform:rotate(180deg);


}

.details-btn:hover .botao-toggle{

    transform:translateX(1px);

}


.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}

@media (max-width: 768px) {

  .header-linha {
    flex-wrap: wrap;
    gap: 14px;
  }

}

</style>