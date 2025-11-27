/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.infrastructure.configurador;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.LeitorAbstratoArquivoVerificador;
import io.github.heberbarra.modelador.domain.verificador.VerificadorAbstratoJSONAtributo;
import java.io.File;
import java.util.logging.Logger;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * Responsável por ler e salvar os dados de um modelo de configuração
 *
 * @since v0.0.2-SNAPSHOT
 */
public class LeitorArquivoVerificacaoPadrao<T extends VerificadorAbstratoJSONAtributo<?>>
        extends LeitorAbstratoArquivoVerificador<T> {

    private static final Logger logger = JavaLogger.obterLogger(LeitorArquivoVerificacaoPadrao.class.getName());

    public LeitorArquivoVerificacaoPadrao(Class<T> tipoVerificador, File arquivoVerificador) {
        super(tipoVerificador, arquivoVerificador);
    }

    @Override
    public void lerArquivo() {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            informacoesJSON = objectMapper.readValue(arquivoVerificador, tipoVerificador);
        } catch (JacksonException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.read.template")
                    .formatted(arquivoVerificador));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
        }
    }
}
