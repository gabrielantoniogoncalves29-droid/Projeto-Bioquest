<script setup>
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


  <div class="header-top">


    <div class="info-esquerda">







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



    </div>





    <div class="acoes">



      <button class="btn-salvar">


        <span class="material-icons">

          bookmark_border

        </span>


        Salvar questão


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







<div class="header-bottom">

        <span class="badge-ano">

        {{ questao.ano }}

      </span>

  <span class="codigo">

    Código:
    {{ questao.id }}

  </span>
 


</div>
</div>

</template>

<style scoped>

.header-questao {
  padding: 24px 28px;
  border-bottom: 1px solid #e9ecef;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-esquerda {
  display: flex;
  align-items: center;
  gap: 30px; 
}

.navegacao {

  display: flex;
  flex: 1;               
  justify-content: center;
  align-items: center;
  gap: 17px;               
}




.badge-ano {
  background: none;
  color: #0d6b4d;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
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

.acoes {
  display: flex;
  gap: 12px;

}

.btn-salvar {
  background: transparent;
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
  border: none;
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




.arrow {

  font-size: 13px;

}


.header-bottom {
  margin-top: 18px;

  display: flex;
  justify-content:flex-start;
  gap: 20px;
  align-items: center;
}

.tags {
  display: flex;
  gap: 10px;
}

.tag-verde {
  background: #e8f6ef;
  color: #0d6b4d;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.tag-azul {
  background: #e7f0ff;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}

.codigo {
  color: #5d636f;
  font-size: 14px;
}

@media (max-width: 768px) {

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }


}

</style>