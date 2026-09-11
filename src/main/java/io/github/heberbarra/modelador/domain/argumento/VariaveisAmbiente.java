/*
 * Copyright (C) 2025 Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *   https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.domain.argumento;

import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import java.util.List;

public class VariaveisAmbiente extends Argumento {

    public VariaveisAmbiente() {
        this.descricao = "Mostra as variáveis de ambiente requiridas pelo programa, e a explicação de cada uma.";
        this.flagsPermitidas = List.of("--demo-env", "--demo-ambiente");
    }

    @Override
    public void run() {
        System.out.println("MYSQL_HOST\t| Especifica o host para a conexão com o banco de dados.");
        System.out.println("MYSQL_PORT\t| Especifica a porta para a conexão com o banco de dados");
        System.out.println("MYSQL_ROOT\t| A senha do usuário root do banco de dados, utilize uma senha boa e segura.");
        System.out.println(
                "SENHA_PROFESSOR\t| A senha do usuário utilizado pelo professor. Apenas o professor(s) deve ter acesso");
        System.out.println("SENHA_ESTUDANTE\t| A senha do usuário utilizados pelos estudantes.");
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
