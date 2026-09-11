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

package io.github.heberbarra.modelador.application.tradutor;

import io.github.heberbarra.modelador.Principal;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

class TradutorFactory {

    private final ApplicationContext applicationContext;

    public TradutorFactory() {
        applicationContext = new AnnotationConfigApplicationContext(Principal.class);
    }

    public Tradutor criarObjeto() {
        return applicationContext.getBean(Tradutor.class);
    }
}
