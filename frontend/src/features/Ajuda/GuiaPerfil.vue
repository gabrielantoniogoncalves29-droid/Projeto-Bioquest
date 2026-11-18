<script setup>
import {
  UserRound, ListChecks, RotateCcw, Trash2, ShieldCheck, Lock, KeyRound,
  Camera, Mail
} from 'lucide-vue-next'
import SecaoAjuda from './SecaoAjuda.vue'
import Colapsavel from './Colapsavel.vue'

const abas = [
  {
    icone: UserRound,
    titulo: 'Meus dados',
    texto:
      'Atualize sua foto, nome e e-mail e gerencie a segurança da conta.'
  },
  {
    icone: ListChecks,
    titulo: 'Minhas questões',
    texto:
      'Suas listas de estudo: para revisar, salvas e resolvidas.'
  },
  {
    icone: RotateCcw,
    titulo: 'Resetar banco de dados e exclusão de conta',
    texto:
      'Zere o histórico de estudo ou exclua a conta e os dados.'
  }
]
</script>

<template>
  <SecaoAjuda
    id="perfil-guia"
    nivel="sub"
    titulo="Seu perfil, seus dados e a"
    destaque="LGPD"
    subtitulo="Entenda cada aba da página Meu Perfil e como o BioQuest cuida das suas informações."
  >
    <div class="abas">
      <article v-for="aba in abas" :key="aba.titulo" class="aba-card">
        <span class="aba-icone" aria-hidden="true">
          <component :is="aba.icone" :size="26" :stroke-width="1.9" />
        </span>
        <h3>{{ aba.titulo }}</h3>
        <p class="preservar-cor">{{ aba.texto }}</p>
      </article>
    </div>

    <div class="blocos">
      <Colapsavel
        titulo="Meus dados"
        subtitulo="Informações pessoais e segurança"
        :aberto="true"
      >
        <ul class="itens">
          <li>
            <span class="item-icone"><Camera :size="20" /></span>
            <div>
              <strong>Foto</strong>
              <span>Clique em “Alterar foto”. São aceitos arquivos JPG, PNG ou WebP de até 3 MB. Sem foto, o BioQuest mostra as suas iniciais.</span>
            </div>
          </li>
          <li>
            <span class="item-icone"><Mail :size="20" /></span>
            <div>
              <strong>Nome e e-mail</strong>
              <span>Edite os campos e salve as alterações. Para desfazer o que digitou antes de salvar, use “Descartar”.</span>
            </div>
          </li>
          <li>
            <span class="item-icone"><KeyRound :size="20" /></span>
            <div>
              <strong>Senha</strong>
              <span>Em “Segurança”, clique em “Alterar senha” para criar uma nova. Se esqueceu a senha e não consegue entrar, use a recuperação de senha na tela de login: você receberá um link por e-mail.</span>
            </div>
          </li>
        </ul>
      </Colapsavel>

      <Colapsavel
        titulo="Minhas questões"
        subtitulo="Para revisar, salvas e resolvidas"
      >
        <p>
          Reúne as questões que você marcou durante a resolução. Use as três
          abas internas para alternar entre elas:
        </p>
        <ul class="marcadores">
          <li><strong>Para revisar:</strong> questões marcadas com a bandeira.</li>
          <li><strong>Questões salvas:</strong> questões guardadas com o marcador.</li>
          <li><strong>Questões resolvidas:</strong> as que você já respondeu.</li>
        </ul>
        <p>
          Cada aba mostra até seis questões e o link “Ver todas as
          questões” leva à biblioteca. Quando a lista está vazia, o BioQuest
          sugere explorar questões.
        </p>
      </Colapsavel>

      <Colapsavel
        titulo="Resetar banco de dados"
        subtitulo="Recomece do zero quando quiser"
      >
        <p>
          Na aba “Resetar banco de dados e exclusão de conta” você vê quantos
          itens tem em cada categoria e pode zerar cada uma separadamente:
        </p>
        <ul class="marcadores">
          <li>
            <strong>Zerar respondidas:</strong> apaga o histórico de questões
            respondidas e o percentual de acertos volta a zero.
          </li>
          <li>
            <strong>Zerar salvas:</strong> remove todas as questões que você salvou.
          </li>
          <li>
            <strong>Zerar para revisar:</strong> remove a marcação de revisão
            de todas as questões.
          </li>
        </ul>
        <p class="aviso">
          <RotateCcw :size="18" aria-hidden="true" />
          <span>
            Cada ação pede uma confirmação e é <strong>permanente</strong>:
            não é possível desfazer. O botão fica desativado quando não há nada
            para zerar.
          </span>
        </p>
      </Colapsavel>

      <Colapsavel
        titulo="Excluir conta"
        subtitulo="Apaga sua conta e todos os dados armazenados"
      >
        <p>
          Na mesma aba, o bloco “Excluir conta” apaga permanentemente a sua
          conta e todos os dados armazenados: perfil, questões salvas,
          resolvidas e marcadas para revisar. Ao clicar, uma janela
          (“Excluir conta e dados”) pede a sua confirmação antes de concluir.
        </p>
        <p class="aviso perigo">
          <Trash2 :size="18" aria-hidden="true" />
          <span>
            A exclusão é definitiva e não pode ser desfeita. Se quiser apenas
            recomeçar os estudos, prefira zerar os dados em vez de excluir a conta.
          </span>
        </p>
      </Colapsavel>
    </div>

    <article class="lgpd" aria-labelledby="lgpd-titulo">
      <header class="lgpd-topo">
        <span class="lgpd-icone" aria-hidden="true"><ShieldCheck :size="30" :stroke-width="1.8" /></span>
        <div>
          <h3 id="lgpd-titulo">Proteção de dados (LGPD)</h3>
          <p class="preservar-cor">
            A Lei Geral de Proteção de Dados (LGPD) define como informações
            pessoais podem ser coletadas e usadas no Brasil. Veja como ela
            aparece no BioQuest.
          </p>
        </div>
      </header>

      <div class="blocos interno">
        <Colapsavel titulo="No cadastro" subtitulo="O consentimento é pedido ao criar a conta">
          <p>
            Para criar a conta, além de nome, e-mail e senha, você precisa
            marcar a caixa “Li e concordo com o armazenamento e uso dos meus
            dados pessoais para fins da plataforma, em conformidade com a
            LGPD”. Enquanto o formulário estiver incompleto ou a caixa
            desmarcada, o botão “Criar conta” permanece bloqueado.
          </p>
        </Colapsavel>

        <Colapsavel titulo="Quais dados ficam guardados" subtitulo="Perfil e histórico de estudo">
          <ul class="marcadores">
            <li>Perfil: nome, e-mail e foto (se você enviar uma).</li>
            <li>Questões salvas.</li>
            <li>Questões resolvidas.</li>
            <li>Questões marcadas para revisar.</li>
          </ul>
        </Colapsavel>

        <Colapsavel titulo="Você no controle" subtitulo="Edite, zere ou exclua quando quiser">
          <p>
            Você pode corrigir nome e e-mail em “Meus dados”, zerar o histórico
            de estudo por categoria e, a qualquer momento, excluir a conta com
            todos os dados armazenados, conforme previsto na LGPD. O caminho é
            Meu Perfil → “Resetar banco de dados e exclusão de conta” → “Excluir conta”.
          </p>
        </Colapsavel>
      </div>

      <p class="lgpd-nota preservar-cor">
        <Lock :size="15" aria-hidden="true" />
        Mantenha sua senha em segurança e não a compartilhe com ninguém.
      </p>
    </article>
  </SecaoAjuda>
</template>

<style scoped>
.abas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.aba-card {
  position: relative;
  overflow: hidden;
  padding: 24px 22px 26px;
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 18px;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.aba-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 4px;
  background: var(--cor-primaria);
  opacity: .68;
}

.aba-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--cor-primaria) 40%, var(--cor-borda));
  box-shadow: 0 12px 30px rgba(0, 0, 0, .10);
}

.aba-icone {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 14px;
}

.aba-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 750;
  line-height: 1.3;
  letter-spacing: -.3px;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.aba-card p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.blocos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.itens {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 8px 0 4px;
  padding: 0;
  list-style: none;
}

.itens li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.itens strong {
  display: block;
  font-size: 15px;
  color: var(--ajuda-titulo, var(--cor-texto-principal));
}

.itens span:not(.item-icone) {
  font-size: 14.5px;
  line-height: 1.65;
}

.item-icone {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  color: var(--cor-primaria);
  background: var(--cor-primaria-fundo);
  border-radius: 11px;
}

.marcadores {
  margin: 8px 0 12px;
  padding-left: 22px;
}

.marcadores li {
  margin-bottom: 6px;
}

.marcadores li::marker {
  color: var(--cor-primaria);
}

.marcadores strong {
  color: var(--ajuda-titulo, var(--cor-texto-principal));
}

.aviso {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 12px 0 0;
  padding: 14px 16px;
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
  background: var(--cor-acento-amarelo-fundo);
  border: 1px solid color-mix(in srgb, var(--cor-aviso) 35%, transparent);
  border-radius: 12px;
}

.aviso svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--cor-aviso);
}

.aviso.perigo {
  background: var(--cor-perigo-fundo);
  border-color: color-mix(in srgb, var(--cor-perigo) 35%, transparent);
}

.aviso.perigo svg {
  color: var(--cor-perigo);
}

.lgpd {
  margin-top: 30px;
  padding: 28px;
  background: var(--cor-primaria-fundo);
  border: 1px solid color-mix(in srgb, var(--cor-primaria) 28%, transparent);
  border-radius: 20px;
}

.lgpd-topo {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 22px;
}

.lgpd-icone {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 58px;
  height: 58px;
  color: var(--cor-primaria);
  background: var(--cor-fundo-card);
  border: 1px solid var(--cor-borda);
  border-radius: 16px;
}

.lgpd-topo h3 {
  margin: 2px 0 6px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -.5px;
  color: var(--ajuda-titulo, var(--cor-primaria-texto));
}

.lgpd-topo p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ajuda-texto, var(--cor-texto-secundario));
}

.lgpd-nota {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0;
  font-size: 13.5px;
  color: var(--ajuda-texto-suave, var(--cor-texto-suave));
}

@media (max-width: 900px) {
  .abas { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .lgpd { padding: 20px 16px; }
  .lgpd-topo { flex-direction: column; gap: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .aba-card { transition: none; }
  .aba-card:hover { transform: none; }
}
</style>
