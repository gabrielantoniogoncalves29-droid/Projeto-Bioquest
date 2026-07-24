<template>
  <Header/>
  <main class="perfil-page">

    <ProfileCard />

    <ProfileStats />

    <section class="questions-grid">

      <QuestionList
        titulo="Questões salvas"
        tipo="salvas"
      />

      <QuestionList
        titulo="Questões resolvidas"
        tipo="resolvidas"
      />

    </section>

  </main>
</template>

<script setup>
import Header from "@/components/layout/Header.vue"
import ProfileCard from "@/features/Perfil/ProfileCard.vue"
import ProfileStats from "@/features/Perfil/ProfileStats.vue"
import QuestionList from "@/features/Perfil/QuestionList.vue"
</script>

<style scoped>

.perfil-page{

    width:100%;
    min-height:100vh;

    padding:32px;

    background:#f8faf9;

    display:flex;
    flex-direction:column;

    gap:24px;

    box-sizing:border-box;

}

.questions-grid{

    display:grid;

    grid-template-columns:repeat(2,minmax(0,1fr));

    gap:24px;

}

@media (max-width:1100px){

    .questions-grid{

        grid-template-columns:1fr;

    }

}

@media (max-width:768px){

    .perfil-page{

        padding:20px;

        gap:20px;

    }

}

</style>