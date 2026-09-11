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

package io.github.heberbarra.modelador.infrastructure.configurador;

import io.github.heberbarra.modelador.Principal;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IPastaConfiguracao;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import java.io.File;
import java.util.logging.Logger;

public class PastaConfiguracao implements IPastaConfiguracao {

    private static final Logger logger = JavaLogger.obterLogger(PastaConfiguracao.class.getName());
    private final String pasta = decidirPastaConfiguracao();
    private final AcessadorRecursos acessadorRecursos;

    public PastaConfiguracao() {
        acessadorRecursos = new AcessadorRecursos();
    }

    public void criarPastaConfiguracao() {
        if (new File(pasta).mkdir()) {
            logger.info(TradutorWrapper.tradutor
                    .traduzirMensagem("file.dir.creation.success")
                    .formatted(pasta));
        }
    }

    public String decidirPastaConfiguracao() {

        if (pasta != null) {
            return pasta;
        }

        String nomeSistema = System.getProperty("os.name").toLowerCase();
        String pastaConfiguracao = acessadorRecursos != null
                ? acessadorRecursos.pegarValorVariavelAmbiente("%s_CONFIG_DIR"
                        .formatted(Principal.NOME_PROGRAMA.toUpperCase().replace("-", "_")))
                : null;
        String xdgConfigHome = System.getenv("XDG_CONFIG_HOME");

        if (pastaConfiguracao != null) {
            if (pastaConfiguracao.startsWith("~")) {
                pastaConfiguracao = pastaConfiguracao.replace("~", System.getProperty("user.home"));
            }

            if (pastaConfiguracao.startsWith("$HOME")) {
                pastaConfiguracao = pastaConfiguracao.replace("$HOME", System.getProperty("user.home"));
            }

            return pastaConfiguracao.endsWith("/") ? pastaConfiguracao : pastaConfiguracao + "/";
        }

        if (xdgConfigHome != null) {
            return "%s/%s/".formatted(xdgConfigHome, Principal.NOME_PROGRAMA);
        }

        if (nomeSistema.contains("windows")) {
            return "%s/%s/".formatted(System.getenv("APPDATA"), Principal.NOME_PROGRAMA);
        }
        if (nomeSistema.contains("mac") || nomeSistema.contains("darwin")) {
            return "%s/Library/Preferences/%s/".formatted(System.getProperty("user.home"), Principal.NOME_PROGRAMA);
        } else {
            return "%s/.config/%s".formatted(System.getProperty("user.home"), Principal.NOME_PROGRAMA);
        }
    }

    @Override
    public String getPasta() {
        return pasta;
    }
}
