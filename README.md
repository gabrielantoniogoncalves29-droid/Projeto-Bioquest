# BioQuest
Plataforma web desenvolvida em Vue.js para prática de questões de Biologia do ENEM, com foco em acesso gratuito e melhoria do desempenho dos estudantes.

## Objetivo
Oferecer uma ferramenta simples e eficiente para estudo de Biologia voltado ao ENEM.

## Rodar localmente

### Backend

Em um terminal:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

`npm run seed` importa os dados da planilha e o conteúdo dos arquivos em
`backend/db/questoes` para o banco local. Rode novamente após alterar esses
arquivos; não use `--reset` se quiser preservar os dados locais.

### Frontend

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente
`http://localhost:5173/Projeto-Bioquest/`.

### Build de produção

```sh
cd frontend
npm run build
```
