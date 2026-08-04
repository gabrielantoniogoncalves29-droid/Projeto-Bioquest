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
  background: rgba(28, 75, 47, 0.855);
  border-top:1px ;
  color: white;
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
  color: white;
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
</style>