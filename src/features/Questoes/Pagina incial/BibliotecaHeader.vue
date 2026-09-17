<template>
  <section class="header-biblioteca">
    <div class="texto">
      <h1>Biblioteca de Questões</h1>

      <p>
        Explore, filtre e encontre questões de Biologia para praticar seus conhecimentos.
      </p>
    </div>
  </section>
</template>

<style scoped>
.header-biblioteca {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 15px;
  margin: 0 0;
  text-align: center;
}

.texto {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-width: 750px;
}

.texto h1 {
  margin: 0 0 10px;

  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--cor-primaria-texto);
}

.texto p {
  margin: 0;

  font-size: 1rem;
  line-height: 1.6;

  color: var(--cor-texto-suave);
}

/* Tablet */
@media (max-width: 768px) {
  .header-biblioteca {
    padding: 26px 20px;
  }

  .texto h1 {
    font-size: 1.7rem;
  }

  .texto p {
    font-size: 0.95rem;
  }
}

/* Celular */
@media (max-width: 480px) {
  .header-biblioteca {
    padding: 22px 16px;
  }

  .texto h1 {
    font-size: 1.45rem;
  }

  .texto p {
    font-size: 0.88rem;
    line-height: 1.5;
  }
}
</style>