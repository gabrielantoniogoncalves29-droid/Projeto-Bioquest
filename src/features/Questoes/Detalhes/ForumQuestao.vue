<script setup>

import { ref, watch, nextTick, computed } from 'vue'
import { Bold, Italic, Underline, List, Send, MessageSquare } from 'lucide-vue-next'

import { buscarComentariosPorQuestao } from '@/services/comentarios'
import { formatarTexto } from '@/utils/formatoTexto'

const props = defineProps({

    questaoId: {
        type: [Number, String],
        default: null
    }

})

const comentarios = ref([])
const carregando = ref(true)
const novoComentario = ref("")
const textareaRef = ref(null)

const ferramentas = [

    { tipo: 'negrito', icone: Bold, titulo: 'Negrito' },
    { tipo: 'italico', icone: Italic, titulo: 'Itálico' },
    { tipo: 'sublinhado', icone: Underline, titulo: 'Sublinhado' },
    { tipo: 'lista', icone: List, titulo: 'Lista' }

]

const totalComentarios = computed(() => comentarios.value.length)

watch(

    () => props.questaoId,

    async (id) => {

        if (!id) {

            comentarios.value = []
            carregando.value = false
            return

        }

        carregando.value = true

        comentarios.value = await buscarComentariosPorQuestao(id)

        carregando.value = false

    },

    { immediate: true }

)

function aplicarFormatacao(tipo) {

    const area = textareaRef.value

    if (!area) return

    const inicio = area.selectionStart
    const fim = area.selectionEnd
    const textoAtual = novoComentario.value
    const selecionado = textoAtual.slice(inicio, fim) || 'texto'

    let marcado = selecionado

    if (tipo === 'negrito') {

        marcado = `**${selecionado}**`

    } else if (tipo === 'italico') {

        marcado = `*${selecionado}*`

    } else if (tipo === 'sublinhado') {

        marcado = `__${selecionado}__`

    } else if (tipo === 'lista') {

        marcado = selecionado
            .split('\n')
            .map(linha => linha.startsWith('- ') ? linha : `- ${linha}`)
            .join('\n')

    }

    novoComentario.value = textoAtual.slice(0, inicio) + marcado + textoAtual.slice(fim)

    nextTick(() => {

        area.focus()

        const novaPosicao = inicio + marcado.length

        area.setSelectionRange(novaPosicao, novaPosicao)

    })

}

function enviarComentario() {

    const texto = novoComentario.value.trim()

    if (!texto) return

    comentarios.value.unshift({

        id: Date.now(),
        autor: "Você",
        texto,
        data: new Date().toISOString().slice(0, 10)

    })

    novoComentario.value = ""

}

</script>

<template>

<div class="forum">

    <div class="nova-mensagem">

        <div class="toolbar">

            <button
                v-for="ferramenta in ferramentas"
                :key="ferramenta.tipo"
                type="button"
                class="btn-ferramenta"
                :title="ferramenta.titulo"
                @click="aplicarFormatacao(ferramenta.tipo)"
            >

                <component :is="ferramenta.icone" :size="15" />

            </button>


        </div>

        <textarea
            ref="textareaRef"
            v-model="novoComentario"
            rows="3"
            placeholder="Ficou com alguma dúvida sobre essa questão? Pergunte por aqui..."
        ></textarea>

        <div class="nova-mensagem-rodape">

            <span class="preview-label" v-if="novoComentario.trim()">
                Prévia:
                <span
                    class="preview-conteudo"
                    v-html="formatarTexto(novoComentario)"
                ></span>
            </span>

            <span v-else></span>

            <button
                class="btn-enviar"
                :disabled="!novoComentario.trim()"
                @click="enviarComentario"
            >
                <Send :size="15" />
                Comentar
            </button>

        </div>

    </div>

    <div
        v-if="carregando"
        class="lista-comentarios"
    >

        <div
            v-for="n in 2"
            :key="n"
            class="placeholder"
        />

    </div>

    <div
        v-else-if="comentarios.length === 0"
        class="vazio"
    >
        <MessageSquare :size="26" />
        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
    </div>

    <div
        v-else
        class="lista-comentarios"
    >

        <div class="lista-cabecalho">
            {{ totalComentarios }} {{ totalComentarios === 1 ? 'comentário' : 'comentários' }}
        </div>

        <div
            v-for="comentario in comentarios"
            :key="comentario.id"
            class="comentario"
        >

            <div class="avatar">
                {{ comentario.autor?.[0] ?? '?' }}
            </div>

            <div class="corpo">

                <div class="linha-topo">

                    <span class="autor">{{ comentario.autor }}</span>

                    <span class="data">{{ comentario.data }}</span>

                </div>

                <div
                    class="texto-formatado"
                    v-html="formatarTexto(comentario.texto)"
                ></div>

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>

.forum{

    display:flex;

    flex-direction:column;

    gap:16px;

}

.nova-mensagem{

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda);

    border-radius:16px;

    padding:16px 20px 20px;

    display:flex;

    flex-direction:column;

    gap:10px;

}

.toolbar{

    display:flex;

    align-items:center;

    gap:6px;

}

.btn-ferramenta{

    display:flex;

    align-items:center;

    justify-content:center;

    width:32px;

    height:32px;

    border:1px solid var(--cor-borda);

    border-radius:8px;

    background:var(--cor-fundo-sutil);

    color:var(--cor-texto-secundario);

    cursor:pointer;

    transition:all .15s ease;

}

.btn-ferramenta:hover{

    background:var(--cor-primaria-fundo);

    border-color:var(--cor-primaria-translucida);

    color:var(--cor-primaria);

}

.toolbar-dica{

    margin-left:6px;

    font-size:12px;

    color:var(--cor-texto-fraco);

}

textarea{

    width:100%;

    border:1px solid var(--cor-borda);

    border-radius:10px;

    padding:12px 14px;

    font-family:inherit;

    font-size:14px;

    color:var(--cor-texto-principal);

    resize:vertical;

    box-sizing:border-box;

    outline:none;

    transition:border-color .2s;

}

textarea:focus{

    border-color:var(--cor-primaria);

}

.nova-mensagem-rodape{

    display:flex;

    align-items:flex-end;

    justify-content:space-between;

    gap:14px;

}

.preview-label{

    font-size:12px;

    color:var(--cor-texto-fraco);

    display:flex;

    flex-wrap:wrap;

    align-items:baseline;

    gap:6px;

    min-width:0;

}

.preview-conteudo{

    color:var(--cor-texto-secundario);

    font-size:13px;

}

.preview-conteudo :deep(p){

    margin:0;

    display:inline;

}

.preview-conteudo :deep(ul){

    margin:4px 0 0 18px;

    padding:0;

}

.btn-enviar{

    align-self:flex-end;

    display:flex;

    align-items:center;

    gap:7px;

    height:40px;

    padding:0 20px;

    border:none;

    border-radius:10px;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-size:14px;

    font-weight:600;

    cursor:pointer;

    white-space:nowrap;

    flex-shrink:0;

    transition:background .2s;

}

.btn-enviar:hover:not(:disabled){

    background:var(--cor-primaria-hover);

}

.btn-enviar:disabled{

    background:var(--cor-borda);

    cursor:not-allowed;

}

.vazio{

    display:flex;

    flex-direction:column;

    align-items:center;

    gap:10px;

    text-align:center;

    padding:36px;

    color:var(--cor-texto-fraco);

    background: var(--cor-fundo-card);

    border:1px dashed var(--cor-borda);

    border-radius:16px;

}

.vazio p{

    margin:0;

}

.lista-comentarios{

    display:flex;

    flex-direction:column;

    gap:12px;

}

.lista-cabecalho{

    font-size:13px;

    font-weight:600;

    color:var(--cor-texto-suave);

    padding:0 4px;

}

.placeholder{

    min-height:90px;

    border-radius:16px;

    background:linear-gradient(90deg,var(--cor-fundo-sutil) 25%,var(--cor-borda-suave) 37%,var(--cor-fundo-sutil) 63%);
    background-size:400% 100%;

    animation:pulso 1.4s ease infinite;

}

@keyframes pulso{

    0%{ background-position:100% 50%; }
    100%{ background-position:0 50%; }

}

.comentario{

    display:flex;

    gap:14px;

    background: var(--cor-fundo-card);

    border:1px solid var(--cor-borda);

    border-radius:16px;

    padding:18px 20px;

}

.avatar{

    display:flex;

    align-items:center;

    justify-content:center;

    width:38px;

    height:38px;

    min-width:38px;

    border-radius:50%;

    background:var(--cor-primaria);

    color: var(--cor-texto-invertido);

    font-weight:700;

    font-size:15px;

    text-transform:uppercase;

}

.corpo{

    flex:1;

    min-width:0;

}

.linha-topo{

    display:flex;

    align-items:baseline;

    gap:10px;

    margin-bottom:6px;

    flex-wrap:wrap;

}

.autor{

    font-weight:700;

    font-size:14px;

    color:var(--cor-texto-principal);

}

.data{

    font-size:12.5px;

    color:var(--cor-texto-fraco);

}

.texto-formatado{

    font-size:14.5px;

    line-height:1.6;

    color:var(--cor-texto-secundario);

}

.texto-formatado :deep(p){

    margin:0 0 8px;

}

.texto-formatado :deep(p:last-child){

    margin-bottom:0;

}

.texto-formatado :deep(strong){

    color:var(--cor-texto-principal);

}

.texto-formatado :deep(ul){

    margin:4px 0 8px 20px;

    padding:0;

}

.texto-formatado :deep(li){

    margin-bottom:2px;

}

@media (max-width:600px){

    .nova-mensagem,
    .comentario{

        padding:16px;

    }

    .toolbar-dica{

        display:none;

    }

    .nova-mensagem-rodape{

        flex-direction:column;

        align-items:stretch;

    }

    .btn-enviar{

        align-self:stretch;

        justify-content:center;

    }

}

</style>
