<template>

    <Teleport to="body">

        <div
            class="overlay"
            @click.self="fechar"
        >

            <div
                class="card"
                @keydown.enter="avancarComEnter($event, podeExcluir ? confirmar : null)"
            >

                <button
                    class="fechar"
                    type="button"
                    :disabled="perfil.excluindoConta"
                    @click="fechar"
                >
                    <X :size="18" />
                </button>


                <h2>Excluir conta e dados</h2>

                <p class="subtitulo">
                    Essa ação é permanente. Todos os seus dados armazenados
                    (perfil, questões salvas, resolvidas e marcadas para
                    revisar) serão apagados, conforme previsto na LGPD, e
                    você não poderá recuperá-los depois.
                </p>

                                <label
                    class="rotulo"
                    for="excluir-confirmacao"
                >
                    Para confirmar, digite seu e-mail: <strong>{{ perfil.email }}</strong>
                </label>

                <input
                    id="excluir-confirmacao"
                    v-model="confirmacao"
                    class="campo"
                    type="email"
                    autocomplete="off"
                    :disabled="perfil.excluindoConta"
                >

                <template v-if="perfil.temSenha">

                    <label
                        class="rotulo"
                        for="excluir-senha"
                    >
                        Sua senha
                    </label>

                    <input
                        id="excluir-senha"
                        v-model="senha"
                        class="campo"
                        type="password"
                        autocomplete="current-password"
                        :disabled="perfil.excluindoConta"
                    >

                </template>

                <p
                    v-if="perfil.erroExclusao"
                    class="erro"
                    role="alert"
                >
                    {{ perfil.erroExclusao }}
                </p>

                <div class="acoes">

                    <button
                        type="button"
                        class="cancelar"
                        :disabled="perfil.excluindoConta"
                        @click="fechar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                                                class="excluir"
                        :disabled="perfil.excluindoConta || !podeExcluir"
                        @click="confirmar"
                    >
                        {{ perfil.excluindoConta ? "Excluindo..." : "Excluir definitivamente" }}
                    </button>

                </div>

            </div>

        </div>

    </Teleport>

</template>

<script setup>

import { ref, computed } from "vue"
import { X } from "lucide-vue-next"
import { useRouter } from "vue-router"
import { usePerfilStore } from "@/store/perfil"
import { useAuthStore } from "@/store/auth"
import { avancarComEnter } from "@/utils/teclado"

const perfil = usePerfilStore()
const auth = useAuthStore()
const router = useRouter()

const confirmacao = ref("")
const senha = ref("")

const podeExcluir = computed(() =>
    confirmacao.value.trim().toLowerCase() === (perfil.email || "").toLowerCase() &&
    (!perfil.temSenha || senha.value.length > 0)
)

function fechar() {

    perfil.fecharExclusaoConta()

}

async function confirmar() {

        if (!podeExcluir.value) return

    const excluida = await perfil.excluirConta({ senha: senha.value, confirmacao: confirmacao.value.trim() })

    if (!excluida) return

    await auth.sair()

    auth.login()

    router.push("/login")

}

</script>

<style scoped>

.overlay{

    position:fixed;
    inset:0;

    display:flex;
    justify-content:center;
    align-items:center;

    background:var(--cor-overlay);
    backdrop-filter:blur(3px);

    z-index:1000;

    padding:20px;
    box-sizing:border-box;

    animation:fade .2s ease;

}

@keyframes fade{

    from{ opacity:0; }
    to{ opacity:1; }

}

.card{

    position:relative;

    width:100%;
    max-width:400px;

    padding:28px;

    background: var(--cor-fundo-card);

    border-radius:16px;

    box-shadow:var(--sombra-modal);

    box-sizing:border-box;

    display:flex;
    flex-direction:column;
    align-items:center;

    text-align:center;

    animation:sobe .2s ease;

}

@keyframes sobe{

    from{ opacity:0; transform:translateY(10px); }
    to{ opacity:1; transform:translateY(0); }

}

.fechar{

    position:absolute;

    top:16px;
    right:16px;

    display:flex;
    align-items:center;
    justify-content:center;

    width:28px;
    height:28px;

    border:none;
    border-radius:50%;

    background:var(--cor-fundo-sutil);
    color:var(--cor-texto-secundario);

    cursor:pointer;

    transition:.15s;

}

.fechar:hover{

    background:var(--cor-borda-suave);
    color:var(--cor-texto-principal);

}

.fechar:disabled{

    opacity:.5;
    cursor:not-allowed;

}

.icone-alerta{

    display:flex;
    align-items:center;
    justify-content:center;

    width:52px;
    height:52px;

    margin-bottom:12px;

    border-radius:50%;

    background:var(--cor-perigo-fundo);
    color:var(--cor-perigo);

}

h2{

    margin:0;

    font-size:19px;

    font-weight:700;

    color:var(--cor-texto-principal);

}

.subtitulo{

    margin:10px 0 4px;

    font-size:13.5px;

    line-height:1.6;

    color:var(--cor-texto-suave);

}

.acoes{

    display:flex;

    gap:10px;

    margin-top:22px;

    width:100%;

}

.acoes button{

    flex:1;

    height:42px;

    border-radius:10px;

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    transition:background .2s,opacity .2s;

}

.cancelar{

    border:1px solid var(--cor-borda);

    background: var(--cor-fundo-card);

    color:var(--cor-texto-secundario);

}

.cancelar:hover{

    background:var(--cor-fundo-sutil);

}

.excluir{

    border:none;

    background:var(--cor-perigo);

    color: var(--cor-texto-invertido);

}

.excluir:hover{

    background:var(--cor-perigo);

}

.acoes button:disabled{

    opacity:.55;

    cursor:not-allowed;

}

@media (max-width:480px){

    .card{

        padding:24px 20px;

    }

    .acoes{

        flex-direction:column-reverse;

    }

}

.rotulo{

    display:block;

    margin:14px 0 6px;

    font-size:13px;

    color:var(--cor-texto-secundario);

    text-align:left;

}

.campo{

    width:100%;

    height:40px;

    padding:0 12px;

    border:1px solid var(--cor-borda);

    border-radius:8px;

    background:var(--cor-fundo-card);

    color:var(--cor-texto-principal);

    font-size:14px;

    box-sizing:border-box;

}

.campo:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:1px;

}

.erro{

    margin:10px 0 0;

    font-size:13px;

    color:var(--cor-perigo);

}


@media (max-width:480px){
  .overlay{ padding:16px; align-items:flex-end; }
  .card{ max-height:calc(100vh - 32px); max-height:calc(100dvh - 32px); overflow-y:auto; padding:24px 20px 20px; }
  .fechar{ top:8px; right:8px; width:44px; height:44px; }
  .acoes{ flex-direction:column-reverse; }
  .acoes button{ min-height:48px; font-size:15px; }
  input, .campo{ font-size:16px; }
  .input-container{ min-height:48px; }
  .campo{ height:48px; }
}
</style>
