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

package io.github.heberbarra.modelador.infrastructure.controller;

import static io.github.heberbarra.modelador.infrastructure.acessador.AcessadorSegundosTimeoutTeste.ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER;

import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessaoEstudante;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorRestSessao {

    @RequestMapping("/tempoLimiteSegundosTimeout")
    public Long requisitarTempoLimiteSegundosTimeout() {
        if (ControladorSessao.getRoteador() instanceof RoteadorSessaoEstudante roteadorSessaoEstudante) {
            RoteadorSessaoEstudante.setDados("");
            RoteadorSessaoEstudante.setHeaderDados(ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER);

            while (roteadorSessaoEstudante.getSegundosTimeout() == null) {
                try {
                    //noinspection BusyWait
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }

            return roteadorSessaoEstudante.getSegundosTimeout();
        } else {
            return 0L;
        }
    }
}
