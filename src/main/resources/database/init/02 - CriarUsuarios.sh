#!/bin/bash
set -e

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<EOSQL
CREATE USER IF NOT EXISTS 'estudante'@'%' IDENTIFIED BY '$SENHA_ESTUDANTE';
GRANT INSERT, SELECT ON db_HeberModelo.tb_atividade TO 'estudante'@'%';
GRANT INSERT, SELECT ON db_HeberModelo.tb_usuario TO 'estudante'@'%';
GRANT SELECT ON db_HeberModelo.tb_feedback TO 'estudante'@'%';

CREATE USER IF NOT EXISTS 'estudante'@localhost IDENTIFIED BY '$SENHA_ESTUDANTE';
GRANT INSERT, SELECT ON db_HeberModelo.tb_atividade TO 'estudante'@localhost;
GRANT INSERT, SELECT ON db_HeberModelo.tb_usuario TO 'estudante'@localhost;
GRANT SELECT ON db_HeberModelo.tb_feedback TO 'estudante'@localhost;

CREATE USER IF NOT EXISTS 'professor'@'%' IDENTIFIED BY '$SENHA_PROFESSOR';
GRANT INSERT, SELECT, UPDATE, DELETE ON db_HeberModelo.* TO 'professor'@'%';

CREATE USER IF NOT EXISTS 'professor'@localhost IDENTIFIED BY '$SENHA_PROFESSOR';
GRANT INSERT, SELECT, UPDATE, DELETE ON db_HeberModelo.* TO 'professor'@localhost;

FLUSH PRIVILEGES;
EOSQL
