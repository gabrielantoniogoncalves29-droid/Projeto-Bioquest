<template>

  <section class="header-biblioteca">

    <div class="texto">

      <h1>
        Biblioteca de Questões
      </h1>
      <br>
      <p>
        Explore e filtre questões de Biologia.
      </p>

    </div>

  </section>

</template>



<style scoped>

.header-biblioteca {
  display: flex;
  margin: 0px 30px;
  justify-content: space-between;

  align-items: flex-start;

  gap: 0px;

}

.texto h1 {

  font-size: 2.0rem;

  font-weight: 700;

  color: #1f2937;

  margin: 6px 12px;

}

.texto p {

  font-size: 15px;

  color: #6b7280;
  margin-bottom: 0px;

}

.material-icons {

  font-size: 20px;

}

@media (max-width: 768px) {

  .header-biblioteca {

    flex-direction: column;

    align-items: stretch;

    margin: 0px 20px;

}

  .btn-ajuda {

    width: fit-content;

  }

  .texto h1 {

    font-size: 1.6rem;

    margin: 6px 0px;

  }

  .texto p {

    font-size: 14px;

  }

}

@media (max-width: 480px) {

  .header-biblioteca {

    margin: 0px 12px;

  }

  .texto h1 {

    font-size: 1.4rem;

  }

}

</style>
