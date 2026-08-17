/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.model.Sessao;
import jakarta.annotation.Nullable;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class SessaoFactory {

    private static Sessao sessao;

    public static Sessao build(Integer porta, @Nullable String ip, String password) {
        if (sessao == null) {
            try {
                Socket socket;
                if (ip != null) {
                    IConfigurador configurador = ConfiguradorFactory.build();
                    socket = new Socket(ip, porta);


                } else {
                    ServerSocket serverSocket = new ServerSocket(porta);
                    socket = serverSocket.accept();
                }

                sessao = new Sessao(socket);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return sessao;
    }
}
