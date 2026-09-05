CREATE DATABASE IF NOT EXISTS db_HeberModelo DEFAULT CHARACTER SET = utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE db_HeberModelo;

CREATE TABLE IF NOT EXISTS tbUsuario (
    matricula_usuario NUMERIC(11),
    email_usuario VARCHAR(50) NOT NULL,
    nome_usuario VARCHAR(50) NOT NULL,
    senha_usuario TEXT NOT NULL,
    tipo_usuario CHARACTER(1) DEFAULT 'E',
    CONSTRAINT un_EmailtbUsuario UNIQUE (email_usuario),
    CONSTRAINT un_NometbUsuario UNIQUE (nome_usuario),
    CONSTRAINT ck_TipotbUsuario CHECK (tipo_usuario IN ('E', 'P')),
    CONSTRAINT pk_tbUsuario PRIMARY KEY (matricula_usuario)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS tbAtividade (
    codigo_atividade TINYINT AUTO_INCREMENT,
    nome_atividade VARCHAR(100) NOT NULL,
    descricao_atividade TEXT NOT NULL,
    is_prova_atividade BOOL NOT NULL,
    data_postagem_atividade DATETIME NOT NULL,
    data_limite_atividade DATETIME NOT NULL,
    matricula_usuario NUMERIC(11),
    CONSTRAINT pk_tbAtividade PRIMARY KEY (codigo_atividade),
    CONSTRAINT fk_tbUsuariotbAtividade FOREIGN KEY (matricula_usuario) REFERENCES tbUsuario(matricula_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS tbFeedback(
    codigo_feedback TINYINT AUTO_INCREMENT,
    descricao_feedback TEXT NOT NULL,
    codigo_atividade TINYINT,
    matricula_professor NUMERIC(11),
    CONSTRAINT pk_tbFeedback PRIMARY KEY (codigo_feedback),
    CONSTRAINT fk_tbAtividadetbFeedback FOREIGN KEY (codigo_atividade) REFERENCES tbAtividade(codigo_atividade)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tbUsuariotbFeedback FOREIGN KEY (matricula_professor) REFERENCES tbUsuario(matricula_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET = utf8mb4;
