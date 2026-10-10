# BioQuest - Backend

API do BioQuest (Express + SQLite). Entrega as questões, palavras-chave do autocompletar, comentários, perfil/foto e registra respostas, questões salvas e para revisar. Inclui um **painel temporário** (`/admin`) para cadastrar questões.

> Login e usuários ainda não existem: a API usa um usuário demo (id 1) em `src/middleware/usuarioAtual.js`. Quando o login for feito, é só trocar esse middleware.

## Como rodar

```bash
cd backend
npm install
cp .env.example .env
npm run seed        # cria o banco e importa as 8 questões de exemplo
npm run dev         # API em http://localhost:3000
```

- Painel de cadastro: http://localhost:3000/admin
- Teste: `curl http://localhost:3000/api/saude`
- Front: `cd frontend && npm run dev` (o Vite repassa `/api` e `/uploads` para a porta 3000).

`npm run seed` não mexe em um banco que já tem questões. `npm run seed:reset` apaga as questões e reimporta os exemplos.

## Estrutura

```
backend/
├── admin/            painel temporário (HTML/JS/CSS) - pode apagar depois
├── db/               schema.sql, taxonomia.json, seed.js e seed-data/
└── src/
    ├── server.js · app.js · config.js · db.js
    ├── routes/       questoes, palavrasChave, perfil, admin
    ├── services/     regras e SQL
    └── middleware/   erros, upload, adminAuth, usuarioAtual
```

Para remover o painel: apague `admin/`, `src/routes/admin.js`, `src/services/adminQuestoes.js` e as linhas do `/admin` em `src/app.js`.

## Endpoints

| Rota | Função |
|---|---|
| `GET /api/questoes` | Cards da lista (com palavras-chave) |
| `GET /api/questoes/ids` | Ids na ordem de navegação |
| `GET /api/questoes/:id` | Questão completa **sem gabarito** (usada no resolver e na prévia dos detalhes) |
| `GET /api/questoes/:id/explicacao` | Gabarito, resolução comentada e teoria |
| `POST /api/questoes/:id/resposta` | `{ alternativa }` → correção |
| `PUT/DELETE /api/questoes/:id/salvar` · `/revisar` | Salvar / marcar para revisar |
| `GET/POST /api/questoes/:id/comentarios` | Fórum |
| `GET /api/palavras-chave?q=&limite=` | Autocompletar |
| `GET/PATCH/DELETE /api/perfil` · `POST /api/perfil/foto` | Perfil, foto (campo `foto`), apagar dados |
| `/admin` · `/admin/api/*` | Painel temporário |

## Variáveis (`.env`)

`PORT`, `DB_PATH`, `UPLOADS_DIR`, `FRONTEND_URL` (origens liberadas no CORS, separadas por vírgula), `ADMIN_ATIVO`, `ADMIN_SENHA`.
Em produção o painel fica **desligado** a menos que `ADMIN_ATIVO=true`; use sempre `ADMIN_SENHA`.

## Levar para um servidor

1. Servidor com Node e **disco persistente** (VPS ou plataforma com volume). Guarde `DB_PATH` e `UPLOADS_DIR` nesse disco e faça backup.
2. `NODE_ENV=production`, `FRONTEND_URL=https://SEU-USUARIO.github.io`, HTTPS na frente (nginx/Caddy).
3. `npm install --omit=dev && npm run seed && npm start` (use `pm2` ou `systemd`).
4. No front, defina a variável `VITE_API_URL` (no GitHub: Settings → Variables → `VITE_API_URL`) com o endereço da API.

## Banco

`questoes`, `alternativas`, `palavras_chave` (+ ligação), `eixos`/`conteudos`/`subconteudos`/`niveis` (sincronizados de `db/taxonomia.json` ao iniciar), `usuarios`, `respostas`, `questoes_salvas`, `questoes_revisar`, `comentarios`.
A taxa de acerto da questão usa o valor cadastrado até haver 20 respostas; depois é calculada das respostas reais.
