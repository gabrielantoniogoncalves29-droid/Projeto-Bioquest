import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { lerToken, gravarToken, dadosDoToken, definirAoPerderSessao, CHAVE_TOKEN } from "@/services/api"
import * as servico from "@/services/auth"
import { usePerfilStore } from "@/store/perfil"
import { useQuestoesFiltrosStore } from "@/store/questoes_filtros"
import { useUiStore } from "@/store/resolver/ui"

export const ETAPAS = {

    LOGIN: 0,

    REGISTER: 1,

    REGISTER_CONFIRM: 2,

    RECOVER_PASSWORD: 3,

    RECOVER_PASSWORD_CONFIRM: 4,

    EMAIL_TOKEN: 5,

    NEW_PASSWORD: 6

}

const INTERVALO_RENOVACAO = 15 * 60 * 1000

export const useAuthStore = defineStore("auth", () => {

    const etapa = ref(ETAPAS.LOGIN)

    const email = ref("")

    const emailCadastro = ref("")

    const emailEnviado = ref(true)

    const tokenAcao = ref("")

    const carregando = ref(false)

    const status = ref("carregando")

    const usuario = ref(null)

    const autenticado = computed(() => status.value === "autenticado")

    let inicializacao = null
    let temporizador = null
    let ouvindoArmazenamento = false

    function login(){

        etapa.value = ETAPAS.LOGIN

    }

    function cadastro(){

        etapa.value = ETAPAS.REGISTER

    }

    function confirmar(emailUsuario, enviado = true){

        emailCadastro.value = emailUsuario
        email.value = emailUsuario
        emailEnviado.value = enviado

        etapa.value = ETAPAS.REGISTER_CONFIRM

    }

    function recuperarSenha(){

        etapa.value = ETAPAS.RECOVER_PASSWORD

    }

    function recuperarSenhaConfirmacao(){

        etapa.value = ETAPAS.RECOVER_PASSWORD_CONFIRM

    }

    function confirmarPorToken(){

        etapa.value = ETAPAS.EMAIL_TOKEN

    }

    function novaSenha(){

        etapa.value = ETAPAS.NEW_PASSWORD

    }

    function limparDadosPrivados(){

        usePerfilStore().limpar()

        useQuestoesFiltrosStore().limparFiltros()

    }

    function pararRenovacao(){

        clearInterval(temporizador)

        temporizador = null

    }

    async function renovarSeNecessario(){

        const token = lerToken()

        const dados = token ? dadosDoToken(token) : null

        if (!dados) return

        const restante = dados.expiraEm - Date.now()

        if (restante > (dados.expiraEm - dados.emitidoEm) / 2) return

        try {

            const sessao = await servico.renovarSessao()

            if (lerToken() === token) gravarToken(sessao.token)

        } catch {

            return

        }

    }

    function agendarRenovacao(){

        pararRenovacao()

        temporizador = setInterval(renovarSeNecessario, INTERVALO_RENOVACAO)

    }

    function aplicarSessao({ token, usuario: dados }){

        useUiStore().limparRespostasSessao()

        if (usuario.value && usuario.value.email !== dados.email) limparDadosPrivados()

        gravarToken(token)

        usuario.value = dados

        status.value = "autenticado"

        agendarRenovacao()

    }

    function encerrarLocalmente(){

        pararRenovacao()

        gravarToken(null)

        usuario.value = null

        status.value = "anonimo"

        inicializacao = Promise.resolve()

        limparDadosPrivados()

    }

    function ouvirOutrasAbas(){

        if (ouvindoArmazenamento) return

        ouvindoArmazenamento = true

        window.addEventListener("storage", evento => {

            if (evento.key !== CHAVE_TOKEN) return

            if (!evento.newValue) {

                if (status.value === "autenticado") encerrarLocalmente()

                return

            }

            if (status.value !== "autenticado") {

                inicializacao = null

                iniciar()

            }

        })

        document.addEventListener("visibilitychange", () => {

            if (document.visibilityState === "visible" && status.value === "autenticado") renovarSeNecessario()

        })

    }

    function iniciar(){

        if (inicializacao) return inicializacao

        ouvirOutrasAbas()

        definirAoPerderSessao(() => {

            if (status.value === "autenticado") encerrarLocalmente()

        })

        if (!lerToken()) {

            status.value = "anonimo"

            inicializacao = Promise.resolve()

            return inicializacao

        }

        status.value = "carregando"

        inicializacao = servico.buscarUsuarioAtual()
            .then(dados => {

                usuario.value = dados

                status.value = "autenticado"

                agendarRenovacao()

                renovarSeNecessario()

            })
            .catch(erro => {

                if (erro.response?.status === 401) {

                    gravarToken(null)

                    usuario.value = null

                    status.value = "anonimo"

                    return

                }

                status.value = "anonimo"

                inicializacao = null

            })

        return inicializacao

    }

    async function entrar(emailUsuario, senha){

        const sessao = await servico.requisitarLogin(emailUsuario, senha)

        aplicarSessao(sessao)

    }

    async function entrarComGoogle(credencial){

        const sessao = await servico.requisitarGoogle(credencial)

        aplicarSessao(sessao)

    }

    async function cadastrar(nome, emailUsuario, senha){

        return servico.requisitarCadastro(nome, emailUsuario, senha)

    }

    async function sair(){

        try {

            await servico.encerrarSessaoNoServidor()

        } catch {

        }

        encerrarLocalmente()

    }

    function atualizarUsuario(dados){

        if (usuario.value) usuario.value = { ...usuario.value, ...dados }

    }

    return {

        ETAPAS,

        etapa,

        email,

        emailCadastro,

        emailEnviado,

        tokenAcao,

        carregando,

        status,

        usuario,

        autenticado,

        login,

        cadastro,

        confirmar,

        recuperarSenha,

        recuperarSenhaConfirmacao,

        confirmarPorToken,

        novaSenha,

        iniciar,

        entrar,

        entrarComGoogle,

        cadastrar,

        sair,

        aplicarSessao,

        atualizarUsuario

    }

})
