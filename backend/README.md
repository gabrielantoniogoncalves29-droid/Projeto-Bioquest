# BioQuest - Backend

API do BioQuest (questões de Biologia do ENEM). Faz o login dos usuários, entrega as questões, registra respostas, questões salvas, comentários e estatísticas. O front fica em `../vue-project`.

## Tecnologias

| Biblioteca | Para que serve |
|---|---|
| `express` | Servidor e rotas da API |
| `better-sqlite3` | Banco de dados SQLite |
| `bcryptjs` | Hash das senhas |
| `jsonwebtoken` | Token de login (guardado em cookie `httpOnly`) |
| `cookie-parser` | Leitura dos cookies |
| `zod` | Validação dos dados recebidos |
| `helmet` | Cabeçalhos de segurança |
| `express-rate-limit` | Limite de tentativas (login, recuperar senha) |
| `multer` | Upload da foto de perfil |
| `dotenv` | Variáveis de ambiente (`.env`) |
| `nodemailer` | Envio de e-mails (confirmação e recuperação de senha) |
| `nodemon` | Reinicia o servidor ao salvar (só em desenvolvimento) |

Requisito: Node.js 20 ou superior.

## Estrutura

```
backend/
├── .env                 # segredos (não vai para o Git)
├── .env.example         # modelo do .env
├── package.json
├── db/
│   ├── schema.sql       # criação das tabelas
│   ├── seed.js          # popula o banco a partir dos JSONs
│   └── seed-data/       # card, detalhes, resolver e comentarios (.json)
├── uploads/fotos/       # fotos de perfil (não vai para o Git)
└── src/
    ├── server.js        # inicia o Express
    ├── db.js            # conexão com o SQLite
    ├── config.js        # leitura do .env
    ├── middleware/      # auth, validação, erros
    ├── routes/          # auth, questoes, perfil, comentarios, estatisticas
    └── services/        # regras de negócio e SQL
```

## Como rodar

```bash
cd backend
npm install
cp .env.example .env     # depois edite o .env
npm run seed             # cria as tabelas e importa as questões
npm run dev              # API em http://localhost:3000
```

Em outro terminal, rode o front (`cd vue-project && npm run dev`). O Vite repassa as chamadas `/api` para a porta 3000 (proxy no `vite.config.js`).

Teste rápido: `curl http://127.0.0.1:3000/api/saude` deve responder `{"ok":true}`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor com recarga automática |
| `npm start` | Servidor para produção |
| `npm run seed` | Cria o banco e importa os dados |

## Variáveis de ambiente (`.env`)

```
PORT=3000
NODE_ENV=development
DB_PATH=C:/dados/bioquest.db
JWT_SECRET=troque-por-um-texto-longo-e-aleatorio
FRONTEND_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

> Mantenha o `DB_PATH` **fora do OneDrive**: a sincronização pode travar ou corromper o arquivo do SQLite.

## Banco de dados

Tabelas: `usuarios`, `questoes`, `alternativas`, `respostas`, `questoes_salvas`, `questoes_revisar`, `comentarios`, `tokens`.
Ao excluir um usuário, os dados dele são apagados em cascata. Taxa de acerto e estatísticas são calculadas a partir de `respostas`.

## Endpoints

Hoje existe apenas `GET /api/saude`. O restante está planejado:

| Rota | Função |
|---|---|
| `POST /api/auth/cadastro` | Criar conta |
| `POST /api/auth/confirmar-email` | Confirmar e-mail |
| `POST /api/auth/login` · `/logout` | Entrar e sair |
| `GET /api/auth/me` | Usuário logado |
| `POST /api/auth/recuperar-senha` · `/redefinir-senha` | Recuperar senha |
| `GET /api/questoes` · `/ids` · `/:id` | Listar e consultar questões |
| `GET /api/questoes/:id/enunciado` | Enunciado e alternativas (sem o gabarito) |
| `GET /api/questoes/:id/detalhes` | Detalhes e teoria |
| `POST /api/questoes/:id/resposta` | Responder e receber a correção |
| `PUT` · `DELETE /api/questoes/:id/salvar` | Salvar ou remover |
| `PUT` · `DELETE /api/questoes/:id/revisar` | Marcar ou desmarcar para revisar |
| `GET` · `POST /api/questoes/:id/comentarios` | Fórum da questão |
| `GET` · `PATCH` · `DELETE /api/perfil` | Ver, editar e excluir conta |
| `POST /api/perfil/foto` | Enviar foto de perfil |
| `GET /api/estatisticas` | Estatísticas do usuário |

## Segurança

- Senhas sempre com hash (`bcryptjs`), nunca em texto puro.
- SQL com consultas parametrizadas (`?`), sem concatenar texto.
- Todos os dados recebidos são validados com `zod`.
- Cookie de login com `httpOnly` e, em produção, `secure`.
- O gabarito só é enviado depois que o usuário responde.
- Nunca enviar `.env`, `*.db` ou `uploads/` ao GitHub.

## Produção

- Precisa de um servidor que rode Node **com disco persistente** (VPS ou plataforma com volume). GitHub Pages não executa backend.
- Use HTTPS, `NODE_ENV=production` e um `JWT_SECRET` forte.
- Rode com `pm2` ou `systemd` e faça backup periódico do arquivo `.db`.
