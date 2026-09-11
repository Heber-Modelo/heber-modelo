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

import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import java.io.File;
import java.io.IOException;
import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Logger;

public class JavaLogger {

    private static final Logger logger = Logger.getLogger(JavaLogger.class.getName());
    private static String nomeArquivo = "log.txt";
    private static File pastaLogs = new SelecionadorPastaLogs().getPastaLogs();
    protected static ConsoleHandler consoleHandler = criarConsoleHandler();
    protected static FileHandler fileHandler = criarFileHandler(nomeArquivo);

    static {
        /*
         * TÖRÖK, Péter. How can I disable the default console handler, while using the java logging API?
         * Postado em: 28 mar. 2010 [site]. Disponível em: <https://stackoverflow.com/questions/2533227>.
         * Acesso em: 17 maio 2024.
         */
        Logger loggerGlobal = Logger.getLogger("");
        Handler[] handlers = loggerGlobal.getHandlers();
        for (Handler handler : handlers) {
            loggerGlobal.removeHandler(handler);
        }
    }

    public static String getNomeArquivo() {
        return nomeArquivo;
    }

    public static void setNomeArquivo(String nomeArquivo) {
        JavaLogger.nomeArquivo = nomeArquivo;
    }

    public static File getPastaLogs() {
        return pastaLogs;
    }

    public static void setPastaLogs(File pastaLogs) {
        JavaLogger.pastaLogs = pastaLogs;
    }

    public static Logger obterLogger(String nome) {
        Logger logger = Logger.getLogger(nome);

        logger.addHandler(consoleHandler);
        logger.addHandler(fileHandler);

        return logger;
    }

    protected static ConsoleHandler criarConsoleHandler() {
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setFormatter(new JavaLoggerFormatador());
        consoleHandler.setFilter(new JavaLoggerFiltro());

        return consoleHandler;
    }

    protected static FileHandler criarFileHandler(String nomeArquivo) {
        try {
            logger.finest(String.valueOf(pastaLogs.mkdirs()));
            return new JavaLoggerArquivo(pastaLogs, nomeArquivo);
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.logger.create")
                    .formatted(e.getMessage()));
            return null;
        }
    }

    public static ConsoleHandler getConsoleHandler() {
        return consoleHandler;
    }
}
