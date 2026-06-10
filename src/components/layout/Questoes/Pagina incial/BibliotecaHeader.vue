<template>

  <section class="header-biblioteca">

    <div class="texto">

      <h1>
        Biblioteca de Questões
      </h1>

      <p>
        Explore e filtre questões de Biologia.
      </p>

    </div>

  </section>

</template>

<script setup>
</script>

<style scoped>

.header-biblioteca {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 20px;

}

.texto h1 {

  font-size: 2.0rem;

  font-weight: 700;

  color: #1f2937;

  margin-bottom: 6px;

}

.texto p {

  font-size: 15px;

  color: #6b7280;

}

.material-icons {

  font-size: 20px;

}

@media (max-width: 768px) {

  .header-biblioteca {

    flex-direction: column;

    align-items: stretch;

  }

  .btn-ajuda {

    width: fit-content;

  }

}

</style>