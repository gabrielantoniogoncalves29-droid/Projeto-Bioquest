<script setup>

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useResolverStore } from '@/store/resolver/resolver'
import { useDetalhesStore } from '@/store/resolver/detalhes'
import { useUiStore } from '@/store/resolver/ui'

const resolver = useResolverStore()
const detalhesStore = useDetalhesStore()
const painel = useUiStore()

const {
    aberto
} = storeToRefs(painel)




const { questao } = storeToRefs(resolver)

const { detalheAtual: detalhes } = storeToRefs(detalhesStore)

const copiado = ref(false)



async function copiarLink(){

    await navigator.clipboard.writeText(
        window.location.href
    )

    copiado.value = true

    setTimeout(() => {

        copiado.value = false

    },2000)

}



async function compartilhar(){

    if(navigator.share){

        await navigator.share({

            title: `Questão ${questao.value?.numeroQuestao}`,

            text: questao.value?.resumo,

            url: window.location.href

        })

    }else{

        copiarLink()

    }

}



const objetosEnem={

1:"Moléculas, células e tecidos",

2:"Hereditariedade e diversidade da vida",

3:"Identidade dos seres vivos",

4:"Ecologia e ciências ambientais",

5:"Origem e evolução da vida",

6:"Qualidade de vida das populações humanas"

}



const numeroObjeto = computed(()=>
    detalhes.value?.objeto ?? null
)



const nomeObjeto = computed(()=>

    objetosEnem[numeroObjeto.value]

    ??

    "Objeto não informado"

)



const imagemObjeto = computed(()=>{

    if(!numeroObjeto.value)
        return null

    return new URL(

        `../icons/objeto${numeroObjeto.value}.png`,

        import.meta.url

    ).href

})



function imagemEstrutura(item){

    if(!item?.icone)
        return ''

    return new URL(

        `../icons/${item.icone}.png`,

        import.meta.url

    ).href

}



const estrutura = computed(()=>

    detalhes.value?.estrutura ?? []

)



const estatisticas = computed(()=>

    detalhes.value?.estatisticas ??

    {

        taxaAcerto:0,

        distribuicao:[]

    }

)



const nivel = computed(()=>

    detalhes.value?.nivel ??

    "Não informado"

)

</script>

<template>

<div
class="barra-lateral"
:class="{ fechado: !aberto }"
>








<div
v-if="aberto"
class="painel"
>





<div class="card-info">


    <span class="label">
      Objeto de conhecimento
    </span>

<div class="card objeto">

  <img
    v-if="imagemObjeto"
    class="objeto-icon"
    :src="imagemObjeto"
    alt="Objeto de conhecimento"
  />

  <div class="objeto-info">



    <h3>
      {{ nomeObjeto }}
    </h3>

  </div>

</div>


</div>








<div class="card-info">
    <span class="label">
      Estrutura do livro didático
    </span>

    <div class="card estrutura">
    <div class="objeto">
        <template
            v-for="(item,index) in estrutura"
            :key="index"
        >

            <div class="estrutura-item">

                <img
                    v-if="item.icone"
                    class="estrutura-icon"
                    :src="imagemEstrutura(item)"
                    alt=""
                >

                <span>{{ item.nome }}</span>

            </div>

            <span
                v-if="index < estrutura.length-1"
                class="arrow"
            >
                ›
            </span>

        </template>

    </div>
    </div>
</div>



<div class="nivel">


<svg
class="icon"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
>


<path d="M9 18h6"/>

<path d="M10 22h4"/>

<path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>


</svg>




<div>

<span class="label">

Nível

</span>


<strong>

{{ nivel }}

</strong>


</div>


</div>







<div class="card-estatistica">


<div class="header-card">


<span>

Percentual de acertos

</span>


<strong>

{{ estatisticas.taxaAcerto }}%

</strong>


</div>









<div class="barra">
    <div
        class="preenchimento"
        :style="{
            width: estatisticas.taxaAcerto + '%'
        }"
    />
</div>











<div class="card-distribuicao">


<span class="titulo">

Alternativas mais marcadas

</span>





<div

class="item"

v-for="item in estatisticas.distribuicao"

:key="item.alternativa"

>


<span>

{{ item.alternativa }}

</span>





<div class="barra-mini">


<div

class="fill"

:class="{

correta:
item.alternativa === questao.resposta

}"

:style="{

width:item.percentual + '%'

}"

>

</div>


</div>





<span>

{{ item.percentual }}%

</span>


</div>


</div>






<div class="compartilhar">


<span class="label">

Compartilhar link da questão

</span>




<button

class="action"

@click="copiarLink"

>


<svg

width="16"

height="16"

viewBox="0 0 24 24"

fill="currentColor"

>


<path d="
M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3
4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11
c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z
"/>


</svg>



{{ copiado ? 'Copiado' : 'Copiar' }}



</button>


</div>





</div> 


</div> 

</div>
</template>


<style scoped>

.barra-lateral{
    position: relative;
    width:380px;
    height:100%;
    background:#fcfcfc;
    border-left:1px solid #eef2f4;
    box-shadow:-5px 0 20px rgba(0,0,0,.08);
    transition:width .35s ease;
    overflow:hidden;
}

.barra-lateral.fechado{
    width:55px;
}

.botao-toggle{
    position:absolute;
    left:-18px;
    top:30px;

    width:36px;
    height:36px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;
    border:1px solid #e5e7eb;
    background:#fff;

    color:#0d6b4d;
    cursor:pointer;

    box-shadow:0 4px 12px rgba(0,0,0,.15);

    transition:.2s;
}

.botao-toggle:hover{
    transform:scale(1.05);
}

.painel{
    display:flex;
    flex-direction:column;
    gap:22px;

    height:100%;
    padding:24px;

    overflow-y:auto;
}

.card-info,
.card-estatistica,
.card-distribuicao,
.compartilhar{
    background:#fff;
    border-radius:16px;
    padding:18px;
    box-shadow:0 2px 8px rgba(15,23,42,.04);
}

h2{
    margin:0 0 14px;

    font-size:13px;
    font-weight:700;

    color:#6b7280;

    text-transform:uppercase;
    letter-spacing:.08em;
}

.label{
    display:block;
    margin-bottom:6px;

    color:#6b7280;
    font-size:12px;
}

.objeto{
    display:flex;
    align-items:flex-start;
    gap:12px;
}

.objeto-icon{
    width:42px;
    height:42px;
    object-fit:contain;
}

.card-info h3{
    margin:0 0 4px;
    font-size:16px;
    color:#111827;
}

.card-info p{
    margin:0;

    color:#6b7280;
    font-size:13px;
    line-height:1.5;
}
.estrutura-card{
    display:flex;
    align-items:center;
    gap:10px;

    padding:16px 18px;

    background:#fff;
    border-radius:14px;
}

.estrutura-item{
    display:flex;
    align-items:center;
    gap:10px;

    color:#111827;
    font-size:15px;
    font-weight:500;
}

.estrutura-icon{
    width:42px;
    height:42px;
    object-fit:contain;
    flex-shrink:0;
}

.arrow{
    font-size:24px;
    color:#9ca3af;
    font-weight:600;
}

.compartilhar{
display: flex;
align-items: center;
gap: 20px;
}

.estrutura-icon{
    width:26px;
    height:26px;
    object-fit:contain;
}

.arrow{
    font-size:22px;
    color:#94a3b8;
}

.nivel{
    display:flex;
    align-items:center;
    gap:10px;
}

.icon{
    width:26px;
    height:26px;
    color:#0d6b4d;
}

.header-card{
    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:10px;

    font-size:14px;
}

.barra{
    width:90%;
    height:12px;

    background:#eef2f5;
    border-radius:999px;

    overflow:hidden;
}

.preenchimento{
    height:100%;
    background:linear-gradient(90deg,#0d6b4d,#22c55e);
    transition:width .8s ease;
}

.titulo{
    font-size:14px;
    font-weight:600;
}

.item{
    display:grid;
    grid-template-columns:20px 1fr 45px;
    align-items:center;

    gap:10px;

    padding:6px 0;
    font-size:13px;
}

.item+.item{
    border-top:1px solid #f1f3f5;
}

.barra-mini{
    height:8px;
    background:#edf0f2;
    border-radius:999px;
    overflow:hidden;
}

.fill{
    height:100%;
    background:#94a3b8;
    transition:width .8s ease;
}

.fill.correta{
    background:#0d6b4d;
}

.action{
    display:flex;

    gap:8px;

    padding:8px 12px;

    background:#fff;
    color:#0d6b4d;

    border:1px solid #0d6b4d43;
    border-radius:8px;

    cursor:pointer;
    font-size: 14px;
    transition:.2s;
}



.action:hover{
    background:#0d6b4d;
    color:#fff;
}

.painel::-webkit-scrollbar{
    width:6px;
}

.painel::-webkit-scrollbar-thumb{
    background:#d1d5db;
    border-radius:20px;
}

</style>