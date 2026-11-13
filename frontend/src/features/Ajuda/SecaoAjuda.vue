<script setup>
defineProps({
  id: { type: String, required: true },
  titulo: { type: String, required: true },
  destaque: { type: String, default: '' },
  subtitulo: { type: String, default: '' },
  nivel: { type: String, default: 'principal' },
  icone: { type: [Object, Function], default: null },
  faixa: { type: Boolean, default: false }
})
</script>

<template>
  <section
    :id="id"
    class="secao"
    :class="[nivel, { faixa }]"
    :aria-labelledby="`${id}-titulo`"
  >
    <div class="secao-miolo">
      <header class="secao-cabecalho">
        <span
          v-if="icone && nivel === 'principal'"
          class="secao-icone"
          aria-hidden="true"
        >
          <component :is="icone" :size="30" :stroke-width="1.8" />
        </span>

        <div class="secao-textos">
          <component
            :is="nivel === 'principal' ? 'h2' : 'h3'"
            :id="`${id}-titulo`"
            class="secao-titulo"
          >
            {{ titulo }} <span v-if="destaque">{{ destaque }}</span>
          </component>

          <p v-if="subtitulo" class="secao-subtitulo preservar-cor">
            {{ subtitulo }}
          </p>
        </div>
      </header>

      <slot />
    </div>
  </section>
</template>

<style scoped>
.secao {
  width: 100%;
  font-family: 'Inter', Arial, sans-serif;
  scroll-margin-top: 16px;
  color: var(--ajuda-texto, var(--cor-texto-principal));
}

.secao-miolo {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

[data-tema="escuro"] .secao {
  --ajuda-titulo: #edf5f1;
  --ajuda-texto: #d7e2dc;
  --ajuda-texto-suave: #b8cbc1;
}

[data-tema="escuro"] .secao :deep(.preservar-cor) {
  color: var(--ajuda-texto) !important;
}

.secao.principal {
  padding: 72px 28px 64px;
}

.secao.principal.faixa {
  background: var(--cor-fundo-sutil);
  border-top: 1px solid var(--cor-borda);
  border-bottom: 1px solid var(--cor-borda);
}

.principal .secao-cabecalho {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto 44px;
  text-align: left;
}

.secao-icone {
  display: grid;
  place-items: center;
  flex: 0 0 68px;
  width: 68px;
  height: 68px;
  margin: 0;
  color: var(--cor-primaria);
  background: none;
  border: 1px solid var(--cor-borda);
  border-radius: 20px;
}

.secao-textos {
  min-width: 0;
}

.principal .secao-textos {
  flex: 0 1 auto;
  text-align: left;
}

.principal .secao-titulo {
  margin: 0;
  font-size: clamp(32px, 3.8vw, 46px);
  font-weight: 800;
  line-height: 1.14;
  letter-spacing: -1.3px;
  text-align: left;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.principal .secao-subtitulo {
  max-width: 760px;
  margin: 8px 0 0;
  font-size: 17px;
  line-height: 1.7;
  text-align: left;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.secao.sub {
  padding: 40px 0 0;
}

.sub .secao-cabecalho {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 24px;
  padding: 3px 0 3px 18px;
  border-left: 4px solid var(--cor-primaria);
}

.sub .secao-textos {
  width: 100%;
  min-width: 0;
  text-align: left;
}

.sub .secao-titulo {
  margin: 0;
  font-size: clamp(22px, 2.4vw, 28px);
  font-weight: 800;
  letter-spacing: -.6px;
  line-height: 1.25;
  text-align: left;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.sub .secao-subtitulo {
  margin: 6px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  text-align: left;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.secao-titulo span {
  color: var(--cor-primaria);
}

@media (max-width: 700px) {
  .secao.principal { padding: 52px 16px 44px; }
  .principal .secao-cabecalho { gap: 14px; margin-bottom: 30px; }
  .secao-icone {
    flex-basis: 54px;
    width: 54px;
    height: 54px;
    border-radius: 15px;
  }
  .principal .secao-titulo { font-size: clamp(27px, 6vw, 36px); }
  .principal .secao-subtitulo { font-size: 15px; line-height: 1.55; }
  .secao.sub { padding-top: 30px; }
  .sub .secao-cabecalho { padding-left: 14px; }
}

@media (max-width: 380px) {
  .principal .secao-cabecalho { gap: 10px; }
  .secao-icone {
    flex-basis: 46px;
    width: 46px;
    height: 46px;
  }
}
</style>
