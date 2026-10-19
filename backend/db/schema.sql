CREATE TABLE IF NOT EXISTS eixos (
  id   INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS niveis (
  id          INTEGER PRIMARY KEY,
  nome        TEXT NOT NULL,
  dificuldade TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conteudos (
  id      INTEGER PRIMARY KEY,
  eixo_id INTEGER NOT NULL REFERENCES eixos(id),
  nome    TEXT NOT NULL
);

-- id estável = conteudo_id * 100 + numero (ex.: Metabolismo celular C1 = 401).
-- "codigo" é o C# do Anexo 2 do protocolo e é a chave natural (conteudo_id, numero).
CREATE TABLE IF NOT EXISTS subconteudos (
  id          INTEGER PRIMARY KEY,
  conteudo_id INTEGER NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
  numero      INTEGER NOT NULL,
  codigo      TEXT    NOT NULL,
  nome        TEXT    NOT NULL,
  UNIQUE (conteudo_id, numero)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  foto      TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Questões. Quase tudo é opcional: o painel /admin permite salvar uma questão
-- em branco e preencher depois. Nas colunas de classificação (ano, nivel_id,
-- objeto_id, conteudo_id, subconteudo_id) o valor ausente é NULL e todo o
-- backend usa LEFT JOIN, então a listagem nunca quebra.
-- As colunas "objeto_matriz_*", "objeto_livro_*", "conteudo_livro_*",
-- "categorizacao" e "observacoes" são a cópia fiel da planilha (auditoria).
CREATE TABLE IF NOT EXISTS questoes (
  id                    INTEGER PRIMARY KEY,
  serial                INTEGER NOT NULL UNIQUE,
  ano                   INTEGER,
  banca                 TEXT    NOT NULL DEFAULT 'Enem',
  prova                 TEXT    NOT NULL DEFAULT '',
  numero_questao        INTEGER,            -- nº no caderno azul de prova
  nivel_id              INTEGER REFERENCES niveis(id),
  conteudo_id           INTEGER REFERENCES conteudos(id),
  subconteudo_id        INTEGER REFERENCES subconteudos(id),
  objeto_id             INTEGER REFERENCES eixos(id),
  resumo                TEXT    NOT NULL DEFAULT '',
  enunciado_texto       TEXT    NOT NULL DEFAULT '',
  enunciado_complemento TEXT    NOT NULL DEFAULT '',
  imagem                TEXT    NOT NULL DEFAULT '',
  imagem_alt            TEXT    NOT NULL DEFAULT '',
  resposta              TEXT    CHECK (resposta IS NULL OR resposta IN ('A','B','C','D','E')),  -- gabarito
  comentario            TEXT    NOT NULL DEFAULT '',
  teoria                TEXT    NOT NULL DEFAULT '[]',
  taxa_acerto           INTEGER NOT NULL DEFAULT 0 CHECK (taxa_acerto BETWEEN 0 AND 100),

  objeto_matriz_id      INTEGER,
  objeto_matriz_nome    TEXT,
  objeto_livro_id       INTEGER,
  objeto_livro_nome     TEXT,
  conteudo_livro_codigo TEXT,               -- "C4"
  conteudo_livro_numero INTEGER,            -- 4
  conteudo_livro_nome   TEXT,               -- texto original da planilha
  categorizacao         INTEGER CHECK (categorizacao IS NULL OR categorizacao IN (1,2,3)),
  observacoes           TEXT,

  criado_em             TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em         TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_questoes_ano         ON questoes(ano);
CREATE INDEX IF NOT EXISTS idx_questoes_nivel       ON questoes(nivel_id);
CREATE INDEX IF NOT EXISTS idx_questoes_objeto      ON questoes(objeto_id);
CREATE INDEX IF NOT EXISTS idx_questoes_conteudo    ON questoes(conteudo_id);
CREATE INDEX IF NOT EXISTS idx_questoes_subconteudo ON questoes(subconteudo_id);

CREATE TABLE IF NOT EXISTS alternativas (
  questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  letra      TEXT    NOT NULL CHECK (letra IN ('A','B','C','D','E')),
  texto      TEXT    NOT NULL,
  PRIMARY KEY (questao_id, letra)
);

CREATE TABLE IF NOT EXISTS palavras_chave (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  palavra    TEXT NOT NULL,
  normalizada TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS questao_palavras_chave (
  questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  palavra_id INTEGER NOT NULL REFERENCES palavras_chave(id) ON DELETE CASCADE,
  ordem      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (questao_id, palavra_id)
);

CREATE INDEX IF NOT EXISTS idx_qpc_palavra ON questao_palavras_chave(palavra_id);

CREATE TABLE IF NOT EXISTS respostas (
  usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id    INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  alternativa   TEXT    NOT NULL,
  correta       INTEGER NOT NULL CHECK (correta IN (0,1)),
  atualizado_em TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, questao_id)
);

CREATE INDEX IF NOT EXISTS idx_respostas_questao ON respostas(questao_id);

CREATE TABLE IF NOT EXISTS questoes_salvas (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, questao_id)
);

CREATE TABLE IF NOT EXISTS questoes_revisar (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usuario_id, questao_id)
);

CREATE TABLE IF NOT EXISTS comentarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  autor      TEXT    NOT NULL,
  texto      TEXT    NOT NULL,
  curtidas   INTEGER NOT NULL DEFAULT 0,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comentarios_questao ON comentarios(questao_id);
