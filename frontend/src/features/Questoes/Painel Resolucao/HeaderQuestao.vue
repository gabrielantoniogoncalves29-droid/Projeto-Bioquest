<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { Bookmark, Flag } from 'lucide-vue-next'

import { useResolverStore } from '@/store/resolver/resolver'
import { useUiStore } from '@/store/resolver/ui'
import { usePerfilStore } from '@/store/perfil'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const resolver = useResolverStore()
const ui = useUiStore()
const perfil = usePerfilStore()

const {
    questao,
    questaoAnterior,
    proximaQuestao,
    navegacao
} = storeToRefs(resolver)

const salvo = computed(() =>
    !!questao.value &&
    perfil.questoesSalvasLista.some(
        item => item.id === questao.value.id
    )
)

const marcadaParaRevisar = computed(() =>
    !!questao.value &&
    perfil.estaMarcadaParaRevisar(questao.value.id)
)

function irParaLogin() {

    router.push({ name: 'Login', query: { redirect: route.fullPath } })

}

function alternarSalvar() {

    if (!questao.value) return

    if (!auth.autenticado) return irParaLogin()

    if (salvo.value) {

        perfil.removerQuestaoSalva(questao.value.id)

    } else {

        perfil.salvarQuestao(questao.value)

    }

}

function alternarRevisar() {

    if (!questao.value) return

    if (!auth.autenticado) return irParaLogin()

    if (marcadaParaRevisar.value) {

        perfil.desmarcarParaRevisar(questao.value.id)

    } else {

        perfil.marcarParaRevisar(questao.value)

    }

}

function irAnterior() {

    if (!questaoAnterior.value) return

    router.push(`/resolver/${questaoAnterior.value}`)

}

function irProxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}
</script>

<template>

<div
    v-if="questao"
    class="header-questao"
>


  <div class="header-linha">



    <div class="navegacao">



      <button

        type="button"
        class="texto-info texto-info--anterior"
        @click="irAnterior"
        :disabled="!questaoAnterior"
        :class="{ disabled: !questaoAnterior}"

      >

        ← Anterior

      </button>





      <span class="texto-info-static">

        Questão
        {{ navegacao.atual }}
        de
        {{ navegacao.total }}

      </span>





      <button

        type="button"
        class="texto-info texto-info--proxima"
        @click="irProxima"
        :disabled="!proximaQuestao"
        :class="{
          disabled: !proximaQuestao
        }"

      >

        Próxima →

      </button>




    </div>



    <div class="info-prova">

      <span class="badge-ano">

        {{ questao.rotulo }}

      </span>

      <span class="codigo">

        Código:
        {{ questao.id }}

      </span>

    </div>



    <div class="acoes">



      <button
          type="button"
          class="btn-salvar"
          :class="{ salvo }"
          :aria-pressed="salvo"
          :title="!auth.autenticado ? 'Entre na sua conta para salvar questões' : (salvo ? 'Remover dos salvos' : 'Salvar questão')"
          @click="alternarSalvar"
      >

          <Bookmark
              class="icone-acao"
              :size="17"
              :fill="salvo ? 'currentColor' : 'none'"
          />

          <span class="label">{{ salvo ? 'Salvo' : 'Salvar questão' }}</span>

      </button>



      <button
          type="button"
          class="btn-revisar"
          :class="{ marcada: marcadaParaRevisar }"
          :aria-pressed="marcadaParaRevisar"
          :title="!auth.autenticado ? 'Entre na sua conta para marcar questões' : (marcadaParaRevisar ? 'Remover da revisão' : 'Marcar para revisar')"
          @click="alternarRevisar"
      >

          <Flag
              class="icone-acao"
              :size="17"
              :fill="marcadaParaRevisar ? 'currentColor' : 'none'"
          />

          <span class="label">{{ marcadaParaRevisar ? 'Marcada p/ revisão' : 'Marcar para revisar' }}</span>

      </button>



<button
    type="button"
    @click="ui.alternarBarra"
    class="details-btn"
    :class="{ aberto: !ui.aberto }"
    title="Ver detalhes"
>
    <svg
        class="botao-toggle"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>

    <span class="label">{{ ui.aberto ? 'Ocultar' : 'Ver' }} detalhes</span>
</button>



    </div>



  </div>


</div>

</template>

<style scoped>

.header-questao {
  padding: 18px 28px;
  border-bottom: 1px solid var(--cor-borda);
}

.header-linha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 24px;
}

.navegacao {

  display: flex;
  align-items: center;
  gap: 17px;
  flex-shrink: 0;

}

.texto-info {

  color: var(--cor-texto-principal);
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all .15s ease;
}

.texto-info.disabled {

  color: var(--cor-texto-fraco);
  cursor: not-allowed;

}

.texto-info-static {

  color: var(--cor-texto-principal);
  font-size: 15px;
  font-weight: 550;
  font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  white-space: nowrap;

}

.texto-info:not(.disabled):hover {
  color: var(--cor-primaria);
}

.info-prova {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  margin-left: 60px;
}

.acoes {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
  margin-left: auto;
}

.badge-ano {
  background: none;
  color: var(--cor-primaria);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.codigo {
  color: var(--cor-texto-suave);
  font-size: 14px;
  white-space: nowrap;
}

.btn-salvar {
  display: flex;
  align-items: center;
  gap: 6px;

  background: transparent;
  color: var(--cor-primaria);
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;

  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 10px;

  cursor: pointer;
  transition: background .25s ease, color .25s ease;
}

.btn-salvar.salvo {
  color: var(--cor-primaria);
}

.btn-salvar .icone-acao {
  display: inline-flex;
  transition: transform .25s ease;
}

.btn-salvar.salvo .icone-acao {
  animation: pop-salvo .45s ease;
}

@keyframes pop-salvo {

  0% {
    transform: scale(1);
  }

  45% {
    transform: scale(1.35) rotate(-8deg);
  }

  100% {
    transform: scale(1);
  }

}

.btn-revisar {
  display: flex;
  align-items: center;
  gap: 6px;

  background: transparent;
  color: var(--cor-aviso);
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;

  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 10px;

  cursor: pointer;
  transition: background .25s ease, color .25s ease;
}

.btn-revisar.marcada {
  color: var(--cor-aviso);
}

.btn-revisar .icone-acao {
  display: inline-flex;
  transition: transform .25s ease;
}

.btn-revisar.marcada .icone-acao {
  animation: pop-salvo .45s ease;
}


.details-btn{

    display:flex;

    align-items:center;

    gap:4px;

    padding:8px 14px;

    border:none;

    border-radius:10px;

    background:transparent;

    color:var(--cor-texto-suave);

    font-size:14px;

    font-weight:600;

    white-space:nowrap;

    cursor:pointer;

    transition:
        background .25s,
        color .25s,
        transform .2s;

}

.details-btn:hover,
.details-btn.aberto{

    color:var(--cor-primaria);

}


.botao-toggle{

    flex-shrink:0;

    transition:transform .25s ease;

}

.details-btn.aberto .botao-toggle{

    transform:rotate(180deg);


}


@container questao (max-width: 1150px) {

  .header-linha {
    display: grid;

    grid-template-columns: minmax(0, 1fr) auto;

    grid-template-areas:
      "navegacao acoes"
      "info info";

    align-items: center;
    column-gap: 12px;
    row-gap: 16px;
  }

  .navegacao {
    grid-area: navegacao;

    justify-content: flex-start;
    justify-self: start;

    margin: 0;
  }

  .acoes {
    grid-area: acoes;

    justify-content: flex-end;
    justify-self: end;

    gap: 10px;
    margin: 0;
  }

  .info-prova {
    grid-area: info;

    justify-content: center;
    justify-self: center;

    gap: 30px;
    margin: 0;
  }

}


@container questao (max-width: 760px) {
  .header-questao {
    padding: 8px 16px 12px;
  }

  .header-linha {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "navegacao navegacao"
      "info acoes";
    align-items: center;
    column-gap: 12px;
    row-gap: 4px;
  }

  .navegacao {
    grid-area: navegacao;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    justify-self: stretch;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--cor-borda-suave);
  }

  .texto-info,
  .texto-info-static {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-size: 14px;
  }

  .texto-info--anterior {
    justify-self: start;
  }

  .texto-info--proxima {
    justify-self: end;
  }

  .texto-info-static {
    justify-content: center;
    text-align: center;
  }

  .info-prova {
    grid-area: info;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: flex-start;
    justify-self: start;
    gap: 2px 12px;
    min-width: 0;
    margin: 0;
  }

  .badge-ano {
    padding: 0;
    font-size: 15px;
    white-space: normal;
  }

  .codigo {
    display: inline;
    font-size: 13px;
  }

  .acoes {
    grid-area: acoes;
    gap: 4px;
    margin: 0;
    justify-content: flex-end;
    justify-self: end;
  }

  .btn-salvar,
  .btn-revisar {
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
  }

  .btn-salvar .label,
  .btn-revisar .label,
  .details-btn .label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}

@container questao (max-width: 340px) {
  .header-questao {
    padding-inline: 12px;
  }

  .texto-info,
  .texto-info-static {
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .details-btn {
    display: none;
  }
}

.texto-info:disabled {
  cursor: not-allowed;
}

.texto-info:focus-visible,
.btn-salvar:focus-visible,
.btn-revisar:focus-visible,
.details-btn:focus-visible {
  outline: 2px solid var(--cor-primaria);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-salvar.salvo .icone-acao,
  .btn-revisar.marcada .icone-acao {
    animation: none;
  }
}

</style>
