<template>

    <div class="card">

        <h2>Criar nova senha</h2>

        <template v-if="!concluido">

            <p class="description">
                Escolha uma nova senha para a sua conta.
            </p>

            <form novalidate @submit.prevent="salvar" @keydown.enter="avancarComEnter">

            <div class="field">

                <label for="nova-senha">Nova senha</label>

                <div
                    class="input-container"
                    :class="{ valid: senhaValida }"
                >

                    <Lock
                        class="icon"
                        :size="20"
                        aria-hidden="true"
                    />

                    <input
                        id="nova-senha"
                        v-model="senha"
                        :type="mostrarSenha ? 'text' : 'password'"
                        name="nova-senha"
                        autocomplete="new-password"
                        maxlength="72"
                        placeholder="Crie uma senha"
                        :disabled="enviando"
                    >

                    <button
                        type="button"
                        class="eye-button"
                        :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                        @click="mostrarSenha = !mostrarSenha"
                    >
                        <Eye
                            v-if="!mostrarSenha"
                            :size="18"
                        />

                        <EyeOff
                            v-else
                            :size="18"
                        />
                    </button>

                </div>

                <span
                    class="feedback"
                    :class="{ success: senhaValida }"
                >
                    {{ senhaValida ? "✔ Senha válida" : "Mínimo de 8 caracteres" }}
                </span>

            </div>

            <div class="field">

                <label for="confirmar-nova-senha">Confirmar senha</label>

                <div
                    class="input-container"
                    :class="{ valid: confirmacaoValida }"
                >

                    <Lock
                        class="icon"
                        :size="20"
                        aria-hidden="true"
                    />

                    <input
                        id="confirmar-nova-senha"
                        v-model="confirmarSenha"
                        :type="mostrarSenha ? 'text' : 'password'"
                        name="confirmar-nova-senha"
                        autocomplete="new-password"
                        maxlength="72"
                        placeholder="Digite a senha novamente"
                        :disabled="enviando"
                    >

                </div>

                <span
                    v-if="confirmarSenha"
                    class="feedback"
                    :class="{ success: confirmacaoValida }"
                >
                    {{ confirmacaoValida ? "✔ As senhas coincidem" : "As senhas não coincidem" }}
                </span>

            </div>

            <p
                v-if="erro"
                class="mensagem erro"
                role="alert"
            >
                {{ erro }}
            </p>

            <button
                type="submit"
                class="continue-button"
                :disabled="!senhaValida || !confirmacaoValida || enviando"
            >
                {{ enviando ? "Salvando..." : "Salvar nova senha" }}
            </button>

            </form>

            <button
                v-if="tokenInvalido"
                type="button"
                class="back-button"
                @click="pedirNovoLink"
            >
                Solicitar novo link
            </button>

            <button
                v-else
                type="button"
                class="back-button"
                @click="voltar"
            >
                ← Voltar ao login
            </button>

        </template>

        <template v-else>

            <p
                class="mensagem sucesso"
                role="status"
            >
                Senha redefinida com sucesso. Entre com a nova senha.
            </p>

            <button
                type="button"
                class="continue-button"
                @click="voltar"
            >
                Ir para o login
            </button>

        </template>

    </div>

</template>

<script setup>

import { ref, computed } from "vue"

import { useRouter } from "vue-router"

import { Lock, Eye, EyeOff } from "lucide-vue-next"

import { useAuthStore } from "@/store/auth"
import { avancarComEnter } from "@/utils/teclado"

import { redefinirSenhaComToken } from "@/services/auth"

import { codigoDeErro, mensagemDeErro } from "@/services/api"

const auth = useAuthStore()

const router = useRouter()

const senha = ref("")
const confirmarSenha = ref("")
const mostrarSenha = ref(false)
const enviando = ref(false)
const erro = ref("")
const concluido = ref(false)
const tokenInvalido = ref(false)

const senhaValida = computed(() => senha.value.length >= 8 && senha.value.length <= 72)

const confirmacaoValida = computed(() => confirmarSenha.value.length > 0 && confirmarSenha.value === senha.value)

async function salvar() {

    if (!senhaValida.value || !confirmacaoValida.value || enviando.value) return

    if (!auth.tokenAcao) {

        tokenInvalido.value = true

        erro.value = "Link inválido ou expirado. Solicite um novo link de redefinição."

        return

    }

    enviando.value = true
    erro.value = ""

    try {

        await redefinirSenhaComToken(auth.tokenAcao, senha.value)

        auth.tokenAcao = ""

        senha.value = ""
        confirmarSenha.value = ""

        concluido.value = true

    } catch (falha) {

        tokenInvalido.value = codigoDeErro(falha) === "token_invalido"

        erro.value = tokenInvalido.value
            ? "Link inválido ou expirado. Solicite um novo link de redefinição."
            : mensagemDeErro(falha, "Não foi possível redefinir a senha agora.")

    } finally {

        enviando.value = false

    }

}

function pedirNovoLink() {

    auth.tokenAcao = ""

    tokenInvalido.value = false

    erro.value = ""

    auth.recuperarSenha()

    router.push("/login")

}

function voltar() {

    auth.tokenAcao = ""

    concluido.value = false

    auth.login()

    router.push("/login")

}

</script>

<style scoped>

.card{

    width:100%;
    max-width:430px;
    min-height:420px;
    max-height:calc(100vh - 140px);
    overflow-y:auto;

    padding:40px 32px 32px;

    background:var(--cor-fundo-card-vidro);

    border-radius:18px;

    box-shadow:none;

    box-sizing:border-box;

    display:flex;
    flex-direction:column;

}

h2{

    margin:0 0 18px;

    text-align:center;

    font-size:28px;

    font-weight:700;

    color:var(--cor-primaria-texto);

    line-height:1.2;

}

.description{

    margin:0 0 34px;

    text-align:center;

    color:var(--cor-texto-suave);

    font-size:15px;

    line-height:1.6;

}

.field{

    display:flex;

    flex-direction:column;

    gap:6px;

}

label{

    font-size:15px;

    font-weight:600;

    color:var(--cor-texto-secundario);

}

.input-container{

    display:flex;

    align-items:center;

    flex-shrink:0;

    height:48px;

    padding:0 18px;

    border:1px solid var(--cor-borda);

    border-radius:12px;

    background:var(--cor-fundo-sutil);

    transition:border-color .25s,
               box-shadow .25s;

}

.input-container:focus-within{

    border-color:var(--cor-primaria);

    box-shadow:0 0 0 4px var(--cor-foco-login);

}

.input-container.valid{

    border-color:var(--cor-primaria);

}

.icon{

    margin-right:12px;

    color:var(--cor-texto-fraco);

    flex-shrink:0;

}

input{

    flex:1;

    border:none;

    outline:none;

    background:transparent;

    font-size:15px;

    color:var(--cor-texto-principal);

}

input::placeholder{

    color:var(--cor-texto-fraco);

}

.feedback{

    min-height:18px;

    margin-top:4px;

    font-size:12px;

    color:var(--cor-perigo);

}

.feedback.success{

    color:var(--cor-primaria);

}

.continue-button{

    width:100%;

    flex-shrink:0;

    height:46px;

    margin-top:28px;

    border:none;

    border-radius:12px;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-size:16px;

    font-weight:600;

    cursor:pointer;

    transition:background .25s,
               transform .2s;

}

.continue-button:hover:not(:disabled){

    background:var(--cor-primaria);

    transform:translateY(-2px);

}

.continue-button:active{

    transform:translateY(0);

}

.continue-button:disabled{

    background:var(--cor-borda);

    cursor:not-allowed;

}

.back-button{

    width:100%;

    flex-shrink:0;

    margin-top:auto;

    border:none;

    background:none;

    color:var(--cor-primaria);

    font-size:15px;

    font-weight:600;

    cursor:pointer;

    transition:.2s;

}

.back-button:hover{

    color:var(--cor-primaria-texto);

    text-decoration:underline;

}

input::-ms-reveal,
input::-ms-clear{

    display:none;

}

input[type="password"]::-webkit-textfield-decoration-container{

    display:none;

}


.card::-webkit-scrollbar{
    width:6px;
}

.card::-webkit-scrollbar-track{
    background:transparent;
}

.card::-webkit-scrollbar-thumb{
    background:var(--cor-primaria-translucida);
    border-radius:999px;
}

.card::-webkit-scrollbar-thumb:hover{
    background:var(--cor-primaria-translucida-forte);
}

[data-tema="escuro"] .back-button,
[data-tema="escuro"] .feedback.success{
    color:var(--cor-primaria-texto);
}

.mensagem{

    margin:0 0 12px;

    font-size:13px;

    line-height:1.4;

}

.mensagem.erro{

    color:var(--cor-erro);

}

.mensagem.sucesso{

    color:var(--cor-acerto);

}

.primary-button:focus-visible,
.secondary-button:focus-visible,
.continue-button:focus-visible,
.back-button:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:2px;

}


.eye-button{

    display:flex;

    align-items:center;

    justify-content:center;

    background:none;

    border:none;

    cursor:pointer;

    color:var(--cor-texto-suave);

    transition:.2s;

}

.eye-button:hover{

    color:var(--cor-primaria);

}

form{

    display:contents;

}

.mensagem.sucesso{

    color:var(--cor-acerto);

}

.eye-button:focus-visible{

    outline:2px solid var(--cor-primaria);

    outline-offset:2px;

}

</style>