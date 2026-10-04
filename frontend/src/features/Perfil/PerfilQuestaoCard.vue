<script setup>

import { computed } from 'vue'
import { conteudos } from '@/features/Questoes/data/filtros.js'
import { usePerfilStore } from '@/store/perfil'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  }
})

const perfil = usePerfilStore()

const questao = computed(() => perfil.obterQuestaoPorId(props.id))

const conteudo = computed(() => {
  return conteudos.find(c => c.id === questao.value?.conteudoId)
})

const icone = computed(() => {

  return new URL(
    `../Questoes/icons/${questao.value?.conteudoId}.png`,
    import.meta.url
  ).href

})

</script>

<template>

  <div class="card">

    <div class="left">

      <img
        class="icon"
        :src="icone"
        alt="Ícone do conteúdo"
      >

      <div class="content">

        <div class="top">

          <span class="year">
            {{ questao.ano }}
          </span>

          <span class="meta">
            {{ conteudo?.nome }}
          </span>

          <span class="meta">
            Questão #{{ questao.id }}
          </span>

        </div>

        <h3>
          {{ questao.resumo }}
        </h3>

      </div>

    </div>

    <div class="actions">

      <router-link
        :to="`/resolver/${questao.id}`"
        class="btn"
      >
        Ver questão
      </router-link>

    </div>

  </div>

</template>

<style scoped>

.card {
  width: 100%;
  min-height: 118px;

  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  padding: 14px;
  box-sizing: border-box;

  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda-suave);
  border-radius: 12px;

  transition: all .25s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .06);
}

.left {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  flex: 1 1 auto;
  min-width: 0;
}

.icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  margin-bottom: 8px;
  padding-bottom: 8px;

  border-bottom: 1px solid var(--cor-borda);
}

.year {
  color: var(--cor-primaria-texto);
  font-size: 14px;
  font-weight: 700;
}

.meta {
  font-size: 13px;
  color: var(--cor-texto-suave);
  font-weight: 500;
}

h3 {
  margin: 0;

  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.45;
  color: var(--cor-texto-principal);

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.actions {
  display: flex;
  align-items: center;
  margin-left: 20px;
  flex: 0 0 auto;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  padding: 0 16px;
  margin-top: 15px;
  color: var(--cor-primaria);
  background: var(--cor-fundo-card);

  border: 1px solid var(--cor-primaria);
  border-radius: 9px;

  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  transition: all .2s ease;
}

.btn:hover {
  background: var(--cor-primaria);
  color: var(--cor-texto-invertido);
}

@container (max-width: 560px) {

  .card {
    padding: 16px;
  }

  .icon {
    width: 52px;
    height: 52px;
  }

  .top {
    gap: 12px;
    row-gap: 4px;
  }

  .btn {
    padding: 0 12px;
    font-size: 12.5px;
  }

}

@container (max-width: 400px) {

  .card {
    padding: 12px;
    border-radius: 10px;
    gap: 10px;
    min-height: auto;
  }

  .left {
    gap: 10px;
  }

  .icon {
    width: 44px;
    height: 44px;
  }

  .top {
    gap: 8px;
    row-gap: 2px;
  }

  h3 {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }

  .year {
    font-size: 12px;
  }

  .meta {
    font-size: 11px;
  }

  .actions {
    margin-left: 10px;
  }

  .btn {
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
  }

}

/* Fallback for browsers without container query support */
@supports not (container-type: inline-size) {

  @media (max-width: 700px) {

    .card {
      padding: 16px;
    }

    .icon {
      width: 52px;
      height: 52px;
    }

    .btn {
      padding: 0 12px;
      font-size: 12.5px;
    }

  }

}

</style>