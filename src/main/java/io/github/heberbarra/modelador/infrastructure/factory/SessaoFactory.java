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
import java.io.IOException;
import java.net.Socket;

public class SessaoFactory {

    private Sessao sessao;

    public Sessao build(Integer porta, String password) {
        if (sessao == null) {
            try {
                IConfigurador configurador = ConfiguradorFactory.build();
                Socket socket = new Socket(
                        configurador
                                .pegarValorConfiguracao("programa", "dominio", String.class)
                                .orElse("localhost"),
                        porta);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return sessao;
    }
}
