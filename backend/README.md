# BioQuest - Backend

API do BioQuest (Express 5 + SQLite/better-sqlite3 + zod, ES Modules). Entrega as questões, a taxonomia, o autocomplete, comentários (leitura), perfil/foto e registra respostas, questões salvas e para revisar. Inclui um **painel temporário** (`/admin`) para completar as questões.

> Login e usuários ainda não existem: a API usa o usuário demo (id 1) em `src/middleware/usuarioAtual.js`. Quando o login for feito, é só trocar esse middleware.

## Como rodar

```bash
cd backend
npm install
cp .env.example .env
npm run dev            
```

- Painel de cadastro: http://localhost:3000/admin — três abas: **Planilha** (tabela com as 183 questões e filtros por ano, objeto, categoria e situação), **Adicionar questão** e **Editar questão** (lista lateral com filtros e navegação entre pendentes)
- Teste rápido: `curl http://localhost:3000/api/saude`
- Verificação completa (com o servidor rodando): `npm run verificar`
- Front: `cd frontend && npm run dev` → http://localhost:5173/Projeto-Bioquest/

## Origem dos dados (planilha) e como reimportar

A fonte da verdade é `db/seed-data/dados_enem.xlsx` (aba "Todos os anos"; linhas sem `questao_id` são ignoradas). O seed lê o JSON versionado `db/seed-data/questoes.json`, para não depender de Excel/Python no dia a dia.

| Comando | O que faz |
|---|---|
| `npm run seed` | Upsert por `id`: atualiza só as colunas que vêm da planilha (ids, nomes, ano, nº no caderno azul, classificação, gabarito, observações). **Não** mexe em enunciado, alternativas, imagem, comentário, teoria, resumo nem em palavras-chave já existentes. |
| `npm run exportar` | Grava `db/questoes/*.json` e `db/imagens/*` a partir do banco local (o painel já faz isso a cada salvamento). |
| `npm run seed:reset` | Apaga **todas** as questões e o que depende delas (alternativas, palavras-chave, respostas, salvas, revisar, comentários, imagens enviadas) e reimporta. O usuário demo é mantido. |

Ambos imprimem um relatório (total, por ano, por nível, por objeto, termos de autocomplete e linhas com problema). Se uma combinação objeto do livro + `C#` não existir em `db/taxonomia.json`, a importação é cancelada com mensagem clara.

Se a planilha mudar: substitua `dados_enem.xlsx`, rode `python3 db/converter_planilha.py` (requer `pip install openpyxl`) para regerar o JSON e depois `npm run seed`.

## Estrutura

```
backend/
├── admin/            painel temporário (HTML/JS/CSS)
├── db/               schema.sql, taxonomia.json, importar-planilha.js, converter_planilha.py, seed-data/
├── scripts/          verificar-api.mjs (verificação ponta a ponta)
└── src/
    ├── server.js · app.js · config.js · db.js
    ├── routes/       questoes, catalogo, palavrasChave, perfil, admin
    ├── services/     regras e SQL
    ├── utils/        filtrarQuestoes.js (mesma regra do front), texto, erros
    └── middleware/   erros, cache, upload, adminAuth, usuarioAtual
```

Para remover o painel: apague `admin/`, `src/routes/admin.js`, `src/services/adminQuestoes.js` e as linhas do `/admin` em `src/app.js`.

## Endpoints

| Rota | Função |
|---|---|
| `GET /api/questoes?ano=&nivel=&objeto=&conteudo=&subconteudo=&estado=&q=&ordem=` | Cards da lista. Filtros por **id**, vários valores separados por vírgula (E entre grupos, OU dentro do grupo). `ordem`: `recentes`, `antigas`, `maiorDificuldade`, `menorDificuldade` (sem `ordem`, por `serial`). `estado`: 1 respondidas, 2 salvas, 3 marcadas para revisão, 4 não respondidas |
| `GET /api/questoes/ids?...` | Mesmos parâmetros; só os ids na ordem |
| `GET /api/questoes/:id` | Questão **sem gabarito** (`temAlternativas`, `objetoId`, dados da planilha em `planilha`) |
| `GET /api/questoes/:id/explicacao` | Gabarito, resolução comentada e teoria |
| `POST /api/questoes/:id/resposta` | `{ alternativa }` → `{ correta, resposta, comentario, acertos }`. 400 se a questão não tem alternativas; 409 se não tem gabarito |
| `GET /api/questoes/:id/minha-resposta` | Resposta anterior do usuário ou `null` |
| `PUT/DELETE /api/questoes/:id/salvar` · `/revisar` | Salvar / marcar para revisar (idempotentes, 204) |
| `GET /api/questoes/:id/comentarios` | Fórum (leitura). `POST` responde **401** "Faça login para comentar" enquanto `FORUM_ABERTO=false` |
| `GET /api/taxonomia` | Níveis, eixos, conteúdos com subconteúdos (`id`, `codigo` C#, `nome`) e anos existentes |
| `GET /api/config` | Flags: `forumAberto`, `taxaAcertoAtiva` |
| `GET /api/palavras-chave?q=&limite=` | Autocompletar (mín. 2 letras, até 8 sugestões) |
| `GET/PATCH/DELETE /api/perfil` · `POST /api/perfil/foto` | Perfil, foto (campo `foto`), apagar dados |
| `/admin` · `/admin/api/*` | Painel temporário |

Em desenvolvimento os GETs públicos usam `Cache-Control: no-store` (edições do `/admin` aparecem na hora); em produção usam `max-age`.

## Modelo de dados (resumo)

- `questoes.id = questao_id` da planilha (1–183); novas questões do painel recebem `MAX(id)+1`.
- Subconteúdo: id estável `objeto_do_livro * 100 + número do C#` (ex.: Metabolismo celular C1 = **401**), coluna `codigo` = `C#`. "Respiração aeróbica" e "Produção de ATP" são o mesmo subconteúdo (C1 do objeto 4); o texto original fica em `conteudo_livro_nome`.
- O banco guarda ids **e** nomes originais da planilha em `questoes` (`objeto_matriz_*`, `objeto_livro_*`, `conteudo_livro_codigo/numero/nome`, `categorizacao`, `observacoes`). O eixo (objeto da matriz) de cada questão vem da própria coluna da planilha, nunca derivado do conteúdo.
- Quase tudo em `questoes` é opcional. As colunas de classificação (`ano`, `nivel_id`, `objeto_id`, `conteudo_id`, `subconteudo_id`) aceitam `NULL` e o backend usa `LEFT JOIN`; assim uma questão em branco criada no painel nunca quebra a listagem.
- Palavras-chave: conteúdo (sem o trecho entre parênteses) + cada termo de "Outras observações" separado **só por `;`**; deduplicadas sem acento/caixa, na ordem de montagem.
- Schema versionado por `PRAGMA user_version` (`src/db.js`). Bancos antigos são migrados automaticamente (as questões antigas de exemplo são descartadas).

## Variáveis (`.env`)

`PORT`, `DB_PATH`, `UPLOADS_DIR`, `FRONTEND_URL` (origens do CORS, separadas por vírgula), `ADMIN_ATIVO`, `ADMIN_SENHA`, `FORUM_ABERTO`, `EXPORTAR_QUESTOES` (liga/desliga a gravação dos arquivos de questão; padrão: ligada fora de produção).
Em produção o painel fica **desligado** a menos que `ADMIN_ATIVO=true`; use sempre `ADMIN_SENHA`.

## Levar para um servidor

1. Servidor com Node e **disco persistente** (guarde `DB_PATH` e `UPLOADS_DIR` nele e faça backup).
2. `NODE_ENV=production`, `FRONTEND_URL=https://SEU-USUARIO.github.io`, HTTPS na frente (nginx/Caddy).
3. `npm install --omit=dev && npm run seed && npm start` (use `pm2` ou `systemd`).
4. No front, defina `VITE_API_URL` com o endereço da API.

## Questões no Git (como os colaboradores compartilham o que cadastram)

O banco (`backend/data/*.db`) é local e **não vai para o Git**. O que vai para o Git são arquivos de texto, **um por questão**:

```
backend/db/questoes/0165.json    enunciado, alternativas, teoria, comentário, palavras-chave...
backend/db/imagens/0165.png      imagem da questão (se houver)
```

Os dados vindos da planilha (ano, classificação, gabarito) continuam em `db/seed-data/`; os arquivos de questão guardam só o que se edita no painel (questões criadas pelo painel guardam tudo).

**Quem cadastra:**
1. `npm run dev` no backend e abra http://localhost:3000/admin
2. Preencha e clique em **Salvar questão**. O painel já grava `db/questoes/NNNN.json` (e a imagem em `db/imagens/`) sozinho e mostra o caminho do arquivo.
3. `git add backend/db/questoes backend/db/imagens`, commit, push (ou Pull Request). Cada questão é um arquivo, então duas pessoas em questões diferentes não geram conflito. Se alguém **excluir** uma questão no painel, o arquivo some e o commit registra a exclusão.

**Quem recebe (você, ao dar `git pull`):**
```
cd backend
npm run seed
```
O `seed` importa a planilha e depois todos os arquivos de `db/questoes`, copiando as imagens para `uploads/`. Pode rodar sempre: o banco local é só um cache e pode ser apagado e recriado a qualquer hora (`npm run seed:reset` recria tudo a partir do Git).

**Atenção:**
- Já tinha questões cadastradas no seu banco antes desse fluxo? Rode **`npm run exportar`** uma vez para gerar os arquivos, e só depois use `seed:reset`.
- O `seed` avisa se existir no banco uma questão criada no painel sem arquivo, e **cancela a importação dos arquivos** se algum JSON estiver quebrado (mostrando qual).
- Dois colaboradores editando a **mesma** questão geram conflito de merge no JSON, resolvido como qualquer arquivo de texto.
- Em produção a exportação fica desligada (`EXPORTAR_QUESTOES=false`); o painel também.
