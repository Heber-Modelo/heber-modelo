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

package io.github.heberbarra.modelador.test.infrastructure.coletor;

import io.github.heberbarra.modelador.domain.codigo.DadosCodigoSaida;
import io.github.heberbarra.modelador.infrastructure.coletor.ColetorCodigosSaida;
import java.util.Set;
import org.junit.jupiter.api.Test;

public class TestColetorCodigosSaida {

    @Test
    public void testColetorColetaCodigos() {
        ColetorCodigosSaida coletorCodigosSaida = new ColetorCodigosSaida();
        coletorCodigosSaida.coletarCodigosEnum();
        Set<DadosCodigoSaida> dadosCodigoSaida = coletorCodigosSaida.getDadosCodigosSaida();
        assert !dadosCodigoSaida.isEmpty();
    }
}
