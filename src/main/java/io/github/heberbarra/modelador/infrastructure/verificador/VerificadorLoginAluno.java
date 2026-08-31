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

package io.github.heberbarra.modelador.infrastructure.verificador;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class VerificadorLoginAluno implements Runnable {

    private final int porta;

    public VerificadorLoginAluno(int porta) {
        this.porta = porta;
    }

    @Override
    public void run() {

        try (ServerSocket serverSocket = new ServerSocket(porta)) {
            while (true) {
                Socket socket = serverSocket.accept();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));String mensagem = bufferedReader.readLine();

                if ("Senha Incorreta".equals(mensagem)) {
                    socket.close();
                    continue;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
