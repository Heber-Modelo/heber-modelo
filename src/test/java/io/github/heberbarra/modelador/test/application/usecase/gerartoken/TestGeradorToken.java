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

package io.github.heberbarra.modelador.test.application.usecase.gerartoken;

import io.github.heberbarra.modelador.application.usecase.gerar.GeradorToken;
import org.junit.jupiter.api.Test;

public class TestGeradorToken {

    @Test
    public void testGeradorTokenGetToken() {
        GeradorToken geradorToken = new GeradorToken();
        geradorToken.gerarToken();

        String primeiroToken = geradorToken.getToken();
        String segundoToken = geradorToken.getToken();

        //noinspection ConstantValue
        assert primeiroToken.equals(segundoToken);
    }

    @Test
    public void testGeradorTokenGeraTokensDiferentes() {
        GeradorToken geradorToken = new GeradorToken();

        geradorToken.gerarToken();
        String primeiroToken = geradorToken.getToken();

        geradorToken.gerarToken();
        String segundoToken = geradorToken.getToken();

        assert !primeiroToken.equals(segundoToken);
    }
}
