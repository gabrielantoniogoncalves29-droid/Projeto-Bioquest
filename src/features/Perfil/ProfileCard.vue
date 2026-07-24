<template>

    <section class="profile-card">

        <div class="profile-photo">

            <img
                src="@/components/icons/account_circle_45dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.png"
                alt="Foto do usuário"
            >

            <button class="change-photo">

                Alterar foto

            </button>

        </div>

        <div class="profile-info">

            <h1>

                {{ perfil.nome }}

            </h1>

            <p class="email">

                {{ perfil.email }}

            </p>
        </div>
      
            <button class="edit-profile">

                Editar perfil

            </button>

    </section>

</template>

<script setup>

import { computed } from "vue"
import { usePerfilStore } from "@/store/perfil"

const perfil = usePerfilStore()

const fotoPerfil = computed(() => {

    return perfil.foto 

})

</script>

<style scoped>

.profile-card{

    width:100%;
    text-align: center;
    background:#fff;

    border-radius:18px;

    padding:12px;

    display:flex;
    align-items:center;
    gap:22px;

    box-shadow:0 6px 18px rgba(0,0,0,.06);

}
 


.profile-photo{

    display:flex;
   
    flex-direction:column;

    align-items:center;

}

.profile-photo img{

    width:100px;

    height:100px;

    border-radius:50%;

    object-fit:cover;

    border:4px solid #eaf5efdf;

}

.change-photo{

    background-color: transparent;
    color:#1E7A49;

    padding:10px 18px;

    cursor:pointer;

    transition:.25s;

}


.profile-info{

    display:flex;
    gap: 0px;
    flex-direction:column;

}

.profile-info h1{

    font-size:34px;

    color:#20352A;

    font-weight:700;

}

.email{

    font-size:17px;

    color:#6E7681;

}

.edit-profile{

    width:max-content;

    margin-top:8px;



    color:#1E7A49;

    padding:10px 20px;

    cursor:pointer;
    background-color: transparent;
    transition:.25s;

}

.edit-profile:hover, .change-photo:hover{
border-bottom:#1c6f43;

}


</style>