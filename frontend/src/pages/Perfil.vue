<template>
  <div>
    <Header/>
    <main class="perfil-page">

    <div class="perfil-container">

      <div class="perfil-topo-linha">
        <h1 class="perfil-titulo">Meu Perfil</h1>
        <BotaoAjuda secao="perfil" />
      </div>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Header from "@/components/layout/Header.vue"
import ProfileCard from "@/features/Perfil/ProfileCard.vue"
import MeusDadosTab from "@/features/Perfil/MeusDadosTab.vue"
import QuestionList from "@/features/Perfil/QuestionList.vue"
import ResetarBancoTab from "@/features/Perfil/ResetarBancoTab.vue"
import BotaoAjuda from "@/features/Ajuda/BotaoAjuda.vue"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

const abas = [
  { id: "dados", titulo: "Meus dados" },
  { id: "questoes", titulo: "Minhas questões" },
  { id: "reset", titulo: "Resetar banco de dados e exclusão de conta" }
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
    padding:28px 20px 48px;
    background:var(--cor-fundo-pagina);
    box-sizing:border-box;
}

.perfil-container{
    width:100%;
    max-width:1600px;
    margin:0 auto;
    display:flex;
    flex-direction:column;
}

.perfil-topo-linha{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:16px;
    padding-bottom:18px;
    border-bottom:1px solid var(--cor-borda);
}

.perfil-titulo{
    margin-left: 30px !important;
    margin: 0;
    font-size:24px;
    font-weight:700;
    color:var(--cor-texto-principal);
}

.abas{
    display:flex;
    margin-top:8px;
    border-bottom:1px solid var(--cor-borda);
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

@media (max-width:820px){
    .abas{
        display:grid;
        grid-template-columns:repeat(2, minmax(0, 1fr));
        gap:8px;
        margin-top:4px;
        padding-bottom:12px;
        border-bottom:0;
    }
    .aba{
        min-height:48px;
        padding:10px 12px;
        margin-bottom:0;
        border:1px solid var(--cor-borda);
        border-radius:12px;
        background:var(--cor-fundo-card);
        font-size:14px;
        line-height:1.3;
        text-align:center;
        white-space:normal;
    }
    .aba.ativa{
        background:var(--cor-primaria-fundo);
        border-color:var(--cor-primaria);
    }
    .aba.perigo{
        grid-column:1 / -1;
    }
    .aba.perigo.ativa{
        background:var(--cor-perigo-fundo);
        border-color:var(--cor-perigo);
    }
    .aba:focus-visible{
        outline:2px solid var(--cor-primaria);
        outline-offset:2px;
    }
    .aba-conteudo{
        padding-top:16px;
    }
}
@media (max-width:768px){
    .perfil-page{
        padding:20px 24px 40px;
    }
    .perfil-titulo{
        margin-left:0 !important;
        font-size:22px;
    }
}
@media (max-width:599px){
    .perfil-page{
        padding-inline:20px;
    }
}
@media (max-width:429px){
    .perfil-page{
        padding-inline:16px;
    }
}
</style>
