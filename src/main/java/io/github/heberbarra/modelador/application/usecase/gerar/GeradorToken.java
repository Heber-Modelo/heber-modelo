/*
 * Copyright (C) 2025 Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *  https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.application.usecase.gerar;

import io.github.heberbarra.modelador.application.usecase.hash.CalculadorHash;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

public class GeradorToken {

    private String token;
    private final CalculadorHash calculadorHash;

    public GeradorToken() {
        calculadorHash = new CalculadorHash();
    }

    public void gerarToken() {
        String dataAtual = LocalDateTime.now().toString();
        token = calculadorHash.calcularHash512(dataAtual.getBytes(StandardCharsets.UTF_8));
        token = token.toUpperCase();
    }

    public String getToken() {
        return token;
    }
}
