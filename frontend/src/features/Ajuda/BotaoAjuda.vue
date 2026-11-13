<script setup>
import { Info } from 'lucide-vue-next'

defineProps({
  secao: { type: String, required: true },
  rotulo: { type: String, default: 'Como usar esta página' }
})
</script>

<template>
  <router-link
    :to="{ path: '/ajuda', hash: `#${secao}` }"
    class="botao-ajuda"
    :title="rotulo"
    :aria-label="`${rotulo} — abrir a central de ajuda`"
  >
    <Info :size="20" :stroke-width="2" aria-hidden="true" />
  </router-link>
</template>

<style scoped>
.botao-ajuda {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--cor-primaria);
  background: none;
  border: none;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color .2s ease, border-color .2s ease, transform .2s ease;
}

.botao-ajuda:hover {
  transform: translateY(-1px);
}

.botao-ajuda:focus-visible {
  outline: 2px solid var(--cor-primaria);
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .botao-ajuda { width: 38px; padding: 0; justify-content: center; }
  .texto { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .botao-ajuda { transition: none; }
  .botao-ajuda:hover { transform: none; }
}
</style>
