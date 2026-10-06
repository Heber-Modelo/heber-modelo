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

package io.github.heberbarra.modelador.infrastructure.acessador;

import io.github.heberbarra.modelador.domain.model.ConfiguracaoSessao;

public class AcessadorSegundosTimeoutTeste {
    public static final String ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER = "ACESSADOR-SEGUNDOS-TIMEOUT";
    private final ConfiguracaoSessao configuracaoSessao;

    public AcessadorSegundosTimeoutTeste(ConfiguracaoSessao configuracaoSessao) {
        this.configuracaoSessao = configuracaoSessao;
    }

    public long getSegundosTimeout() {
        return configuracaoSessao.getSecondsTimeout();
    }
}
