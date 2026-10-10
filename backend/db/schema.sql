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

CREATE TABLE IF NOT EXISTS subconteudos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  conteudo_id INTEGER NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  ordem       INTEGER NOT NULL,
  UNIQUE (conteudo_id, ordem)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  foto      TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS questoes (
  id                    INTEGER PRIMARY KEY,
  serial                INTEGER NOT NULL UNIQUE,
  ano                   INTEGER NOT NULL,
  banca                 TEXT    NOT NULL DEFAULT 'Enem',
  prova                 TEXT    NOT NULL DEFAULT '',
  numero_questao        INTEGER,
  nivel_id              INTEGER NOT NULL REFERENCES niveis(id),
  conteudo_id           INTEGER NOT NULL REFERENCES conteudos(id),
  subconteudo_id        INTEGER NOT NULL REFERENCES subconteudos(id),
  objeto_id             INTEGER NOT NULL REFERENCES eixos(id),
  resumo                TEXT    NOT NULL,
  enunciado_texto       TEXT    NOT NULL,
  enunciado_complemento TEXT    NOT NULL DEFAULT '',
  imagem                TEXT    NOT NULL DEFAULT '',
  imagem_alt            TEXT    NOT NULL DEFAULT '',
  resposta              TEXT    NOT NULL CHECK (resposta IN ('A','B','C','D','E')),
  comentario            TEXT    NOT NULL DEFAULT '',
  teoria                TEXT    NOT NULL DEFAULT '[]',
  taxa_acerto           INTEGER NOT NULL DEFAULT 0 CHECK (taxa_acerto BETWEEN 0 AND 100),
  criado_em             TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em         TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_questoes_ano       ON questoes(ano);
CREATE INDEX IF NOT EXISTS idx_questoes_conteudo  ON questoes(conteudo_id);

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
