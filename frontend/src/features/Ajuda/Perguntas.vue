<script setup>
import { HelpCircle } from 'lucide-vue-next'
import Colapsavel from './Colapsavel.vue'

defineProps({
  itens: { type: Array, required: true },
  titulo: { type: String, default: 'Dúvidas frequentes' }
})
</script>

<template>
  <div class="faq">
    <h4 class="faq-titulo">
      <HelpCircle :size="20" aria-hidden="true" />
      {{ titulo }}
    </h4>

    <div class="lista-faq">
      <Colapsavel
        v-for="item in itens"
        :key="item.pergunta"
        :titulo="item.pergunta"
        variante="linha"
      >
        <p class="resposta">{{ item.resposta }}</p>
      </Colapsavel>
    </div>
  </div>
</template>

<style scoped>
.faq {
  margin-top: 44px;
  font-family: 'Inter', Arial, sans-serif;
}

.faq-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -.3px;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.faq-titulo svg {
  color: var(--cor-primaria);
}

.lista-faq {
  padding: 6px 28px;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 18px;
  box-shadow: var(--sombra-card);
}

.lista-faq :deep(.colapsavel.linha:last-of-type) {
  border-bottom: none;
}

.resposta {
  margin: 0;
}

@media (max-width: 600px) {
  .lista-faq { padding: 2px 16px; border-radius: 14px; }
}
</style>
