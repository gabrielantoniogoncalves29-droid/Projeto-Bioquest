<template>

    <div class="dados">

        <!-- INFORMAÇÕES PESSOAIS -->
        <section class="painel">

            <header class="painel-topo">
                <h2>Informações pessoais</h2>
                <p>Atualize sua foto, nome e e-mail.</p>
            </header>

            <div class="painel-corpo">

                <div class="bloco-foto">

                    <div class="avatar-wrapper">

                        <img
                            v-if="perfil.foto"
                            :src="perfil.foto"
                            alt="Foto do usuário"
                            class="avatar-img"
                        >

                        <div
                            v-else
                            class="avatar-iniciais"
                        >
                            <span v-if="perfil.iniciais">
                                {{ perfil.iniciais }}
                            </span>

                            <User
                                v-else
                                :size="32"
                            />
                        </div>

                    </div>

                    <div class="foto-acoes">

                        <button
                            class="btn-secundario"
                            type="button"
                            :disabled="enviandoFoto"
                            @click="abrirSeletorDeArquivo"
                        >
                            <Camera :size="15" />
                            {{ enviandoFoto ? "Enviando..." : "Alterar foto" }}
                        </button>

                        <span class="dica">
                            JPG, PNG ou WebP, até 3 MB.
                        </span>

                        <span
                            v-if="erroFoto"
                            class="msg msg-erro"
                        >
                            {{ erroFoto }}
                        </span>

                        <input
                            ref="inputArquivo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="input-oculto"
                            @change="onArquivoSelecionado"
                        >

                    </div>

                </div>

                <div class="campos">

                    <div class="field">

                        <label for="campo-nome">Nome</label>

                        <div class="input-container">

                            <User
                                class="icon"
                                :size="18"
                            />

                            <input
                                id="campo-nome"
                                v-model="nome"
                                type="text"
                                placeholder="Digite seu nome"
                            >

                        </div>

                    </div>

                    <div class="field">

                        <label for="campo-email">E-mail</label>

                        <div class="input-container">

                            <Mail
                                class="icon"
                                :size="18"
                            />

                            <input
                                id="campo-email"
                                v-model="email"
                                type="email"
                                placeholder="Digite seu e-mail"
                            >

                        </div>

                    </div>

                </div>

            </div>

            <footer class="painel-rodape">

                <span
                    v-if="salvoComSucesso"
                    class="msg msg-ok"
                >
                    <Check :size="15" />
                    Alterações salvas
                </span>

                <button
                    type="button"
                    class="btn-secundario"
                    :disabled="!alterado || perfil.salvandoPerfil"
                    @click="descartar"
                >
                    Descartar
                </button>

                <button
                    type="button"
                    class="btn-primario"
                    :disabled="!podeSalvar"
                    @click="salvar"
                >
                    {{ perfil.salvandoPerfil ? "Salvando..." : "Salvar alterações" }}
                </button>

            </footer>

        </section>

        <!-- SEGURANÇA -->
        <section class="painel">

            <header class="painel-topo">
                <h2>Segurança</h2>
                <p>Gerencie o acesso à sua conta.</p>
            </header>

            <div class="painel-corpo">

                <div class="linha-senha">

                    <div class="senha-icone">
                        <Lock :size="20" />
                    </div>

                    <div class="senha-texto">
                        <strong>Senha</strong>
                        <span class="senha-mascara">••••••••••</span>
                    </div>

                    <button
                        type="button"
                        class="btn-secundario"
                        @click="alterandoSenha = true"
                    >
                        <KeyRound :size="15" />
                        Alterar senha
                    </button>

                </div>

            </div>

        </section>

    </div>

    <RedefinirSenhaModal
        v-if="alterandoSenha"
        @fechar="alterandoSenha = false"
    />

</template>

<script setup>

import { ref, computed, watch } from "vue"
import { User, Mail, Camera, Check, Lock, KeyRound } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"
import RedefinirSenhaModal from "@/features/Perfil/RedefinirSenhaModal.vue"

const perfil = usePerfilStore()

const nome = ref(perfil.nome || "")
const email = ref(perfil.email || "")

const inputArquivo = ref(null)
const enviandoFoto = ref(false)
const erroFoto = ref("")
const salvoComSucesso = ref(false)
const alterandoSenha = ref(false)

/* Preenche os campos quando o perfil termina de carregar,
   sem sobrescrever o que o usuário já começou a digitar. */
watch(
    () => [perfil.nome, perfil.email],
    ([novoNome, novoEmail], [antigoNome, antigoEmail]) => {

        if (nome.value === (antigoNome || "")) nome.value = novoNome || ""

        if (email.value === (antigoEmail || "")) email.value = novoEmail || ""

    }
)

const alterado = computed(() =>
    nome.value.trim() !== (perfil.nome || "") ||
    email.value.trim() !== (perfil.email || "")
)

const podeSalvar = computed(() =>
    alterado.value &&
    !perfil.salvandoPerfil &&
    nome.value.trim() &&
    email.value.trim()
)

function descartar() {

    nome.value = perfil.nome || ""
    email.value = perfil.email || ""

}

async function salvar() {

    salvoComSucesso.value = false

    await perfil.salvarEdicaoPerfil({
        nome: nome.value.trim(),
        email: email.value.trim()
    })

    salvoComSucesso.value = true

    setTimeout(() => { salvoComSucesso.value = false }, 3000)

}

function abrirSeletorDeArquivo() {

    inputArquivo.value?.click()

}

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"]
const TAMANHO_MAXIMO = 3 * 1024 * 1024

async function onArquivoSelecionado(evento) {

    const arquivo = evento.target.files?.[0]

    evento.target.value = ""

    erroFoto.value = ""

    if (!arquivo) return

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        erroFoto.value = "Formato inválido. Use JPG, PNG ou WebP."
        return
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
        erroFoto.value = "A imagem deve ter no máximo 3 MB."
        return
    }

    enviandoFoto.value = true

    try {
        await perfil.enviarFoto(arquivo)
    } catch {
        erroFoto.value = "Não foi possível enviar a foto. Tente novamente."
    } finally {
        enviandoFoto.value = false
    }

}

</script>

<style scoped>

.dados{
    width:100%;
    display:flex;
    flex-direction:column;
    gap:20px;
}

/* painéis */
.painel{
    background:var(--cor-fundo-card);
    border:1px solid var(--cor-borda);
    border-radius:16px;
    overflow:hidden;
}

.painel-topo{
    padding:22px 28px 18px;
    border-bottom:1px solid var(--cor-borda-suave);
}

.painel-topo h2{
    margin:0 0 4px;
    font-size:17px;
    font-weight:700;
    color:var(--cor-texto-principal);
}

.painel-topo p{
    margin:0;
    font-size:13.5px;
    color:var(--cor-texto-suave);
}

.painel-corpo{
    padding:24px 28px;
    display:flex;
    flex-direction:column;
    gap:24px;
}

.painel-rodape{
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:10px;
    padding:16px 28px;
    border-top:1px solid var(--cor-borda-suave);
    background:var(--cor-fundo-sutil);
}

/* foto */
.bloco-foto{
    display:flex;
    align-items:center;
    gap:20px;
}

.avatar-wrapper{
    width:80px;
    height:80px;
    flex-shrink:0;
}

.avatar-img,
.avatar-iniciais{
    width:80px;
    height:80px;
    border-radius:50%;
    border:1px solid var(--cor-borda);
}

.avatar-img{
    object-fit:cover;
    background:var(--cor-fundo-sutil);
    display:block;
}

.avatar-iniciais{
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(
        135deg,
        var(--cor-primaria),
        var(--cor-primaria-hover)
    );
    color:var(--cor-texto-invertido);
    font-size:26px;
    font-weight:700;
    line-height:1;
}

.foto-acoes{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:6px;
}

.input-oculto{
    display:none;
}

.dica{
    font-size:12.5px;
    color:var(--cor-texto-fraco);
}

/* campos lado a lado */
.campos{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
}

.field{
    display:flex;
    flex-direction:column;
    gap:6px;
    min-width:0;
}

label{
    font-size:13.5px;
    font-weight:600;
    color:var(--cor-texto-secundario);
}

.input-container{
    display:flex;
    align-items:center;
    height:44px;
    padding:0 14px;
    border:1px solid var(--cor-borda);
    border-radius:10px;
    background:var(--cor-fundo-card);
    transition:border-color .2s;
}

.input-container:focus-within{
    border-color:var(--cor-primaria);
}

.icon{
    margin-right:10px;
    color:var(--cor-texto-fraco);
    flex-shrink:0;
}

input[type="text"],
input[type="email"]{
    flex:1;
    min-width:0;
    border:none;
    outline:none;
    background:transparent;
    font-size:14.5px;
    color:var(--cor-texto-principal);
}

input::placeholder{
    color:var(--cor-texto-fraco);
}

/* senha */
.linha-senha{
    display:flex;
    align-items:center;
    gap:16px;
}

.senha-icone{
    display:flex;
    align-items:center;
    justify-content:center;
    width:44px;
    height:44px;
    flex-shrink:0;
    border-radius:12px;
    background:var(--cor-fundo-sutil);
    color:var(--cor-texto-secundario);
}

.senha-texto{
    flex:1;
    min-width:0;
    display:flex;
    flex-direction:column;
    gap:3px;
}

.senha-texto strong{
    font-size:14.5px;
    color:var(--cor-texto-principal);
}

.senha-mascara{
    font-size:13.5px;
    letter-spacing:2px;
    color:var(--cor-texto-fraco);
}

/* botões */
.btn-primario,
.btn-secundario{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:7px;
    height:42px;
    padding:0 18px;
    border-radius:10px;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    white-space:nowrap;
    transition:background .2s, opacity .2s, border-color .2s;
}

.btn-primario{
    border:none;
    background:var(--cor-primaria);
    color:var(--cor-texto-invertido);
}

.btn-primario:hover:not(:disabled){
    background:var(--cor-primaria-hover);
}

.btn-secundario{
    border:1px solid var(--cor-borda);
    background:var(--cor-fundo-card);
    color:var(--cor-texto-secundario);
}

.btn-secundario:hover:not(:disabled){
    background:var(--cor-fundo-sutil);
}

.btn-primario:disabled,
.btn-secundario:disabled{
    opacity:.55;
    cursor:not-allowed;
}

.msg{
    display:inline-flex;
    align-items:center;
    gap:5px;
    font-size:13px;
}

.msg-ok{
    margin-right:auto;
    color:var(--cor-primaria);
}

.msg-erro{
    color:var(--cor-perigo);
}

@media (max-width:768px){

    .painel-topo,
    .painel-corpo,
    .painel-rodape{
        padding-left:18px;
        padding-right:18px;
    }

    .campos{
        grid-template-columns:1fr;
    }

}

@media (max-width:520px){

    .bloco-foto{
        flex-direction:column;
        align-items:flex-start;
    }

    .linha-senha{
        flex-wrap:wrap;
    }

    .linha-senha .btn-secundario{
        width:100%;
    }

    .painel-rodape{
        flex-direction:column-reverse;
        align-items:stretch;
    }

    .msg-ok{
        margin:0;
        justify-content:center;
    }

}

</style>
