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

package io.github.heberbarra.modelador.infrastructure.coletor;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.argumento.Argumento;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;

/**
 * Coleta todas as classes que herdam de {@link Argumento}.
 * <p>
 * Utiliza o anti pattern <b>Singleton</b> para garantir que a classe não consumirá mais memória do que o necessário
 * <p>
 * NOTE: Futuramente adicionado suporte para coleção de classes que herdam de {@link Argumento} criadas por usuários, para prover melhor suporte a plugins
 *
 * @since v0.0.4-SNAPSHOT
 */
public class ColetorClassesArgumentos {

    private static final Logger logger = JavaLogger.obterLogger(ColetorClassesArgumentos.class.getName());
    private static ColetorClassesArgumentos coletorClassesArgumentos;
    private final Set<Class<Argumento>> argumentos;

    private ColetorClassesArgumentos() {
        argumentos = new HashSet<>();
    }

    public static synchronized ColetorClassesArgumentos getInstance() {
        if (coletorClassesArgumentos == null) {
            coletorClassesArgumentos = new ColetorClassesArgumentos();
        }

        return coletorClassesArgumentos;
    }

    /**
     * Escaneia o pacote argumento e coleta todas as classes que herdam de {@link Argumento} e salva elas num {@code Set} para evitar duplicatas
     */
    @SuppressWarnings("unchecked")
    public void coletarArgumentos() {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AssignableTypeFilter(Argumento.class));
        Set<BeanDefinition> beansArgumentos =
                scanner.findCandidateComponents("io.github.heberbarra.modelador.domain.argumento");

        for (BeanDefinition beanDefinition : beansArgumentos) {
            try {
                argumentos.add((Class<Argumento>) Class.forName(beanDefinition.getBeanClassName()));
            } catch (ClassNotFoundException e) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.class.notfound")
                        .formatted(beanDefinition.getBeanClassName()));
            }
        }
    }

    public Set<Class<Argumento>> getArgumentos() {
        return argumentos;
    }
}
