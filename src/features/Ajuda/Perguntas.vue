<template>
    <section>
        <div class="conteiner-perguntas">
            <h1>FAQ - Perguntas frequentes</h1>
            <div class="accordion-box">
                <details class="accordion">
                    <summary>1. O que é o BioQuest?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        O BioQuest é uma plataforma desenvolvida para auxiliar estudantes na preparação para o ENEM por meio de questões de Biologia. Nosso objetivo é tornar o estudo mais organizado, prático e eficiente, oferecendo exercícios, estatísticas de desempenho e acompanhamento da evolução do aluno.
                    </p>
                </details>
                <details class="accordion">
                    <summary>2. O BioQuest é gratuito?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Sim. O BioQuest pode ser utilizado gratuitamente para resolver questões de Biologia do ENEM e acompanhar seu desempenho. Caso novos recursos sejam adicionados futuramente, eles serão informados diretamente na plataforma.
                    </p>
                </details>
                <details class="accordion">
                    <summary>3. As questões são oficiais do ENEM?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Sim. As questões disponíveis são baseadas em provas oficiais do ENEM, permitindo que você estude utilizando o mesmo estilo de cobrança encontrado no exame.
                    </p>
                </details>
                <details class="accordion">
                    <summary>4. Como funciona o sistema de resolução de questões?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Basta selecionar uma questão, analisar o enunciado e escolher a alternativa que considera correta. Após responder, você poderá verificar a resposta correta e acompanhar seu desempenho ao longo dos estudos.
                    </p>
                </details>
                <details class="accordion">
                    <summary>5. Posso acompanhar meu progresso?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Sim. O BioQuest registra seu desempenho para que você possa visualizar estatísticas como quantidade de questões respondidas, taxa de acertos e evolução ao longo do tempo. Assim, fica mais fácil identificar seus pontos fortes e os conteúdos que precisam de mais atenção.
                    </p>
                </details>
                <details class="accordion">
                    <summary>6. Preciso criar uma conta para utilizar a plataforma?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Alguns recursos podem ser acessados sem cadastro. No entanto, criar uma conta permite salvar seu progresso, acompanhar estatísticas e acessar funcionalidades personalizadas.
                    </p>
                </details>
                <details class="accordion">
                    <summary>7. Como posso encontrar questões de um assunto específico?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Você pode utilizar os filtros de pesquisa para selecionar temas como Genética, Ecologia, Citologia, Evolução, Botânica, Zoologia, Fisiologia Humana, Biotecnologia e diversos outros conteúdos cobrados no ENEM.
                    </p>
                </details>
                <details class="accordion">
                    <summary>8. O BioQuest possui explicações das respostas?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Sempre que disponível, as questões contam com comentários ou explicações para ajudar você a compreender o motivo da alternativa correta e aprender com seus erros.
                    </p>
                </details>
                <details class="accordion">
                    <summary>9. Posso acessar a plataforma pelo celular?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Sim. O BioQuest foi desenvolvido com um design responsivo, permitindo uma boa experiência de uso tanto em computadores quanto em smartphones e tablets.
                    </p>
                </details>
                <details class="accordion">
                    <summary>10. Como entrar em contato caso eu encontre algum problema?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Caso encontre algum erro ou tenha sugestões para melhorar a plataforma, utilize a página de contato ou envie uma mensagem para nossa equipe. Seu feedback é muito importante para que possamos aprimorar continuamente o BioQuest.
                    </p>
                </details>
                <details class="accordion">
                    <summary>11. Como posso melhorar meu desempenho no ENEM utilizando o BioQuest?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Recomendamos criar uma rotina de estudos, resolver questões regularmente, revisar os conteúdos com maior índice de erro e acompanhar suas estatísticas. A prática constante é uma das melhores formas de aumentar o desempenho na prova.
                    </p>
                </details>
                <details class="accordion">
                    <summary>12. O BioQuest é destinado apenas para estudantes do ENEM?
                        <span class="material-symbols-outlined seta">
                            keyboard_arrow_down
                        </span>
                    </summary>
                    <p>
                        Não. Embora tenha foco na preparação para o ENEM, a plataforma também pode ser utilizada por estudantes do Ensino Médio, vestibulandos e qualquer pessoa interessada em reforçar seus conhecimentos em Biologia.
                    </p>
                </details>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .accordion-box{
        padding-bottom: 30px;
    }
    .conteiner-perguntas{
        background-color: white;
        border-radius: 10px;
        height: fit-content;
        width: 90%;
        max-width: 1400px;
        transform: translateY(-100px);
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .conteiner-perguntas h1{
        font-family: sans-serif;
        font-size: 28px;
        color: rgb(28, 75, 47);
        text-align: center;
        padding-top: 30px;
    }
    .accordion{
        background-color: white;
        color: rgb(28, 75, 47);
        border-radius: 10px;
        margin: 30px 50px;
        padding: 20px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        font-family: sans-serif;
        align-items: center;
    }
    .accordion summary{
        display: flex;
        font-size: 18px;
        list-style: none;
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
    }
    .accordion p{
        font-size: 16px;
        text-decoration: none;
    }
    .seta{
        font-size: 28px;
        transition: 300ms ease;
    }
    .accordion[open] .seta{
        rotate: 180deg;
    }
</style>