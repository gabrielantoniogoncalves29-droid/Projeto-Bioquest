<template>
  <Header/>
  <main class="perfil-page">

    <ProfileCard />

    <QuestionList />

  </main>
</template>

<script setup>
import { onMounted } from "vue"
import Header from "@/components/layout/Header.vue"
import ProfileCard from "@/features/Perfil/ProfileCard.vue"
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

    padding:28px 24px;

    background:var(--cor-fundo-pagina);

    display:flex;
    flex-direction:column;

    gap:20px;

    box-sizing:border-box;

}

.perfil-page > *{

    width:100%;

    max-width:1600px;

    margin:0 auto;

}

@media (max-width:768px){

    .perfil-page{

        padding:20px 16px;

        gap:16px;

    }

}

</style>