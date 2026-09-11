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

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Formatter;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import org.jline.jansi.Ansi;

public class JavaLoggerFormatador extends Formatter {

    private static final Map<String, Ansi.Color> CORES_LEVELS = new HashMap<>();
    private boolean desativarCores;

    public JavaLoggerFormatador() {
        this(false);
    }

    static {
        CORES_LEVELS.put(Level.SEVERE.getName(), Ansi.Color.RED);
        CORES_LEVELS.put(Level.WARNING.getName(), Ansi.Color.YELLOW);
        CORES_LEVELS.put(Level.INFO.getName(), Ansi.Color.CYAN);
    }

    public JavaLoggerFormatador(boolean desativarCores) {
        this.desativarCores = desativarCores;
    }

    public String formatarNomeLevel(String nomeLevel) {
        if (!CORES_LEVELS.containsKey(nomeLevel)) {
            return nomeLevel;
        }

        return Ansi.ansi().fg(CORES_LEVELS.get(nomeLevel)).a(nomeLevel).reset().toString();
    }

    @Override
    public String format(LogRecord record) {
        String nomeLevel = record.getLevel().toString();

        if (!desativarCores) {
            nomeLevel = formatarNomeLevel(nomeLevel);
        }

        return "[%s] (%s) - %s::%s %n%s%n"
                .formatted(
                        nomeLevel,
                        new Date(record.getMillis()),
                        record.getSourceClassName(),
                        record.getSourceMethodName(),
                        record.getMessage());
    }

    public boolean isDesativarCores() {
        return desativarCores;
    }

    public void setDesativarCores(boolean desativarCores) {
        this.desativarCores = desativarCores;
    }
}
