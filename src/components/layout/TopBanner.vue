<script setup>
</script>

<template>

  <section class="banner">

    <section class="secao">

      <h2>
        O que é a BioQuest?
      </h2>

      <p class="descricao">
        A BioQuest é uma plataforma educacional que reúne questões
        de Biologia do ENEM em um ambiente organizado para consulta,
        estudo e análise.
      </p>

      <div class="grid-info">

        <div class="card-info">
          Eixos temáticos da Matriz de Referência do ENEM
        </div>

        <div class="card-info">
          Competências e habilidades avaliadas
        </div>

        <div class="card-info">
          Conteúdos e subconteúdos de Biologia
        </div>

        <div class="card-info">
          Níveis cognitivos exigidos nas questões
        </div>

        <div class="card-info">
          Informações complementares sobre cada questão
        </div>

      </div>

    </section>

    <section class="secao projeto">

      <h2>
        Sobre o projeto
      </h2>

      <p>
        A BioQuest está em desenvolvimento como parte de um projeto
        de Iniciação Científica voltado à organização e disponibilização
        das questões de Biologia do ENEM. A plataforma integra
        conhecimentos de Biologia, tecnologia e educação para oferecer
        um ambiente digital de consulta, estudo e análise educacional.
      </p>

    </section>

  </section>

</template>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.banner {
  min-height: 1700px;
  width: 100%;

  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.60),
      rgba(255, 255, 255, 0.50)
    ),
    url('@/assets/Design-sem-nome.jpg');

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

}

.secao{
  max-width: 1400px;
 
  padding: 30px 40px;
  text-align: center;
}

.secao h2{
  color: #0d4d3a;
  margin-bottom: 20px;
}

.descricao{
  max-width: 900px;
  margin: auto;
}

.grid-info{
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card-info{
  background: rgba(255,255,255,.85);
  border: 1px solid #d8e6d9;
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(4px);
}

</style>