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

import io.github.heberbarra.modelador.Principal;
import java.io.File;

public class SelecionadorPastaLogs {

    private final File pastaLogs = decidirPasta();

    public File decidirPasta() {
        String nomeSistema = System.getProperty("os.name").toLowerCase();

        if (nomeSistema.contains("windows")) {
            return new File("%s/%s/logs/".formatted(System.getenv("APPDATA"), Principal.NOME_PROGRAMA));
        }

        if (nomeSistema.contains("mac")) {
            return new File("%s/Library/Logs/%s".formatted(System.getProperty("user.home"), Principal.NOME_PROGRAMA));
        }

        return new File("%s/.local/share/%s/logs/".formatted(System.getProperty("user.home"), Principal.NOME_PROGRAMA));
    }

    public File getPastaLogs() {
        return pastaLogs;
    }
}
