<template>
  <div class="enunciado-container">

    <div class="imagem-container">

      <img
        src="https://placehold.co/500x280?text=Grafico+da+Questao"
        alt="Gráfico da questão"
      />

    </div>

    <div class="texto-container">

      <h2>
        O gráfico mostra a produção de determinado hormônio
        em diferentes fases da vida de um indivíduo.
      </h2>

      <p>
        A variação observada na produção desse hormônio está
        relacionada à atuação de qual estrutura do sistema
        endócrino?
      </p>

    </div>

  </div>
</template>


<style scoped>

.enunciado-container {

  display: grid;

  grid-template-columns: 45% 55%;

  gap: 20px;

  padding: 20px;

  border-bottom: 1px solid #e9ecef;

}

.imagem-container {

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  overflow: hidden;

  background: white;

}

.imagem-container img {

  width: 100%;

  height: 100%;

  object-fit: cover;

  display: block;

}

.texto-container {

  display: flex;

  flex-direction: column;

  justify-content: center;

}

.texto-container h2 {

  font-size: 1.1rem;

  line-height: 1.6;

  color: #1f2937;

  margin-bottom: 12px;

  font-weight: 600;

}

.texto-container p {

  font-size: 0.95rem;

  line-height: 1.7;

  color: #4b5563;

}

@media (max-width: 1100px) {

  .enunciado-container {

    grid-template-columns: 1fr;

  }

}

</style>