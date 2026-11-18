<script setup>

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Info } from 'lucide-vue-next'

import { enviarResposta, corrigirSemConta } from '@/services/questoes'
import { useResolverStore } from '@/store/resolver/resolver'
import { useUiStore } from '@/store/resolver/ui'
import { usePerfilStore } from '@/store/perfil'
import { useAuthStore } from '@/store/auth'

const router = useRouter()

const resolver = useResolverStore()

const ui = useUiStore()

const perfil = usePerfilStore()

const auth = useAuthStore()

const {
    questao,
    proximaQuestao

} = storeToRefs(resolver)

async function responder() {

    if (!questao.value || !ui.alternativaSelecionada || ui.respondendo) return

    const questaoAtual = questao.value

    ui.respondendo = true

    try {

        const alternativa = ui.alternativaSelecionada

        const resultado = auth.autenticado
            ? await enviarResposta(questaoAtual.id, alternativa)
            : await corrigirSemConta(questaoAtual.id, alternativa)

        if (resolver.questao?.id !== questaoAtual.id) return

        ui.definirResultado(resultado)

        if (auth.autenticado) {

            perfil.adicionarQuestaoResolvida(
                questaoAtual,
                resultado.correta,
                resultado.acertos
            )

        } else {

            ui.guardarRespostaSessao(questaoAtual.id, alternativa, resultado)

        }

        } catch (erro) {
        ui.definirErro(
            erro.response?.data?.erro ?? 'Não foi possível enviar a resposta. Tente de novo.'
        )
    } finally {

        ui.respondendo = false

    }

}


function proxima() {

    if (!proximaQuestao.value) return

    router.push(`/resolver/${proximaQuestao.value}`)

}

function saibaMais() {

    if (!questao.value) return

    router.push(`/resolver/${questao.value.id}/detalhes`)

}
</script>


<template>


  <div class="acoes-direita">

        <div class="grupo-esquerda">

      <div class="botoes-info">

        <button
          v-if="ui.resultado?.comentario"
          class="btn-saiba-mais"
          @click="saibaMais"
        >
          Ver resolução comentada
        </button>

        <button class="btn-saiba-mais" @click="saibaMais">
          <Info :size="15" />
          Saiba mais sobre a questão
        </button>

      </div>

      <span
        v-if="ui.erro"
        class="feedback feedback-erro"
      >
        {{ ui.erro }}
      </span>

      <span
        v-if="ui.resultado && !auth.autenticado"
        class="feedback aviso-sem-conta"
      >
        Sua resposta não foi salva.
        <router-link :to="{ name: 'Login', query: { redirect: $route.fullPath } }">Entre na sua conta</router-link>
        para guardar seu progresso.
      </span>

    </div>

    <div class="grupo-direita">



      <button
        class="btn-responder"
        :disabled="!ui.alternativaSelecionada || ui.respondendo || !!ui.resultado"
        @click="responder"
      >
        Responder
      </button>

      <button class="btn-prox" @click="proxima" :disabled="!proximaQuestao">
        Próxima questão →
      </button>

    </div>

  </div>


</template>


<style scoped>


.acoes-direita {

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 14px;

  padding: 16px 20px;

  border-top: 1px solid var(--cor-borda-suave);

  background: var(--cor-fundo-sutil);
}

.grupo-direita {

  display: flex;
  align-items: center;
  gap: 40px;

}

.grupo-esquerda{

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

}

.botoes-info{

  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

}

.btn-saiba-mais{

  display: flex;
  align-items: center;
  gap: 6px;

  border: none;
  background: none;
  color: var(--cor-texto-secundario);

  padding: 10px 38px;

  border-radius: 8px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;
  white-space: nowrap;

  transition: all .15s ease;

}

.btn-saiba-mais:hover{
  border-color: var(--cor-primaria);
  transform: scale(1.01);
  color: var(--cor-primaria);
}

[data-tema="escuro"] .btn-saiba-mais{

  color: var(--cor-texto-principal);

}

.btn-prox {

  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-borda);

  color: var(--cor-texto-secundario);

  padding: 10px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;
  white-space: nowrap;

  transition: all .15s ease;
}

.btn-prox:hover {

  border-color: var(--cor-primaria);

  color: var(--cor-primaria);

  background: var(--cor-primaria-fundo);

}

.btn-prox:disabled {

  opacity: .45;
  cursor: not-allowed;

}

.btn-prox:disabled:hover {

  border-color: var(--cor-borda);
  color: var(--cor-texto-secundario);
  background: var(--cor-fundo-card);

}


.btn-responder {

    background: var(--cor-primaria);

    color: var(--cor-texto-invertido);

    border:none;

    padding: 10px 35px;

    border-radius: 8px;

    font-size: 15px;

    font-weight: 600;

    cursor: pointer;

    white-space: nowrap;

    transition: all .15s ease;
}
.btn-responder:disabled {

  opacity: .45;

  cursor: not-allowed;

}

.feedback {

  font-size: 14px;

  font-weight: 600;

}

.aviso-sem-conta {

  font-weight: 500;

  color: var(--cor-texto-secundario);

}

.aviso-sem-conta a {

  color: var(--cor-primaria);

  font-weight: 600;

}

.feedback-acerto {

  color: var(--cor-acerto);

}

.feedback-erro {

  color: var(--cor-erro);

}

.btn-responder:hover ,
.btn-proxima:hover {

  opacity: .92;

}

@container questao (max-width:760px){
  .acoes-direita{
    flex-direction: column-reverse;
    align-items: stretch;
    row-gap: 12px;
    padding: 16px;
  }
  .grupo-direita{
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 10px;
  }
  .grupo-esquerda{
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .btn-responder,
  .btn-prox{
    min-height: 48px;
    padding: 0 12px;
    font-size: 15px;
    text-align: center;
  }
  .btn-saiba-mais{
    justify-content: center;
    width: 100%;
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid var(--cor-borda);
    background: var(--cor-fundo-card);
    font-size: 14px;
    white-space: normal;
    text-align: center;
  }
  .feedback{
    line-height: 1.5;
  }
}

.btn-responder:focus-visible,
.btn-prox:focus-visible,
.btn-saiba-mais:focus-visible{
  outline: 2px solid var(--cor-primaria);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce){
  .btn-responder,
  .btn-prox,
  .btn-saiba-mais{
    transition: none;
  }
}
</style>
