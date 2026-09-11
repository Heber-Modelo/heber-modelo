/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import java.util.List;
import java.util.Locale;

/**
 * Seleciona a linguagem que o programa deve usar.
 *
 * @since v0.0.24-SNAPSHOT
 * */
public class SelecionarLinguagem extends Argumento {

    public SelecionarLinguagem() {
        super();
        this.descricao = "Muda a linguagem do programa para Inglês";
        this.flagsPermitidas = List.of("--language=english");
    }

    @Override
    public void run() {
        Locale.setDefault(Locale.ENGLISH);
    }
}
