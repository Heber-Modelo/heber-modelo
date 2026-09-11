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

import io.github.heberbarra.modelador.application.usecase.imprimir.ImpressorCodigosSaida;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.infrastructure.coletor.ColetorCodigosSaida;
import java.util.List;

public class ImprimirCodigosSaida extends Argumento {

    public ImprimirCodigosSaida() {
        this.descricao = "Imprimi no stdout o nome e o número de cada código de saída";
        this.flagsPermitidas = List.of("--imprimir-codigos-saida", "--print-exit-codes");
    }

    @Override
    public void run() {
        ColetorCodigosSaida coletorCodigosSaida = new ColetorCodigosSaida();
        ImpressorCodigosSaida impressorCodigosSaida = new ImpressorCodigosSaida(coletorCodigosSaida);
        impressorCodigosSaida.imprimirCodigos();
        System.exit(CodigoSaida.OK.getCodigo());
    }
}
