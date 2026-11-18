<script setup>
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const atalhos = [
  { id: 'faq', rotulo: 'Dúvidas frequentes' },
  { id: 'filtros', rotulo: 'Filtros' },
  { id: 'resolver', rotulo: 'Resolver questões' },
  { id: 'conteudos', rotulo: 'Conteúdos' },
  { id: 'perfil', rotulo: 'Perfil e LGPD' }
]

function irPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function aoDigitar(evento) {
  emit('update:modelValue', evento.target.value)
  if (evento.target.value.trim()) irPara('faq')
}
</script>

<template>
  <section class="banner">
    <div class="banner_description">
      <h1>
        Central de
        <span>ajuda</span>
      </h1>

      <p class="banner_subtitulo">
        Tire suas dúvidas, aprenda a usar os filtros, resolver questões e
        gerenciar seu perfil. Tudo o que você precisa para aproveitar o
        BioQuest ao máximo.
      </p>

      <div class="busca" role="search">
        <Search class="busca-icone" :size="20" aria-hidden="true" />
        <input
          :value="props.modelValue"
          type="text"
          placeholder="Busque nas perguntas frequentes..."
          aria-label="Buscar nas perguntas frequentes"
          @input="aoDigitar"
          @keydown.enter.prevent="irPara('faq')"
        >
        <button
          v-if="props.modelValue"
          type="button"
          class="busca-limpar"
          aria-label="Limpar busca"
          @click="emit('update:modelValue', '')"
        >
          <X :size="16" />
        </button>
      </div>

      <nav class="atalhos" aria-label="Seções da página de ajuda">
        <button
          v-for="atalho in atalhos"
          :key="atalho.id"
          type="button"
          class="atalho"
          @click="irPara(atalho.id)"
        >
          {{ atalho.rotulo }}
        </button>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.banner {
  font-family: 'Inter', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 460px;
  padding: 56px 32px 64px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  --banner-topo: #f8faf982;
  --banner-base: #f8faf9;


}

[data-tema="escuro"] .banner {
  isolation: isolate;
  background-image: none;
  background-color: var(--cor-fundo-pagina);
}

[data-tema="escuro"] .banner::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
}

[data-tema="escuro"] .banner::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, .35) 0%, rgba(0, 0, 0, 0) 14%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, var(--cor-fundo-pagina) 100%),
    radial-gradient(ellipse at center, rgba(0, 0, 0, .62) 0%, rgba(0, 0, 0, .5) 55%, rgba(0, 0, 0, .38) 100%);
}

.banner_description {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 820px);
  position: relative;
  z-index: 1;
}

.banner_description h1 {
  margin: 0 0 20px;
  font-size: clamp(40px, 4.6vw, 60px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -1.5px;
  text-align: center;
  color: var(--cor-primaria-texto);
}

.banner_description h1 span {
  color: var(--cor-primaria);
}

.banner_subtitulo {
  max-width: 640px;
  margin: 0 0 28px;
  font-size: 17px;
  line-height: 1.7;
  text-align: center;
  color: var(--cor-primaria-texto);
}

[data-tema="escuro"] .banner_description h1 {
  color: #edf5f1;
  text-shadow: 0 2px 18px rgba(0, 0, 0, .55);
}

[data-tema="escuro"] .banner_description h1 span {
  color: var(--cor-primaria);
}

[data-tema="escuro"] .banner_subtitulo {
  color: #d7e2dc;
  text-shadow: 0 2px 18px rgba(0, 0, 0, .55);
}

.busca {
  position: relative;
  display: flex;
  align-items: center;
  width: min(100%, 560px);
}

.busca-icone {
  position: absolute;
  left: 18px;
  color: var(--cor-texto-suave);
  pointer-events: none;
}

.busca input {
  width: 100%;
  height: 54px;
  padding: 0 48px 0 50px;
  font-family: inherit;
  font-size: 15.5px;
  color: var(--cor-texto-principal);
  background: var(--cor-fundo-card-vidro);
  border: 1px solid var(--cor-borda);
  border-radius: 14px;
  box-shadow: var(--sombra-card);
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.busca input::placeholder {
  color: var(--cor-texto-fraco);
}

.busca input:focus {
  border-color: var(--cor-primaria);
  box-shadow: 0 0 0 4px var(--cor-foco);
}

.busca-limpar {
  position: absolute;
  right: 12px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: var(--cor-fundo-sutil);
  color: var(--cor-texto-secundario);
  cursor: pointer;
}

.busca-limpar:hover {
  color: var(--cor-primaria);
}

.atalhos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}

.atalho {
  padding: 9px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--cor-primaria);
  background: rgba(120, 120, 120, .08);
  border: 1.5px solid var(--cor-primaria);
  border-radius: 11px;
  cursor: pointer;
  transition: background-color .2s ease, transform .2s ease;
}

.atalho:hover {
  background: rgba(120, 120, 120, .18);
  transform: translateY(-2px);
}

.atalho:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .banner {
    min-height: 420px;
    padding: 48px 20px 56px;
  }

  .banner_subtitulo { font-size: 15px; }
  .atalho { font-size: 13px; padding: 8px 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .atalho { transition: none; }
  .atalho:hover { transform: none; }
}
</style>
