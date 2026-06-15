<script setup>
</script>

<template>
  <section
    class="banner">
    <div class="content">

    </div>
  </section>
</template>

<style scoped>
.banner {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-image: url('@/assets/banner2.png');
  background-size: cover;
  background-position: center;

  transition: all 0.3s ease;
  top: 0;
  overflow: hidden;
}



.content {
  text-align: center;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
}

</style>