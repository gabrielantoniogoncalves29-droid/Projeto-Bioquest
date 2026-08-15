<template>

    <section class="profile-card">

        <div class="avatar-wrapper">

            <img
                :src="fotoExibida"
                alt="Foto do usuário"
                class="avatar-img"
            >

            <button
                class="avatar-edit-btn"
                type="button"
                title="Alterar foto"
                @click="abrirSeletorDeArquivo"
            >
                <Camera :size="14" />
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

        <button
            class="edit-profile"
            type="button"
            @click="perfil.abrirEdicaoPerfil()"
        >
            <Pencil :size="15" />
            Editar perfil
        </button>

    </section>

    <EditProfileModal v-if="perfil.editandoPerfil" />

</template>

<script setup>

import { ref, computed } from "vue"
import { Camera, Pencil, Mail } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"
import EditProfileModal from "@/features/Perfil/EditProfileModal.vue"
import fotoPadrao from "@/components/icons/account_circle_45dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.png"

const perfil = usePerfilStore()

const inputArquivo = ref(null)

const fotoExibida = computed(() => {

    return perfil.foto || fotoPadrao

})

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
    background:#fff;

    border:1px solid #e9ebea;
    border-radius:14px;

    padding:24px 28px;

    display:flex;
    align-items:center;
    gap:20px;

    box-sizing:border-box;

}

.avatar-wrapper{

    position:relative;

    width:64px;
    height:64px;

    flex-shrink:0;

}

.avatar-img{

    width:64px;
    height:64px;

    border-radius:50%;

    object-fit:cover;

    border:1px solid #e9ebea;

    background:#f4f5f4;

    display:block;

}

.avatar-edit-btn{

    position:absolute;

    right:-2px;
    bottom:-2px;

    width:24px;
    height:24px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    border:2px solid #fff;

    background:#0d6b4d;
    color:#fff;

    cursor:pointer;

    transition:background .2s ease;

}

.avatar-edit-btn:hover{

    background:#0a5a40;

}

.input-oculto{

    display:none;

}

.profile-info{

    display:flex;
    flex-direction:column;
    gap:4px;

    text-align:left;

    flex:1;
    min-width:0;

}

.profile-info h1{

    font-size:20px;
    font-weight:700;

    color:#1f2937;

    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;

}

.email{

    display:flex;
    align-items:center;
    gap:6px;

    font-size:13.5px;

    color:#6b7280;

}

.edit-profile{

    display:flex;
    align-items:center;
    gap:7px;

    width:max-content;

    flex-shrink:0;

    color:#0d6b4d;

    border:1px solid #d6ded9;

    border-radius:9px;

    padding:9px 16px;

    font-size:14px;
    font-weight:600;

    cursor:pointer;
    background-color:#fff;
    transition:.15s;

}

.edit-profile:hover{

    border-color:#0d6b4d;
    background-color:#f7faf8;

}

@media (max-width:640px){

    .profile-card{

        flex-direction:column;

        text-align:center;

        padding:24px 20px;

    }

    .profile-info{

        align-items:center;
        text-align:center;

    }

    .profile-info h1{

        white-space:normal;

    }

    .edit-profile{

        width:100%;
        justify-content:center;

    }

}

</style>
