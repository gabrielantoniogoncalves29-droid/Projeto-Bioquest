<script>
</script>

<template>
  <section class="banner">
    <div class="banner_description">
      <h1>BIOLOGIA PARA <br>ENEM</h1>
      <h2>Plataforma 100% gratuita com as ultimas questões de biologia do ENEM <br>para você estudar</h2>
      <button type="button">Começar a estudar</button>
    </div>
  </section>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;

  /* Cores do gradiente e da máscara (modo claro) */
  --banner-topo: #f8faf982;
  --banner-base: #f8faf9;
  --banner-mascara: transparent;

  background-image:
    linear-gradient(
      to bottom,
      var(--banner-topo) 0%,
      transparent 5%
    ),
    linear-gradient(
      to bottom,
      transparent 90%,
      var(--banner-base) 100%
    ),
    linear-gradient(
      var(--banner-mascara),
      var(--banner-mascara)
    ),
    url('@/assets/Banner_top.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  top: 0;
  overflow: hidden;
}
/* Modo escuro: gradiente na cor do fundo escuro + máscara preta translúcida */
[data-tema="escuro"] .banner {
  --banner-topo: #2b2b291a;
  --banner-base: #2b2b29e4;
  --banner-mascara: rgba(0, 0, 0, 0.131);
}

  .banner_description{
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 1rem;
  }
  .banner_description h1{
    font-family: sans-serif;
    font-weight: 800;
    font-size: 54px;
    margin: 0;
    text-align: center;
    line-height: 1.2;
    color: var(--cor-primaria-texto);
  }
  .banner_description h2{
    font-family: sans-serif;
    font-size: 16px;
    color: var(--cor-primaria-texto);
    text-align: center;
  }
  .banner_description button{
    font-family: sans-serif;
    font-size: 16px;
    width: 250px;
    height: 45px;
    border: 0;
    border-radius: 10px;
    background-color: var(--cor-primaria);
    color: var(--cor-texto-invertido);
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    transition: 500ms ease;
  }
  .banner_description button:hover{
    background-color: var(--cor-primaria-hover);
  }

/* ===== Responsivo (celular) ===== */
@media (max-width: 768px){
  .banner{
    height: auto;
    min-height: 420px;
    padding: 2.5rem 0;
  }
  .banner_description{
    gap: 16px;
    margin: 1rem 1.25rem;
  }
  .banner_description h1{
    font-size: clamp(1.9rem, 9vw, 2.6rem);
  }
  .banner_description h2{
    font-size: 0.95rem;
    margin: 0;
  }
  /* o <br> do texto atrapalha em telas pequenas: deixa o texto quebrar sozinho */
  .banner_description h1 br,
  .banner_description h2 br{
    display: none;
  }
  .banner_description button{
    width: 100%;
    max-width: 250px;
  }

  .banner{
    background-image:
      linear-gradient(to bottom, var(--banner-topo) 0%, transparent 5%),
      linear-gradient(to bottom, transparent 90%, var(--banner-base) 100%),
      linear-gradient(var(--banner-mascara), var(--banner-mascara)),
      url('@/assets/Banner_top_mobile.png');
    background-size: cover;
    background-position: center;
  }
}
</style>