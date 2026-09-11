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

package io.github.heberbarra.modelador.domain.exception;

import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(long matricula) {
        super(TradutorWrapper.tradutor
                .traduzirMensagem("error.user.id-notfound")
                .formatted(matricula));
    }
}
