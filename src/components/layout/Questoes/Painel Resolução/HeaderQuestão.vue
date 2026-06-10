<template>
  <div class="header-questao">

    <div class="header-top">

      <div class="info-esquerda">

        <span class="badge-ano">
          2025
        </span>
        <div class="navegacao">
        <span class="texto-info">&larr; Anterior</span>
  
         <span class="texto-info-static">
          Questão 91 de 100
         </span>
  
         <span class="texto-info">Próxima &rarr;</span>
        </div>
      </div>

      <div class="acoes">

        <button class="btn-salvar">
            <span class="material-icons">
            bookmark_border
            </span> Salvar questão
        </button>

        <button class="btn-detalhes">
          Ver detalhes
        </button>

      </div>

    </div>

    <div class="header-bottom">

      <div class="tags">

        <span class="tag-verde">
          Fisiologia
        </span>

        <span class="tag-azul">
          Hormônios
        </span>

      </div>

      <span class="codigo">
        Código: BIO-2025-091
      </span>

    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>

.header-questao {
  padding: 24px 28px;
  border-bottom: 1px solid #e9ecef;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-esquerda {
  display: flex;
  align-items: center;
  gap: 30px; 
}

.navegacao {

  display: flex;
  flex: 1;               
  justify-content: center;
  align-items: center;
  gap: 17px;               
}




.badge-ano {
  background: #e8f6ef;
  color: #0d6b4d;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.texto-info {

  color: #2a313dc6;           
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  cursor: pointer;
  transition: all .15s ease;
}

.texto-info-static {

  color: #282f3bd7;           
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
}

.texto-info:hover {
  color: #0d6b4d;            
}

.acoes {
  display: flex;
  gap: 12px;

}

.btn-salvar {
  background: transparent;
  color: #0d6b4d;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-detalhes {
  background: white;
  border: 1px solid #0d6b4d;
  color: #0d6b4d;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.header-bottom {
  margin-top: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 10px;
}

.tag-verde {
  background: #e8f6ef;
  color: #0d6b4d;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.tag-azul {
  background: #e7f0ff;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.material-icons{
  vertical-align: middle;
  transform: scale(0.75);
}

.codigo {
  color: #5d636f;
  font-size: 14px;
}

@media (max-width: 768px) {

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }


}

</style>