<script setup>

import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
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

const resultado = computed(() => ui.resultado)

function selecionarAlternativa(letra) {
    if (resultado.value) return
    ui.selecionarAlternativa(letra)
}

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



    <div class="corpo-alternativa">

      <span v-if="alternativa.texto">

        {{ alternativa.texto }}

      </span>

      <img
        v-if="alternativa.imagem"
        class="imagem-alternativa"
        :src="alternativa.imagem"
        :alt="alternativa.texto || `Alternativa ${alternativa.letra}`"
        loading="lazy"
      >

    </div>

    <Check
      v-if="ehCorreta(alternativa.letra) && (resultado && selecionada === alternativa.letra)"
      class="icone-correta"
      :size="24"
      :stroke-width="2.25"
      aria-label="Alternativa correta"
    />



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


.alternativa span {
  flex: 1;
}

.corpo-alternativa {

  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 8px;

}

.imagem-alternativa {

  display: block;

  max-width: 100%;

  max-height: 280px;

  object-fit: contain;

  align-self: flex-start;

  padding: 4px;

  border-radius: 6px;

  background: #fff;

}

.icone-correta {

  flex-shrink: 0;
  margin-left: auto;

  color: var(--cor-acerto);

  animation: icone-pop .35s cubic-bezier(.34, 1.56, .64, 1) both;

}

@keyframes icone-pop {

  from {
    opacity: 0;
    transform: scale(.4) rotate(-20deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }

}

@media (prefers-reduced-motion: reduce) {

  .icone-correta {
    animation: none;
  }

}

@container questao (max-width:760px){
  .alternativas-container{
    padding:16px;
    gap:10px;
  }
  .alternativa{
    align-items:flex-start;
    min-height:52px;
    padding:12px 14px;
    gap:12px;
  }
  .letra{
    width:32px;
    height:32px;
    min-width:32px;
    font-size:14px;
  }
  .corpo-alternativa{
    padding-top:4px;
  }
  .alternativa span{
    font-size:15.5px;
    line-height:1.5;
  }
  .icone-correta{
    margin-top:4px;
  }
  .imagem-alternativa{
    max-height:none;
    height:auto;
  }
}
@container questao (max-width:340px){
  .alternativas-container{
    padding:12px;
  }
  .alternativa{
    padding:10px 12px;
    gap:10px;
  }
}
.alternativa:focus-visible{
  outline:2px solid var(--cor-primaria);
  outline-offset:2px;
}
</style>
