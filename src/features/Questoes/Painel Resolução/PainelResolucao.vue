<script setup>

import { ref, computed } from 'vue'



const props = defineProps({

  questao: {

    type:Object,

    required:true

  },


  detalhes:{

    type:Object,

    required:true

  },


  abertoInicial:{

    type:Boolean,

    default:true

  }


})






const emit = defineEmits([

  'update:aberto'

])




const aberto = ref(props.abertoInicial)




function alternarBarra(){


  aberto.value = !aberto.value



  emit(

    'update:aberto',

    aberto.value

  )


}




const copiado = ref(false)





async function copiarLink(){


  await navigator.clipboard.writeText(

    window.location.href

  )



  copiado.value = true



  setTimeout(()=>{


    copiado.value = false


  },2000)



}






async function compartilhar(){


  if(navigator.share){


    await navigator.share({


      title:

      `Questão ${props.questao.numeroQuestao}`,



      text:

      props.questao.resumo,



      url:

      window.location.href


    })



  }else{


    copiarLink()


  }


}








const objetosEnem = {


1:"Moléculas, células e tecidos",

2:"Hereditariedade e diversidade da vida",

3:"Identidade dos seres vivos",

4:"Ecologia e ciências ambientais",

5:"Origem e evolução da vida",

6:"Qualidade de vida das populações humanas"


}







const numeroObjeto = computed(()=>{


return props.detalhes?.objeto ?? null


})








const nomeObjeto = computed(()=>{


return (

objetosEnem[numeroObjeto.value]

??

"Objeto não informado"

)


})









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







const estrutura = computed(()=>{


return props.detalhes?.estrutura ?? []


})







const estatisticas = computed(()=>{


return props.detalhes?.estatisticas ?? {


taxaAcerto:0,

distribuicao:[]


}


})






const nivel = computed(()=>{


return props.detalhes?.nivel ?? 

"Não informado"



})



</script>

<template>

<div
  class="barra-lateral"
  :class="{ fechado: !aberto }"
>


<button

class="botao-toggle"

@click="alternarBarra"

>

<svg

width="20"

height="20"

viewBox="0 0 24 24"

fill="none"

stroke="currentColor"

stroke-width="3"

stroke-linecap="round"

stroke-linejoin="round"

>

<polyline

v-if="aberto"

points="15 18 9 12 15 6"

/>


<polyline

v-else

points="9 18 15 12 9 6"

/>

</svg>


</button>





<div
v-if="aberto"
class="painel"
>





<div class="card-info">


<h2>
Objeto de conhecimento ENEM
</h2>



<div class="card objeto">

  <img
    v-if="imagemObjeto"
    class="objeto-icon"
    :src="imagemObjeto"
    alt="Objeto de conhecimento"
  />

  <div class="objeto-info">

    <span class="label">
      Objeto de conhecimento
    </span>

    <h3>
      {{ nomeObjeto }}
    </h3>

  </div>

</div>


</div>








<h2>

Estrutura dos livros didáticos

</h2>





<div class="estrutura">



<div 
v-for="(item,index) in estrutura"
:key="index"
>


<div class="estrutura-item">


<img

v-if="index===0"

class="estrutura-icon"

:src="imagemEstrutura(item)"

alt="Ícone"

/>


<span>

{{ item.nome }}

</span>


</div>





<span
v-if="index < estrutura.length-1"
class="arrow"
>

›

</span>


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

width:
estatisticas.taxaAcerto + '%'

}"

>

</div>


</div>


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


</template>

<style scoped>




.barra-lateral {


width:380px;

height:100vh;

    background:#fcfcfc;

    border-left:1px solid #eef2f4;

    box-shadow:-2px 0 12px rgba(0,0,0,.05);

position:absolute;







transition:

width .35s ease;


overflow:visible;


box-shadow:

-5px 0 20px rgba(0,0,0,.08);


}




.barra-lateral.fechado {


width:55px;


}



.botao-toggle {


position:absolute;


left:-18px;


top:30px;


width:36px;

height:36px;


border-radius:50%;


background:white;


border:1px solid #e5e7eb;


display:flex;

align-items:center;

justify-content:center;


cursor:pointer;


color:#0d6b4d;


box-shadow:0 4px 12px rgba(0,0,0,.15);


}



.botao-toggle:hover {


  transform:

  translateX(-50%)

  scale(1.05);


}






.painel{

    padding:24px;

    gap:22px;

    overflow-y:auto;

}











.card-info,
.card-estatistica,
.card-distribuicao,
.compartilhar{

    background:#ffffff;

    border:none;

    border-radius:16px;

    padding:18px;

    box-shadow:

        0 2px 8px rgba(15,23,42,.04);

}






.card-resposta {


  display:flex;

  flex-direction:column;

  gap:10px;


}







.label {


  display:block;


  color:#6b7280;


  font-size:12px;


  margin-bottom:6px;


}







.resposta {


  width:42px;


  height:42px;


  border-radius:50%;


  background:#0d6b4d;


  color:white;


  display:flex;


  align-items:center;


  justify-content:center;


  font-weight:700;


  font-size:18px;


}







.card-info h3 {


  margin:0 0 8px;


  font-size:15px;


  color:#111827;


}





.card-info p {


  margin:0;


  font-size:13px;


  line-height:1.5;


  color:#6b7280;


}




.objeto {


  display:flex;


  align-items:center;


  gap:12px;


  margin-bottom:18px;


}




.objeto-icon {


  width:50px;


  height:50px;


  object-fit:contain;


}




h2{

    font-size:13px;

    font-weight:700;

    color:#6b7280;

    text-transform:uppercase;

    letter-spacing:.08em;

    margin-bottom:14px;

}





.estrutura {


  display:flex;


  align-items:center;


  flex-wrap:wrap;


  gap:8px;


}




.estrutura-item {


  display:flex;


  align-items:center;


  gap:8px;




  padding:8px 10px;


  border-radius:10px;


  font-size:13px;


  color:#0d6b4d;


    background:#f6faf8;

    border:1px solid #e7f2ec;



}

.estrutura-icon {


  width:26px;


  height:26px;


  object-fit:contain;


}




.arrow {


  color:#94a3b8;


  font-size:22px;


}




.nivel {


  margin-top:16px;


  display:flex;


  align-items:center;


  gap:10px;


}



.icon {


  width:26px;


  height:26px;


  color:#0d6b4d;


}









.header-card {


  display:flex;


  justify-content:space-between;


  margin-bottom:10px;


  font-size:14px;


}



.barra{

    height:12px;

    background:#eef2f5;

    border-radius:999px;

}

.preenchimento{

    background:linear-gradient(
        90deg,
        #0d6b4d,
        #22c55e
    );

}


.item{

    padding:6px 0;

}


.item+.item{

    border-top:1px solid #f1f3f5;

}



.titulo {


  font-size:14px;


  font-weight:600;


}




.item {


  display:grid;


  grid-template-columns:

  20px

  1fr

  45px;


  align-items:center;


  gap:10px;


  margin-top:12px;


  font-size:13px;


}




.barra-mini {


  height:8px;


  background:#edf0f2;


  border-radius:999px;


  overflow:hidden;


}




.fill {


  height:100%;


  background:#94a3b8;


  transition:width .8s ease;


}




.fill.correta {


  background:#0d6b4d;


}





.compartilhar {


  background:white;


  border:1px solid #edf0f2;


  border-radius:12px;


  padding:14px;


}



.action{

    background:#ffffff;

    color:#0d6b4d;

    border:1px solid #0d6b4d;

    transition:.2s;

}

.action:hover{

    background:#0d6b4d;

    color:white;

}




/* ==================================================
   SCROLL
================================================== */


.painel::-webkit-scrollbar {


  width:6px;


}

.objeto{

    align-items:flex-start;

}

.objeto-icon{

    width:42px;

    height:42px;

}

.card-info h3{

    font-size:16px;

    margin-bottom:4px;

}

.painel::-webkit-scrollbar-thumb {


  background:#d1d5db;


  border-radius:20px;


}




</style>