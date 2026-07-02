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

<style>
  .banner{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 500px;

    background-image: url('@/assets/Banner.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    transition: all 0.3s ease;
    top: 0;
    overflow: hidden;
  }
  .banner_description{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .banner_description h1{
    font-family: sans-serif;
    font-weight: 800;
    font-size: 54px;
    margin: 0;
    text-align: center;
    line-height: 1.2;
    color: rgb(28, 75, 47);
  }
  .banner_description h2{
    font-family: sans-serif;
    font-size: 16px;
    color: rgb(50, 54, 53);
    text-align: center;
  }
  .banner_description button{
    font-family: sans-serif;
    font-size: 16px;
    width: 250px;
    height: 45px;
    border: 0;
    border-radius: 10px;
    background-color: rgb(28, 75, 47);
    color: white;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
  }
  .banner_description button:hover{
    background-color: rgb(39, 109, 67);
  }
</style>