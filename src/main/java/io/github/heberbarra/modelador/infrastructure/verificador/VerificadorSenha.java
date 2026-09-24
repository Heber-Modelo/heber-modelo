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

package io.github.heberbarra.modelador.infrastructure.verificador;

import java.util.Objects;

public class VerificadorSenha {
    public static final String VERIFICADOR_SENHA_HEADER = "VERIFICAR-SENHA";
    private final String senha;

    public VerificadorSenha(String senha) {
        this.senha = senha;
    }

    public boolean verificar(String senha) {
        return Objects.equals(this.senha, senha);
    }
}
