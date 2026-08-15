<template>
  <Header/>
  <main class="perfil-page">

    <ProfileCard />

    <ProfileStats />

    <QuestionList
      titulo="Questões salvas"
      tipo="salvas"
    />

    <QuestionList
      titulo="Questões resolvidas"
      tipo="resolvidas"
    />

  </main>
</template>

<script setup>
import { onMounted } from "vue"
import Header from "@/components/layout/Header.vue"
import ProfileCard from "@/features/Perfil/ProfileCard.vue"
import ProfileStats from "@/features/Perfil/ProfileStats.vue"
import QuestionList from "@/features/Perfil/QuestionList.vue"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

onMounted(() => {

  perfil.carregarPerfil()

})
</script>

<style scoped>

.perfil-page{

    width:100%;
    min-height:100vh;

    margin:0 auto;

    padding:32px;

    background:#f8faf9;

    display:flex;
    flex-direction:column;

    gap:20px;

    box-sizing:border-box;

}

@media (max-width:768px){

    .perfil-page{

        padding:20px;

        gap:16px;

    }

}

</style>
