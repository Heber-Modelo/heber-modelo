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

package io.github.heberbarra.modelador.application.usecase.executar;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.argumento.Argumento;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.infrastructure.coletor.ColetorClassesArgumentos;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Executa funções conforme os argumentos passados pela linha de comando.
 * <p>
 * Cada flag é executada em sequência e pode ser executada apenas uma vez, a menos que encerre o programa.
 * Para evitar repetições as flags que já foram executas são salvas num cache.
 *
 * @since v0.0.4-SNAPSHOT
 */
public class ExecutadorArgumentos {

    private static final Logger logger = JavaLogger.obterLogger(ExecutadorArgumentos.class.getName());
    private final ColetorClassesArgumentos coletorClassesArgumentos;
    private final String[] args;
    private final Set<String> cacheArgumentos;
    private final List<String> flagsIgnoradas;

    public ExecutadorArgumentos(String[] args) {
        coletorClassesArgumentos = ColetorClassesArgumentos.getInstance();
        cacheArgumentos = new HashSet<>();
        this.args = args;
        flagsIgnoradas = List.of("--spring.profiles.active=local", "--language-english");
    }

    /**
     * Executa as flags passadas de forma sequencial
     */
    public void executarFlags() {
        coletorClassesArgumentos.coletarArgumentos();

        for (String argumento : args) {
            executarFlagArgumento(argumento);
        }
    }

    /**
     * Tenta executar a lógica associada a flag passada, caso ocorra algum erro é gerado um log informando o erro,
     * caso o erro seja grave o programa será encerrado com um dos seguintes códigos de saída:
     * {@link CodigoSaida#ERRO_PEGAR_CONSTRUTOR}, {@link CodigoSaida#ERRO_CRIACAO_OBJETO}, {@link CodigoSaida#ACESSO_NEGADO}
     * <p>
     * Caso uma flag seja passada duas ou mais vezes, a lógica associada será executada apenas uma vez
     *
     * @param flagArgumento a flag a ser executada
     */
    private void executarFlagArgumento(String flagArgumento) {
        if (cacheArgumentos.contains(flagArgumento)) return;

        cacheArgumentos.add(flagArgumento);
        if (flagsIgnoradas.contains(flagArgumento)) return;
        Set<Class<Argumento>> argumentos = coletorClassesArgumentos.getArgumentos();
        for (Class<Argumento> argumentoClass : argumentos) {
            Argumento argumento;
            try {
                Constructor<Argumento> argumentoConstructor = argumentoClass.getConstructor();
                argumento = argumentoConstructor.newInstance();
            } catch (NoSuchMethodException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.get.constructor")
                        .formatted(argumentoClass.getSimpleName(), e.getMessage()));
                logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
                System.exit(CodigoSaida.ERRO_PEGAR_CONSTRUTOR.getCodigo());
                return;
            } catch (InvocationTargetException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.create.object")
                        .formatted(argumentoClass.getSimpleName(), e.getMessage()));
                logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
                System.exit(CodigoSaida.ERRO_CRIACAO_OBJETO.getCodigo());
                return;
            } catch (InstantiationException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.create.object")
                        .formatted(argumentoClass.getSimpleName()));
                logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
                System.exit(CodigoSaida.ERRO_CRIACAO_OBJETO.getCodigo());
                return;
            } catch (IllegalAccessException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.access.denied.constructor")
                        .formatted(argumentoClass.getSimpleName(), e.getMessage()));
                logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
                System.exit(CodigoSaida.ACESSO_NEGADO.getCodigo());
                return;
            }

            if (argumento.contemFlag(flagArgumento)) {
                argumento.run();
                return;
            }
        }

        logger.warning(
                TradutorWrapper.tradutor.traduzirMensagem("error.flag.unknown").formatted(flagArgumento));
    }
}
