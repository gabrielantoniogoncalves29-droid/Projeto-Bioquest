<template>

    <section class="profile-card">

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

        </div>

        <div class="profile-info">

            <h2>
                {{ perfil.nome }}
            </h2>

            <p class="email">
                <Mail :size="14" />
                {{ perfil.email }}
            </p>

        </div>

    </section>

</template>

<script setup>

import { User, Mail } from "lucide-vue-next"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

</script>

<style scoped>

.profile-card{
    display:flex;
    align-items:center;
    gap:20px;
    padding:28px 0 20px;
    min-width:0;
}

.avatar-wrapper{
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
}

.profile-info{
    display:flex;
    flex-direction:column;
    gap:5px;
    text-align:left;
    min-width:0;
}

.profile-info h2{
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

@media (max-width:640px){

    .profile-card{
        flex-direction:column;
        text-align:center;
    }

    .profile-info{
        align-items:center;
        text-align:center;
    }

    .profile-info h2{
        white-space:normal;
    }

}

</style>
