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

import io.github.heberbarra.modelador.Principal;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import java.util.List;
import java.util.logging.Logger;

/**
 * Mostra a versão do programa
 *
 * @since v0.0.4-SNAPSHOT
 */
public class MostrarVersao extends Argumento {

    private static final Logger logger = JavaLogger.obterLogger(MostrarVersao.class.getName());

    public MostrarVersao() {
        super();
        this.descricao = "Mostra a versão do programa";
        this.flagsPermitidas = List.of("-v", "--version", "--versao");
    }

    /**
     * Mostra a versão atual do programa no {@code stdin}, caso não seja possível pegar a versão do programa,
     * encerra o programa com o código apropriado.
     * <p>
     * Encerra o programa após mostrar a versão
     *
     * @see CodigoSaida
     */
    @Override
    public void run() {
        String versao = Principal.class.getPackage().getImplementationVersion();

        if (versao == null) {
            logger.info(TradutorWrapper.tradutor.traduzirMensagem("error.flag.get.version"));
            System.exit(CodigoSaida.ERRO_PEGAR_VERSAO.getCodigo());
        }

        System.out.println(versao);
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
