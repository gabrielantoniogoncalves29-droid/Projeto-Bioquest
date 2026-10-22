<template>

    <Teleport to="body">

        <div
            class="overlay"
            @click.self="fechar"
        >

            <div class="card">

                <button
                    class="fechar"
                    type="button"
                    :disabled="enviando"
                    @click="fechar"
                >
                    <X :size="18" />
                </button>

                <template v-if="!enviado">

                    <div class="icone icone-azul">
                        <KeyRound :size="26" />
                    </div>

                    <h2>Alterar senha</h2>

                    <p class="subtitulo">
                        Enviaremos um e-mail para
                        <strong>{{ perfil.email }}</strong>
                        com o link para você redefinir sua senha.
                    </p>

                    <p
                        v-if="erro"
                        class="erro"
                    >
                        {{ erro }}
                    </p>

                    <div class="acoes">

                        <button
                            type="button"
                            class="cancelar"
                            :disabled="enviando"
                            @click="fechar"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="confirmar"
                            :disabled="enviando"
                            @click="enviar"
                        >
                            {{ enviando ? "Enviando..." : "Enviar e-mail" }}
                        </button>

                    </div>

                </template>

                <template v-else>

                    <div class="icone icone-verde">
                        <MailCheck :size="26" />
                    </div>

                    <h2>E-mail enviado</h2>

                    <p class="subtitulo">
                        Verifique a caixa de entrada de
                        <strong>{{ perfil.email }}</strong>
                        e siga as instruções para criar uma nova senha.
                        Se não encontrar, olhe também a pasta de spam.
                    </p>

                    <div class="acoes">

                        <button
                            type="button"
                            class="confirmar"
                            @click="fechar"
                        >
                            Entendi
                        </button>

                    </div>

                </template>

            </div>

        </div>

    </Teleport>

</template>

<script setup>

import { ref } from "vue"
import { X, KeyRound, MailCheck } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"

const emit = defineEmits(["fechar"])

const perfil = usePerfilStore()

const enviando = ref(false)
const enviado = ref(false)
const erro = ref("")

function fechar() {

    if (enviando.value) return

    emit("fechar")

}

async function enviar() {

    enviando.value = true
    erro.value = ""

    try {

        await perfil.solicitarRedefinicaoSenha()

        enviado.value = true

    } catch {

        erro.value = "Não foi possível enviar o e-mail agora. Tente novamente."

    } finally {

        enviando.value = false

    }

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
    background:var(--cor-fundo-card);
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

.icone{
    display:flex;
    align-items:center;
    justify-content:center;
    width:52px;
    height:52px;
    margin-bottom:12px;
    border-radius:50%;
}

.icone-azul{
    background:var(--cor-acento-azul-fundo);
    color:var(--cor-acento-azul);
}

.icone-verde{
    background:var(--cor-primaria-fundo);
    color:var(--cor-primaria);
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

.subtitulo strong{
    color:var(--cor-texto-principal);
    word-break:break-all;
}

.erro{
    margin:8px 0 0;
    font-size:13px;
    color:var(--cor-perigo);
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
    background:var(--cor-fundo-card);
    color:var(--cor-texto-secundario);
}

.cancelar:hover{
    background:var(--cor-fundo-sutil);
}

.confirmar{
    border:none;
    background:var(--cor-primaria);
    color:var(--cor-texto-invertido);
}

.confirmar:hover:not(:disabled){
    background:var(--cor-primaria-hover);
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

</style>
