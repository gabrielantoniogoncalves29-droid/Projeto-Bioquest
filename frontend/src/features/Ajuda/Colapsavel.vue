<script setup>
import { ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  aberto: { type: Boolean, default: false },
  variante: { type: String, default: 'card' }
})

const emit = defineEmits(['update:aberto'])
const interno = ref(props.aberto)

watch(() => props.aberto, valor => { interno.value = valor })

function alternar() {
  interno.value = !interno.value
  emit('update:aberto', interno.value)
}
</script>

<template>
  <div class="colapsavel" :class="[variante, { aberto: interno }]">
    <button
      type="button"
      class="cabecalho"
      :aria-expanded="interno"
      @click="alternar"
    >
      <span v-if="$slots.icone" class="icone-slot" aria-hidden="true">
        <slot name="icone" />
      </span>

      <span class="textos">
        <span class="titulo">{{ titulo }}</span>
        <span v-if="subtitulo" class="subtitulo">{{ subtitulo }}</span>
      </span>

      <ChevronDown class="seta" :size="20" aria-hidden="true" />
    </button>

    <div class="corpo" :class="{ visivel: interno }">
      <div class="corpo-interno">
        <div class="corpo-conteudo">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.colapsavel {
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 14px;
  transition: border-color .2s ease, box-shadow .2s ease;
  font-family: 'Inter', Arial, sans-serif;
}

.colapsavel.card:hover,
.colapsavel.card.aberto {
  border-color: color-mix(in srgb, var(--cor-primaria) 40%, var(--cor-borda));
}

.colapsavel.card.aberto {
  box-shadow: var(--sombra-card);
}

.colapsavel.linha {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--cor-borda-suave);
  border-radius: 0;
}

.cabecalho {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 22px;
  background: transparent;
  border: none;
  border-radius: inherit;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.linha .cabecalho {
  padding: 18px 4px;
}

.cabecalho:focus-visible {
  outline: 2px solid var(--cor-primaria);
  outline-offset: 2px;
}

.icone-slot {
  display: inline-flex;
  flex-shrink: 0;
}

.textos {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 2px;
}

.titulo {
  font-size: 16px;
  font-weight: 650;
  line-height: 1.4;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.subtitulo {
  font-size: 13.5px;
  color: var(--ajuda-texto-suave, var(--cor-texto-suave));
  line-height: 1.5;
}

.seta {
  flex-shrink: 0;
  color: var(--cor-primaria);
  transition: transform .25s ease;
}

.aberto > .cabecalho .seta {
  transform: rotate(180deg);
}

.corpo {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .28s ease;
}

.corpo.visivel {
  grid-template-rows: 1fr;
}

.corpo-interno {
  overflow: hidden;
  min-height: 0;
}

.corpo-conteudo {
  padding: 2px 22px 22px;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  font-size: 15px;
  line-height: 1.75;
}

.linha .corpo-conteudo {
  padding: 0 4px 20px;
}

@media (max-width: 600px) {
  .cabecalho { padding: 16px 16px; gap: 12px; }
  .corpo-conteudo { padding: 2px 16px 18px; }
  .titulo { font-size: 15px; }
}

@media (prefers-reduced-motion: reduce) {
  .corpo, .seta, .colapsavel { transition: none; }
}
</style>
