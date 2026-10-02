/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *    https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.infrastructure.factory;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import java.io.IOException;
import java.net.Socket;
import java.util.logging.Logger;

public class SessaoFactory {
    private static final Logger logger = JavaLogger.obterLogger(SessaoFactory.class.getName());
    private static final Object SYNCHRONIZER = new Object();
    private static volatile Socket socket = null;

    public static Socket build(Integer porta, String ip) {
        if (socket == null) {
            synchronized (SYNCHRONIZER) {
                if (socket == null) {
                    try {
                        socket = new Socket(ip, porta);
                        logger.info(TradutorWrapper.tradutor
                                .traduzirMensagem("session.create.success")
                                .formatted(porta));
                    } catch (IOException e) {
                        logger.warning(TradutorWrapper.tradutor
                                .traduzirMensagem("error.session.create.failure")
                                .formatted(e.getMessage()));
                    }
                }
            }
        }

        return socket;
    }

    public static synchronized void reiniciarFactory() {
        socket = null;
    }

    public static void closeSocket() {
        if (socket != null) {
            try {
                socket.close();
                socket = null;
            } catch (IOException e) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.session.terminate")
                        .formatted(e.getMessage()));
            }
        }
    }
}
