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

package io.github.heberbarra.modelador.application.usecase.gerar;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Logger;

public class GeradorArquivoSQLUsuarios {

    private static final Logger logger = JavaLogger.obterLogger(GeradorArquivoSQLUsuarios.class.getName());
    private static final String MARCADOR_SCRIPT_SQL = "EOSQL";
    private final AcessadorRecursos acessador;

    public GeradorArquivoSQLUsuarios(AcessadorRecursos acessador) {
        this.acessador = acessador;
    }

    public GeradorArquivoSQLUsuarios() {
        this.acessador = new AcessadorRecursos();
    }

    public void gerarArquivo() {
        File arquivoScriptUsuarios = acessador.pegarArquivoRecurso("database/init/02 - CriarUsuarios.sh");
        File arquivoSQLUsuarios = new File("./criarUsuarios.sql");

        try (BufferedReader reader = new BufferedReader(new FileReader(arquivoScriptUsuarios));
                BufferedWriter writer = new BufferedWriter(new FileWriter(arquivoSQLUsuarios))) {
            String linha = reader.readLine();
            while (linha != null) {
                if (linha.contains("<<" + MARCADOR_SCRIPT_SQL)) {
                    linha = reader.readLine();
                    while (!linha.contains(MARCADOR_SCRIPT_SQL)) {
                        writer.append("%s%n".formatted(linha));
                        linha = reader.readLine();
                    }
                } else {
                    linha = reader.readLine();
                }
            }
        } catch (FileNotFoundException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.read")
                    .formatted(arquivoScriptUsuarios.getName(), e.getMessage()));
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create")
                    .formatted(arquivoSQLUsuarios.getName(), e.getMessage()));
        }
    }
}
