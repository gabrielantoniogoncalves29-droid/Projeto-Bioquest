<template>

  <div class="alternativas-container">

    <div class="alternativa">
      <div class="letra">A</div>
      <span>Hipotálamo.</span>
    </div>

    <div class="alternativa selecionada">
      <div class="letra letra-selecionada">B</div>
      <span>Hipófise.</span>
    </div>

    <div class="alternativa">
      <div class="letra">C</div>
      <span>Tireoide.</span>
    </div>

    <div class="alternativa">
      <div class="letra">D</div>
      <span>Pâncreas.</span>
    </div>

    <div class="alternativa">
      <div class="letra">E</div>
      <span>Adrenal.</span>
    </div>

  </div>

</template>

<script setup>
</script>

<style scoped>

.alternativas-container {

  padding: 16px 20px;

  display: flex;

  flex-direction: column;

  gap: 8px;

}

.alternativa {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 10px 14px;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  cursor: pointer;

  transition: all .15s ease;

  background: white;

}

.alternativa:hover {

  border-color: #0d6b4d;

  background: #f9fcfa;

}

.letra {

  width: 30px;

  height: 30px;

  min-width: 30px;

  border-radius: 50%;

  border: 2px solid #0d6b4d;

  color: #0d6b4d;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 13px;

}

.alternativa span {

  font-size: 14px;

  line-height: 1.5;

  color: #374151;

}

.selecionada {

  background: #f2fbf7;

  border-color: #0d6b4d;

}

.letra-selecionada {

  background: #0d6b4d;

  color: white;

}

</style>