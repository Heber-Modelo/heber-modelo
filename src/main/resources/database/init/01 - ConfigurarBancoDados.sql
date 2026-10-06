CREATE DATABASE IF NOT EXISTS db_HeberModelo DEFAULT CHARACTER SET = utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE db_HeberModelo;

CREATE TABLE IF NOT EXISTS `tb_usuario` (
    matricula_usuario VARCHAR(20),
    email_usuario VARCHAR(50) NOT NULL,
    nome_usuario VARCHAR(50) NOT NULL,
    senha_usuario TEXT NOT NULL,
    tipo_usuario CHARACTER(1) DEFAULT 'E',
    CONSTRAINT un_Emailtb_usuario UNIQUE (email_usuario),
    CONSTRAINT un_Nometb_usuario UNIQUE (nome_usuario),
    CONSTRAINT ck_Tipotb_usuario CHECK (tipo_usuario IN ('E', 'P')),
    CONSTRAINT pk_tb_usuario PRIMARY KEY (matricula_usuario)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `tb_atividade` (
    codigo_atividade INT AUTO_INCREMENT,
    nome_atividade VARCHAR(100) NOT NULL,
    descricao_atividade TEXT NOT NULL,
    is_prova_atividade BOOL NOT NULL,
    data_postagem_atividade DATETIME NOT NULL,
    data_limite_atividade DATETIME NOT NULL,
    CONSTRAINT pk_tb_atividade PRIMARY KEY (codigo_atividade)
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `tb_feedback` (
    codigo_feedback INT AUTO_INCREMENT,
    data_criacao DATETIME NOT NULL,
    descricao_feedback TEXT,
    codigo_atividade INT,
    imagem_atividade LONGTEXT,
    matricula_professor VARCHAR(20),
    matricula_estudante VARCHAR(20),
    CONSTRAINT pk_tb_feedback PRIMARY KEY (codigo_feedback),
    CONSTRAINT fk_tb_atividadetb_feedback FOREIGN KEY (codigo_atividade) REFERENCES tb_atividade(codigo_atividade)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tb_usuariotb_feedback_matricula_professor FOREIGN KEY (matricula_professor) REFERENCES tb_usuario(matricula_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tb_usuariotb_feedback_matricula_estudante FOREIGN KEY (matricula_estudante) REFERENCES tb_usuario(matricula_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET = utf8mb4;
