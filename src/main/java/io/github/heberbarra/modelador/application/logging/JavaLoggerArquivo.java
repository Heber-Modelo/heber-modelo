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

package io.github.heberbarra.modelador.application.logging;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.logging.FileHandler;

public class JavaLoggerArquivo extends FileHandler {

    protected static String corrigirNomeArquivo(String nomeArquivo) {
        if (!nomeArquivo.startsWith("/")) {
            nomeArquivo = "/" + nomeArquivo;
        }

        if (!nomeArquivo.contains(".")) {
            return nomeArquivo + ".txt";
        }

        return nomeArquivo;
    }

    public JavaLoggerArquivo(File pastaLog, String nomeArquivo) throws IOException {
        this(pastaLog.toString(), nomeArquivo);
    }

    public JavaLoggerArquivo(Path pastaLog, String nomeArquivo) throws IOException {
        this(pastaLog.toString(), nomeArquivo);
    }

    public JavaLoggerArquivo(String pastaLog, String nomeArquivo) throws IOException {
        super(pastaLog + corrigirNomeArquivo(nomeArquivo));
        setFormatter(new JavaLoggerFormatador(true));
        setFilter(new JavaLoggerFiltro());
    }
}
