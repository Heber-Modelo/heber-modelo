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

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.infrastructure.coletor.ColetorClassesArgumentos;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import org.jline.jansi.Ansi;

/**
 * Mostra as flags disponíveis no programa junto de suas respectivas descrições.
 *
 * @since v0.0.9-SNAPSHOT
 */
public class MostrarAjuda extends Argumento {

    private static final Logger logger = JavaLogger.obterLogger(MostrarAjuda.class.getName());
    private final ColetorClassesArgumentos coletorClassesArgumentos;

    public MostrarAjuda() {
        coletorClassesArgumentos = ColetorClassesArgumentos.getInstance();
        this.descricao = "Mostra os comandos/flags disponíveis e as suas descrições.";
        this.flagsPermitidas = List.of("--ajuda", "--help", "-h");
    }

    /**
     * Exibe no {@code stdout} todas as flags do programa, junto dos valores permitidos e suas descrições.
     * Após isso encerra o programa
     */
    @Override
    public void run() {
        Set<Class<Argumento>> argumentos = coletorClassesArgumentos.getArgumentos();

        for (Class<Argumento> classeArgumento : argumentos) {
            try {
                Constructor<Argumento> construtorArgumento = classeArgumento.getConstructor();
                Argumento argumento = construtorArgumento.newInstance();
                imprimirInfo(argumento);
            } catch (NoSuchMethodException e) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.get.constructor")
                        .formatted(classeArgumento.getName(), e.getMessage()));
                System.exit(CodigoSaida.ERRO_PEGAR_CONSTRUTOR.getCodigo());
            } catch (IllegalAccessException | InvocationTargetException | InstantiationException e) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.flag.create.object")
                        .formatted(classeArgumento.getName(), e.getMessage()));
                System.exit(CodigoSaida.ERRO_CRIACAO_OBJETO.getCodigo());
            }
        }

        System.exit(CodigoSaida.OK.getCodigo());
    }

    private void imprimirInfo(Argumento argumento) {
        String nomeArgumento = argumento.getClass().getSimpleName();
        System.out.println(
                Ansi.ansi().a("[").fg(Ansi.Color.CYAN).a(nomeArgumento).reset().a("]"));
        System.out.println(String.join(" ", argumento.getFlagsPermitidas()));
        System.out.println(argumento.getDescricao());
        System.out.println();
    }
}
