<template>
  <Header/>
  <main class="perfil-page">

    <div class="perfil-container">

      <h1 class="perfil-titulo">Meu Perfil</h1>

      <ProfileCard />

      <nav class="abas" role="tablist" aria-label="Seções do perfil">

        <button
          v-for="aba in abas"
          :key="aba.id"
          class="aba"
          :class="{ ativa: abaAtiva === aba.id, perigo: aba.id === 'reset' }"
          type="button"
          role="tab"
          :aria-selected="abaAtiva === aba.id"
          @click="abaAtiva = aba.id"
        >
          {{ aba.titulo }}
        </button>

      </nav>

      <section class="aba-conteudo" role="tabpanel">

        <MeusDadosTab v-if="abaAtiva === 'dados'" />

        <QuestionList v-else-if="abaAtiva === 'questoes'" />

        <ResetarBancoTab v-else-if="abaAtiva === 'reset'" />

      </section>

    </div>

  </main>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Header from "@/components/layout/Header.vue"
import ProfileCard from "@/features/Perfil/ProfileCard.vue"
import MeusDadosTab from "@/features/Perfil/MeusDadosTab.vue"
import QuestionList from "@/features/Perfil/QuestionList.vue"
import ResetarBancoTab from "@/features/Perfil/ResetarBancoTab.vue"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

const abas = [
  { id: "dados", titulo: "Meus dados" },
  { id: "questoes", titulo: "Minhas questões" },
  { id: "reset", titulo: "Resetar banco de dados" }
]

const abaAtiva = ref("dados")

onMounted(() => {
  perfil.carregarPerfil(true)
})
</script>

<style scoped>

.perfil-page{
    width:100%;
    min-height:100vh;
    padding:28px 24px 48px;
    background:var(--cor-fundo-pagina);
    box-sizing:border-box;
}

.perfil-container{
    width:100%;
    max-width:1100px;
    margin:0 auto;
    display:flex;
    flex-direction:column;
}

.perfil-titulo{
    margin:0;
    padding-bottom:18px;
    font-size:24px;
    font-weight:700;
    color:var(--cor-texto-principal);
    border-bottom:1px solid var(--cor-borda);
}

/* abas (estilo da imagem: texto + linha, ativa em azul) */
.abas{
    display:flex;
    margin-top:8px;
    border-bottom:1px solid var(--cor-borda);
    overflow-x:auto;
}

.aba{
    flex:0 0 auto;
    padding:16px 32px;
    border:none;
    border-bottom:2px solid transparent;
    margin-bottom:-1px;
    background:transparent;
    color:var(--cor-texto-suave);
    font-size:15px;
    font-weight:500;
    white-space:nowrap;
    cursor:pointer;
    transition:color .2s ease, border-color .2s ease;
}

.aba:hover{
    color:var(--cor-texto-principal);
}

.aba.ativa{
    color:var(--cor-primaria);
    border-bottom-color:var(--cor-primaria);
}

.aba.perigo:hover,
.aba.perigo.ativa{
    color:var(--cor-perigo);
}

.aba.perigo.ativa{
    border-bottom-color:var(--cor-perigo);
}

.aba-conteudo{
    padding-top:28px;
}

@media (max-width:768px){

    .perfil-page{
        padding:20px 16px 40px;
    }

    .perfil-titulo{
        font-size:21px;
    }

    .aba{
        padding:14px 18px;
        font-size:14px;
    }

}

</style>
