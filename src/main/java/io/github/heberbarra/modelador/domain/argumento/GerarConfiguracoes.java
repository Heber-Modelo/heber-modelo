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

package io.github.heberbarra.modelador.domain.argumento;

import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.util.List;

/**
 * Gera os arquivos de configuração do programa
 *
 * @since v0.0.4-SNAPSHOT
 */
public class GerarConfiguracoes extends Argumento {

    public GerarConfiguracoes() {
        super();
        this.descricao = "Cria os arquivos de configuração e encerra o programa";
        this.flagsPermitidas = List.of("--gen-config", "--gerar-config");
    }

    /**
     * Gera todos os arquivos de configuração do programa, logo após encerra o programa
     */
    @Override
    public void run() {
        IConfigurador configurador = ConfiguradorFactory.build();
        configurador.criarArquivos();
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
