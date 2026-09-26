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

package io.github.heberbarra.modelador.domain.model;

import java.util.List;

public class ConfiguracaoSessao {

    private final List<AtributoConfiguracaoSessao<?>> atributos;

    public ConfiguracaoSessao() {
        atributos = List.of();
    }

    public List<AtributoConfiguracaoSessao<?>> getAtributos() {
        return atributos;
    }
}
