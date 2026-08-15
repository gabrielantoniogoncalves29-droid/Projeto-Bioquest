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
                    @click="fechar"
                >
                    <X :size="18" />
                </button>

                <h2>Editar perfil</h2>

                <p class="subtitulo">
                    Atualize seus dados atuais
                </p>

                <div class="field">

                    <label>Nome</label>

                    <div class="input-container">

                        <User
                            class="icon"
                            :size="18"
                        />

                        <input
                            v-model="nome"
                            type="text"
                            placeholder="Digite seu nome"
                        >

                    </div>

                </div>

                <div class="field">

                    <label>E-mail</label>

                    <div class="input-container">

                        <Mail
                            class="icon"
                            :size="18"
                        />

                        <input
                            v-model="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                        >

                    </div>

                </div>

                <div class="acoes">

                    <button
                        type="button"
                        class="cancelar"
                        :disabled="perfil.salvandoPerfil"
                        @click="fechar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="salvar"
                        :disabled="perfil.salvandoPerfil || !nome.trim() || !email.trim()"
                        @click="salvar"
                    >
                        {{ perfil.salvandoPerfil ? "Salvando..." : "Salvar alterações" }}
                    </button>

                </div>

            </div>

        </div>

    </Teleport>

</template>

<script setup>

import { ref } from "vue"
import { User, Mail, X } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

const nome = ref(perfil.nome)
const email = ref(perfil.email)

function fechar() {

    perfil.fecharEdicaoPerfil()

}

function salvar() {

    perfil.salvarEdicaoPerfil({
        nome: nome.value.trim(),
        email: email.value.trim()
    })

}

</script>

<style scoped>

.overlay{

    position:fixed;
    inset:0;

    display:flex;
    justify-content:center;
    align-items:center;

    background:rgba(15,23,20,0.45);
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

    background:#fff;

    border-radius:16px;

    box-shadow:0 16px 40px rgba(0,0,0,.18);

    box-sizing:border-box;

    display:flex;
    flex-direction:column;

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

    background:#F2F5F3;
    color:#5b6660;

    cursor:pointer;

    transition:.15s;

}

.fechar:hover{

    background:#e7ece9;
    color:#20352A;

}

h2{

    margin:0;

    text-align:center;

    font-size:19px;

    font-weight:700;

    color:#1f2937;

}

.subtitulo{

    margin:5px 0 22px;

    text-align:center;

    font-size:13.5px;

    color:#6b7280;

}

.field{

    display:flex;

    flex-direction:column;

    gap:6px;

    margin-bottom:14px;

}

label{

    font-size:13.5px;

    font-weight:600;

    color:#444;

}

.input-container{

    display:flex;

    align-items:center;

    height:44px;

    padding:0 14px;

    border:1px solid #dcdfde;

    border-radius:10px;

    background:#fff;

    transition:border-color .2s;

}

.input-container:focus-within{

    border-color:#0d6b4d;

}

.icon{

    margin-right:10px;

    color:#9ca3af;

    flex-shrink:0;

}

input{

    flex:1;

    border:none;

    outline:none;

    background:transparent;

    font-size:14.5px;

    color:#333;

}

input::placeholder{

    color:#AAA;

}

.acoes{

    display:flex;

    gap:10px;

    margin-top:14px;

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

    border:1px solid #dcdfde;

    background:#fff;

    color:#444;

}

.cancelar:hover{

    background:#f5f5f5;

}

.salvar{

    border:none;

    background:#0d6b4d;

    color:#fff;

}

.salvar:hover{

    background:#0a5a40;

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
