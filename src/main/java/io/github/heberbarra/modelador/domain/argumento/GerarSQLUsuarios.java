/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import io.github.heberbarra.modelador.application.usecase.gerar.GeradorArquivoSQLUsuarios;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import java.util.List;

public class GerarSQLUsuarios extends Argumento {

    private final GeradorArquivoSQLUsuarios geradorArquivoSQLUsuarios;

    public GerarSQLUsuarios() {
        this.flagsPermitidas = List.of("--gerar-sql-usuarios", "--generate-sql-users");
        this.descricao =
                "Gera um arquivo SQL que contém as instruções de criação dos usuários usados pelo programa. / Generates a SQL file that contains the instructions to create the users used by the program";
        this.geradorArquivoSQLUsuarios = new GeradorArquivoSQLUsuarios();
    }

    @Override
    public void run() {
        geradorArquivoSQLUsuarios.gerarArquivo();
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
