<script setup>

import { computed } from 'vue'
import { useResolverStore } from '@/store/resolver/resolver'
import { useUiStore } from '@/store/resolver/ui'

const resolver = useResolverStore()
const ui = useUiStore()

const alternativas = computed(
    () => resolver.questao?.alternativas ?? []
)

const selecionada = computed(
    () => ui.alternativaSelecionada
)

// Depois de responder a escolha fica travada e as cores mostram o resultado.
const resultado = computed(() => ui.resultado)

function selecionarAlternativa(letra) {
    if (resultado.value) return
    ui.selecionarAlternativa(letra)
}

// Marcada e correta = verde; marcada e errada = vermelha (e a correta fica verde).
function ehCorreta(letra) {
    return !!resultado.value && resultado.value.resposta === letra
}

function ehErrada(letra) {
    return !!resultado.value && selecionada.value === letra && resultado.value.resposta !== letra
}

</script>


<template>

<div class="alternativas-container">


  <div

   v-for="alternativa in alternativas"

    :key="alternativa.letra"

    class="alternativa"
    :class="{
      selecionada: !resultado && selecionada === alternativa.letra,
      correta: ehCorreta(alternativa.letra),
      errada: ehErrada(alternativa.letra),
      bloqueada: !!resultado
    }"

    @click="selecionarAlternativa(alternativa.letra)"

  >


    <div

      class="letra"
      :class="{
        'letra-selecionada': !resultado && selecionada === alternativa.letra,
        'letra-correta': ehCorreta(alternativa.letra),
        'letra-errada': ehErrada(alternativa.letra)
      }"

    >

      {{ alternativa.letra }}

    </div>



    <span>

      {{ alternativa.texto }}

    </span>



  </div>


</div>

</template>




<style scoped>


.alternativas-container {

  padding: 16px 20px;

  display: flex;

  flex-direction: column;

  gap: 8px;

}



.alternativa {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 10px 14px;

  border: 1px solid var(--cor-borda);

  border-radius: 10px;

  cursor: pointer;

  transition: all .15s ease;

  background: var(--cor-fundo-card);

}



.alternativa:hover {

  border-color: var(--cor-primaria);

  background: var(--cor-fundo-sutil);

}



.letra {

  width: 30px;

  height: 30px;

  min-width: 30px;

  border-radius: 50%;

  border: 2px solid var(--cor-primaria);

  color: var(--cor-primaria);

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 13px;

}



.alternativa span {

  font-size: 14px;

  line-height: 1.5;

  color: var(--cor-texto-secundario);

  word-break: break-word;

}



.selecionada {

  background: var(--cor-primaria-fundo);

  border-color: var(--cor-primaria);

}



.letra-selecionada {

  background: var(--cor-primaria);

  color: var(--cor-texto-invertido);

}


.alternativa.bloqueada,
.alternativa.bloqueada:hover {

  cursor: default;

}

.alternativa.correta,
.alternativa.correta:hover {

  background: var(--cor-acerto-fundo);

  border-color: var(--cor-acerto);

}

.alternativa.errada,
.alternativa.errada:hover {

  background: var(--cor-erro-fundo);

  border-color: var(--cor-erro);

}

.letra.letra-correta {

  background: var(--cor-acerto);

  border-color: var(--cor-acerto);

  color: var(--cor-texto-invertido);

}

.letra.letra-errada {

  background: var(--cor-erro);

  border-color: var(--cor-erro);

  color: var(--cor-texto-invertido);

}


@container questao (max-width:420px){

  .alternativas-container{

    padding:12px 14px;
    gap:6px;

  }

  .alternativa{

    padding:9px 12px;
    gap:10px;

  }

  .alternativa span{

    font-size:13.5px;

  }

  .letra{

    width:26px;
    height:26px;
    min-width:26px;
    font-size:12px;

  }

}

@media (max-width:480px){

  .alternativas-container{

    padding:12px 14px;
    gap:6px;

  }

}

</style>
