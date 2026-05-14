<template>
  <div class="card">
    <div class="content">
      <div class="top">
        <span class="year">
          2025
        </span>
        <span>
          Questão 91
        </span>
      </div>
      <h3>
        O gráfico mostra a produção de determinado hormônio
        em diferentes fases da vida.
      </h3>

      <div class="tags">

        <span class="tag green">
          Fisiologia
        </span>

        <span class="tag blue">
          Hormônios
        </span>

      </div>

    </div>

    <button class="btn">
      Resolver
    </button>

  </div>

</template>

<style scoped>

.card {
  width: 100%;
  background: white;
  border: 1px solid #e7ece9;
  border-radius: 10px;
  padding: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  transition: 0.2s;
  box-sizing: border-box;
}


.card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(0,0,0,0.05);
}

.content {
  flex: 1;
  min-width: 0;
}

.top {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
  flex-wrap: wrap;
}

.year {
  background: #e7f5ee;
  color: #1f6f5c;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
}

h3 {
  font-size: 17px;
  line-height: 1.5;
  color: #1f2937;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.green {
  background: #e7f5ee;
  color: #1f8a5b;
}

.blue {
  background: #e8f1ff;
  color: #2767c7;
}

.btn {
  height: 46px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #1f6f5c;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #185546;
}

</style>