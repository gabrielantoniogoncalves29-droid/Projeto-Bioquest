<template>
    <footer class="footer">
      <div class="footer-content">

        <div class="left">
          © 2026 BioQuest  •  Plataforma educacional sem fins lucrativos
        </div>

        <div class="right">
          <a href="#">Contato</a>
          <a href="#">Termos de uso</a>
          <a href="#">Política de privacidade</a>
        </div>

      </div>
    </footer>
</template>

<style scoped>
.footer {
  background-color: var(--cor-primaria-texto);
  border-top:1px ;
  color: var(--cor-texto-invertido);
  padding: 15px 30px;
  box-shadow: 0px -4px 6px  rgba(28, 75, 47, 0.456);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer a {
  color: var(--cor-texto-invertido);
  text-decoration: none;
  margin-left: 20px;
  font-size: 13px;
}

.footer a:hover {
  text-decoration: underline;
}

.left {
  font-size: 13px;
}

.right {
  display: flex;
  gap: 10px;
}

@media (max-width: 640px) {
  .footer {
    padding: 15px 1rem;
  }
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  .right {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 16px;
  }
  .footer a {
    margin-left: 0;
  }
}
</style>