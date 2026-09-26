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
import io.github.heberbarra.modelador.domain.model.ConfiguracaoSessao;
import io.github.heberbarra.modelador.domain.model.Sessao;
import jakarta.annotation.Nullable;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.logging.Logger;

public class SessaoFactory {
    private static final Logger logger = JavaLogger.obterLogger(SessaoFactory.class.getName());
    private static final Object SYNCHRONIZER = new Object();
    private static volatile Sessao sessao = null;

    public static Sessao build(Integer porta, @Nullable String ip) {
        if (sessao == null) {
            synchronized (SYNCHRONIZER) {
                try {
                    Socket socket;
                    if (ip != null) {
                        socket = new Socket(ip, porta);
                        logger.info(TradutorWrapper.tradutor
                                .traduzirMensagem("session.create.success")
                                .formatted(porta));
                    } else {
                        @SuppressWarnings("resource")
                        ServerSocket serverSocket = new ServerSocket(porta);
                        socket = serverSocket.accept();
                    }

                    sessao = new Sessao(new ConfiguracaoSessao(), socket);
                } catch (IOException e) {
                    logger.warning(TradutorWrapper.tradutor
                            .traduzirMensagem("error.session.create.failure")
                            .formatted(e.getMessage()));
                }
            }
        }

        return sessao;
    }

    public static void closeSocket() {
        if (sessao != null) {
            try {
                sessao.socket().close();
                sessao = null;
            } catch (IOException e) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.session.terminate")
                        .formatted(e.getMessage()));
            }
        }
    }

    public static Sessao getSessao() {
        return sessao;
    }
}
