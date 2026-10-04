<template>

    <section class="profile-card">

        <div class="profile-topo">

            <div class="profile-main">

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
                            :size="36"
                        />
                    </div>

                    <button
                        class="avatar-edit-btn"
                        type="button"
                        title="Alterar foto"
                        @click="abrirSeletorDeArquivo"
                    >
                        <Camera :size="13" />
                    </button>

                    <input
                        ref="inputArquivo"
                        type="file"
                        accept="image/*"
                        class="input-oculto"
                        @change="onArquivoSelecionado"
                    >

                </div>

                <div class="profile-info">

                    <h1>
                        {{ perfil.nome }}
                    </h1>

                    <p class="email">
                        <Mail :size="14" />
                        {{ perfil.email }}
                    </p>

                </div>

            </div>

            <div class="botoes-perfil">

                <button
                    class="edit-profile"
                    type="button"
                    @click="perfil.abrirEdicaoPerfil()"
                >
                    <Pencil :size="15" />
                    Editar perfil
                </button>

                <button
                    class="excluir-conta"
                    type="button"
                    @click="perfil.abrirExclusaoConta()"
                >
                    <Trash2 :size="15" />
                    Excluir conta e dados
                </button>

            </div>

        </div>

        <div class="stats-row">

            <div class="stat stat-azul">

                <Bookmark
                    class="stat-icone"
                    :size="28"
                />

                <div class="stat-conteudo">

                    <strong class="stat-numero">
                        {{ perfil.totalSalvas }}
                    </strong>

                    <span class="stat-legenda">
                        Questões salvas
                    </span>

                </div>

            </div>

            <div class="stat stat-verde">

                <CheckCircle2
                    class="stat-icone"
                    :size="28"
                />

                <div class="stat-conteudo">

                    <strong class="stat-numero">
                        {{ perfil.totalResolvidas }}
                    </strong>

                    <span class="stat-legenda">
                        Questões resolvidas
                    </span>

                </div>

            </div>

            <div class="stat stat-amarelo">

                <Flag
                    class="stat-icone"
                    :size="28"
                />

                <div class="stat-conteudo">

                    <strong class="stat-numero">
                        {{ perfil.totalRevisar }}
                    </strong>

                    <span class="stat-legenda">
                        Para revisar
                    </span>

                </div>

            </div>

            <div class="stat stat-roxo stat-acertos">

                <div
                    class="anel-progresso"
                    :style="{ '--progresso': perfil.porcentagemAcertos }"
                >
                    <div class="anel-miolo">
                        {{ perfil.porcentagemAcertos }}%
                    </div>
                </div>

                <div class="stat-conteudo">

                    <span class="stat-legenda">
                        De acertos
                    </span>

                </div>

            </div>

        </div>

    </section>

    <EditProfileModal v-if="perfil.editandoPerfil" />

    <ExcluirContaModal v-if="perfil.excluindoContaConfirmacao" />

</template>

<script setup>

import { ref } from "vue"

import {
    Camera,
    Pencil,
    Mail,
    User,
    Trash2,
    Bookmark,
    CheckCircle2,
    Flag
} from "lucide-vue-next"

import { usePerfilStore } from "@/store/perfil"

import EditProfileModal from "@/features/Perfil/EditProfileModal.vue"

import ExcluirContaModal from "@/features/Perfil/ExcluirContaModal.vue"


const perfil = usePerfilStore()

const inputArquivo = ref(null)


function abrirSeletorDeArquivo() {

    inputArquivo.value?.click()

}


function onArquivoSelecionado(evento) {

    const arquivo = evento.target.files?.[0]

    if (!arquivo) return

    const leitor = new FileReader()

    leitor.onload = () => {

        perfil.alterarFoto(leitor.result)

    }

    leitor.readAsDataURL(arquivo)

    evento.target.value = ""

}

</script>

<style scoped>

.profile-card{

    width:100%;

    background:var(--cor-fundo-card);

    border:1px solid var(--cor-borda);

    border-radius:16px;

    padding:28px;

    box-sizing:border-box;

    display:flex;

    flex-direction:column;

    gap:24px;

    transition:box-shadow .25s ease, border-color .25s ease;

}

.profile-card:hover{

    border-color:var(--cor-borda);

    box-shadow:0 10px 26px rgba(0,0,0,.05);

}


/* ==============================
   TOPO DO PERFIL
   ============================== */

.profile-topo{

    display:flex;

    align-items:center;

    justify-content:space-between;

    flex-wrap:wrap;

    gap:20px;

}

.profile-main{

    display:flex;

    align-items:center;

    gap:20px;

    min-width:0;

}


/* ==============================
   AVATAR
   ============================== */

.avatar-wrapper{

    position:relative;

    width:88px;

    height:88px;

    flex-shrink:0;

}

.avatar-img{

    width:88px;

    height:88px;

    border-radius:50%;

    object-fit:cover;

    border:1px solid var(--cor-borda);

    background:var(--cor-fundo-sutil);

    display:block;

    transition:transform .25s ease;

}

.avatar-iniciais{

    width:88px;

    height:88px;

    display:flex;

    align-items:center;

    justify-content:center;

    border-radius:50%;

    border:1px solid var(--cor-borda);

    background:linear-gradient(
        135deg,
        var(--cor-primaria),
        var(--cor-primaria-hover)
    );

    color:var(--cor-texto-invertido);

    font-size:28px;

    font-weight:700;

    line-height:1;

    transition:transform .25s ease;

}

.avatar-wrapper:hover .avatar-img,
.avatar-wrapper:hover .avatar-iniciais{

    transform:scale(1.04);

}

.avatar-edit-btn{

    position:absolute;

    right:0;

    bottom:0;

    width:26px;

    height:26px;

    display:flex;

    align-items:center;

    justify-content:center;

    border-radius:50%;

    border:2px solid var(--cor-fundo-card);

    background:var(--cor-primaria);

    color:var(--cor-texto-invertido);

    cursor:pointer;

    transition:background .2s ease;

}

.avatar-edit-btn:hover{

    background:var(--cor-primaria-hover);

}

.input-oculto{

    display:none;

}


/* ==============================
   INFORMAÇÕES DO PERFIL
   ============================== */

.profile-info{

    display:flex;

    flex-direction:column;

    gap:5px;

    text-align:left;

    min-width:0;

}

.profile-info h1{

    margin:0;

    font-size:20px;

    font-weight:700;

    color:var(--cor-texto-principal);

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;

}

.email{

    display:flex;

    align-items:center;

    gap:6px;

    margin:0;

    font-size:13.5px;

    color:var(--cor-texto-suave);

}


/* ==============================
   BOTÕES
   ============================== */

.botoes-perfil{

    display:flex;

    align-items:center;

    gap:10px;

    flex-shrink:0;

}

.edit-profile,
.excluir-conta{

    display:flex;

    align-items:center;

    justify-content:center;

    gap:7px;

    border-radius:9px;

    padding:9px 16px;

    font-size:13.5px;

    font-weight:600;

    cursor:pointer;

    transition:.15s;

    white-space:nowrap;

}

.edit-profile{

    color:var(--cor-primaria);

    border:1px solid var(--cor-borda);

    background-color:var(--cor-fundo-card);

}

.edit-profile:hover{

    border-color:var(--cor-primaria);

    background-color:var(--cor-primaria-fundo);

}

[data-tema="escuro"] .edit-profile{

    color:var(--cor-texto-principal);

}

.excluir-conta{

    color:var(--cor-perigo);

    border:1px solid var(--cor-perigo);

    background-color:var(--cor-fundo-card);

}

.excluir-conta:hover{

    border-color:var(--cor-perigo);

    background-color:var(--cor-perigo-fundo);

}


/* ==============================
   ESTATÍSTICAS
   ============================== */

.stats-row{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:14px;

    padding-top:22px;

    border-top:1px solid var(--cor-borda-suave);

}

.stat{

    display:flex;

    flex-direction:row;

    align-items:center;

    justify-content:center;

    gap:18px;

    padding:20px;

    border-radius:16px;

    background:var(--cor-fundo-sutil);

    min-height:90px;

    box-sizing:border-box;

}

.stat-conteudo{

    display:flex;

    flex-direction:column;

    align-items:flex-start;

    justify-content:center;

    gap:5px;

    min-width:0;

}

.stat-icone{

    flex-shrink:0;

}

.stat-azul{

    background:var(--cor-acento-azul-fundo);

}

.stat-verde{

    background:var(--cor-primaria-fundo);

}

.stat-amarelo{

    background:var(--cor-acento-amarelo-fundo);

}

.stat-roxo{

    background:var(--cor-acento-roxo-fundo);

}

.stat-azul .stat-icone{

    color:var(--cor-acento-azul);

}

.stat-verde .stat-icone{

    color:var(--cor-primaria);

}

.stat-amarelo .stat-icone{

    color:var(--cor-acento-amarelo);

}

.stat-numero{

    font-size:26px;

    font-weight:700;

    color:var(--cor-texto-principal);

    line-height:1.1;

}

.stat-legenda{

    font-size:13.5px;

    color:var(--cor-texto-suave);

    line-height:1.3;

    text-align:left;

}


/* ==============================
   CARD DE ACERTOS
   ============================== */

.stat-acertos{

    align-items:center;

}

.anel-progresso{

    flex-shrink:0;

    width:84px;

    height:84px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    background:conic-gradient(

        var(--cor-acento-roxo)
        calc(var(--progresso) * 1%),

        var(--cor-borda) 0

    );

}

.anel-miolo{

    width:66px;

    height:66px;

    border-radius:50%;

    background:var(--cor-acento-roxo-fundo);

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:17px;

    font-weight:700;

    color:var(--cor-texto-principal);

}


/* ==============================
   RESPONSIVIDADE
   ============================== */

@media (max-width:768px){

    .stats-row{

        grid-template-columns:repeat(2,1fr);

    }

}

@media (max-width:640px){

    .profile-card{

        padding:22px 20px;

    }

    .profile-topo{

        flex-direction:column;

        align-items:stretch;

    }

    .profile-main{

        flex-direction:column;

        text-align:center;

    }

    .profile-info{

        align-items:center;

        text-align:center;

    }

    .profile-info h1{

        white-space:normal;

    }

    .botoes-perfil{

        flex-direction:column;

    }

    .stats-row{

        grid-template-columns:1fr 1fr;

    }

    .stat{

        gap:12px;

        padding:16px;

    }

    .stat-numero{

        font-size:23px;

    }

    .stat-legenda{

        font-size:12.5px;

    }

}

</style>
