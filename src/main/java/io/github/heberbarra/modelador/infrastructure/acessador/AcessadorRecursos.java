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

package io.github.heberbarra.modelador.infrastructure.acessador;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvBuilder;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.infrastructure.configurador.PastaConfiguracao;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.logging.Logger;

public class AcessadorRecursos implements IAcessadorRecurso {

    private static final Logger logger = JavaLogger.obterLogger(AcessadorRecursos.class.getName());
    private Dotenv dotenv;

    @Override
    public InputStream pegarRecurso(String caminhoRecurso) {
        ClassLoader classLoader = AcessadorRecursos.class.getClassLoader();
        InputStream recurso = classLoader.getResourceAsStream(caminhoRecurso);

        if (recurso == null) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.resource.read")
                    .formatted(caminhoRecurso));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("error.resource.notfound"));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.RECURSO_NAO_ENCONTRADO.getCodigo());
        }

        return recurso;
    }

    @Override
    public File pegarArquivoRecurso(String caminhoRecurso) {
        StringBuilder nomeArquivo = new StringBuilder();
        String[] partesArquivo = caminhoRecurso.split("\\.");
        String extensaoArquivo = "";
        File arquivoRecurso = null;

        for (int i = 0; i < partesArquivo.length; i++) {
            if (i == partesArquivo.length - 1) {
                extensaoArquivo = partesArquivo[i];
            }

            nomeArquivo.append(partesArquivo[i]);
        }

        try (InputStream recursoStream = pegarRecurso(caminhoRecurso)) {
            arquivoRecurso = File.createTempFile(nomeArquivo.toString(), extensaoArquivo);
            arquivoRecurso.deleteOnExit();
            Files.copy(recursoStream, arquivoRecurso.toPath(), StandardCopyOption.REPLACE_EXISTING);

            return arquivoRecurso;
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create.temp")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_ARQUIVO_TEMP.getCodigo());
        }

        return arquivoRecurso;
    }

    @Override
    public Path pegarCaminhoRecurso(String caminhoRecurso) {
        return pegarArquivoRecurso(caminhoRecurso).toPath();
    }

    @Override
    public String pegarValorVariavelAmbiente(String nomeVariavel) {
        if (dotenv == null) {
            PastaConfiguracao pastaConfiguracao = new PastaConfiguracao();
            DotenvBuilder dotenvBuilder = new DotenvBuilder();
            dotenvBuilder.directory(pastaConfiguracao.getPasta());
            dotenv = dotenvBuilder.load();
        }

        return dotenv.get(nomeVariavel);
    }
}
