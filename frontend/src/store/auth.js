import { defineStore } from "pinia"
import { ref } from "vue"

export const ETAPAS = {

    LOGIN: 0,

    REGISTER: 1,

    REGISTER_CONFIRM: 2,

    RECOVER_PASSWORD: 3,

    RECOVER_PASSWORD_CONFIRM: 4

}

export const useAuthStore = defineStore("auth", () => {

    // Tela atual
    const etapa = ref(ETAPAS.LOGIN)

    // Compartilhado entre Login e Recuperação
    const email = ref("")

    // Utilizado na confirmação do cadastro
    const emailCadastro = ref("")

    // Futuramente 
    const carregando = ref(false)

    function login(){

        etapa.value = ETAPAS.LOGIN

    }

    function cadastro(){

        etapa.value = ETAPAS.REGISTER

    }

    function confirmar(emailUsuario){

        emailCadastro.value = emailUsuario
        email.value = emailUsuario

        etapa.value = ETAPAS.REGISTER_CONFIRM

    }

    function recuperarSenha(){

        etapa.value = ETAPAS.RECOVER_PASSWORD

    }

    function recuperarSenhaConfirmacao(){

        etapa.value = ETAPAS.RECOVER_PASSWORD_CONFIRM

    }

    return {

        ETAPAS,

        etapa,

        email,

        emailCadastro,

        carregando,

        login,

        cadastro,

        confirmar,

        recuperarSenha,

        recuperarSenhaConfirmacao

    }

})