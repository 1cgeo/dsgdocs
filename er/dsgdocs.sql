CREATE SCHEMA doc;

CREATE TABLE doc.usuario(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	login VARCHAR(255) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	ativo BOOLEAN NOT NULL DEFAULT TRUE,
	administrador BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE doc.categoria(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE doc.arquivo(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	formato VARCHAR(255) NOT NULL,
	descricao TEXT NOT NULL,
	uuid uuid NOT NULL UNIQUE,
	data_criacao TIMESTAMP WITH TIME ZONE NOT NULL,
	data_cadastramento TIMESTAMP WITH TIME ZONE NOT NULL,
	link VARCHAR(255) NOT NULL,
	categoria_id SMALLINT NOT NULL REFERENCES doc.categoria (id),
	usuario_id SMALLINT NOT NULL REFERENCES doc.usuario (id)
);

CREATE TABLE doc.palavra_chave(
	id SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	arquivo_id SMALLINT NOT NULL REFERENCES doc.arquivo (id)
);

CREATE TABLE doc.grupo_permissao(
	id SMALLINT NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE doc.usuario_permissao(
	id SMALLINT NOT NULL PRIMARY KEY,
	grupo_permissao_id SMALLINT NOT NULL REFERENCES doc.grupo_permissao (id),
	usuario_id SMALLINT NOT NULL REFERENCES doc.usuario (id)
);

CREATE TABLE doc.arquivo_permissao_leitura(
	id SMALLINT NOT NULL PRIMARY KEY,
	grupo_permissao_id SMALLINT NOT NULL REFERENCES doc.grupo_permissao (id),
	arquivo_id SMALLINT NOT NULL REFERENCES doc.arquivo (id)
);

CREATE TABLE doc.arquivo_permissao_edicao(
	id SMALLINT NOT NULL PRIMARY KEY,
	grupo_permissao_id SMALLINT NOT NULL REFERENCES doc.grupo_permissao (id),
	arquivo_id SMALLINT NOT NULL REFERENCES doc.arquivo (id)
);

CREATE TABLE doc.associacao_arquivo(
	id SMALLINT NOT NULL PRIMARY KEY,
	arquivo_1_id SMALLINT NOT NULL REFERENCES doc.arquivo (id),
	arquivo_2_id SMALLINT NOT NULL REFERENCES doc.arquivo (id)
);

COMMIT;