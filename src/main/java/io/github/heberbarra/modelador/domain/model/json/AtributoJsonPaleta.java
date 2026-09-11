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

package io.github.heberbarra.modelador.domain.model.json;

import java.util.LinkedHashMap;
import java.util.Map;

public class AtributoJsonPaleta extends AtributoJSON {

    private String nomeVariavel;
    private String valorPadraoVariavel;

    @Override
    public Map<String, String> converterParaMap() {
        Map<String, String> informacoesAtributo = new LinkedHashMap<>();

        informacoesAtributo.put("nomeVariavel", nomeVariavel);
        informacoesAtributo.put("valorPadraoVariavel", valorPadraoVariavel);

        return informacoesAtributo;
    }

    @Override
    public String toString() {
        String indentacaoAtributos = " ".repeat(indentacao * nivelIndentacao);
        String indentacaoChaves = " ".repeat(indentacao * (nivelIndentacao - 1));

        return ("%s{%n".formatted(indentacaoChaves)
                + "%s\"nomeVariavel\": \"%s\",%n".formatted(indentacaoAtributos, nomeVariavel)
                + "%s\"valorPadraoVariavel\": \"%s\"%n".formatted(indentacaoAtributos, valorPadraoVariavel)
                + "%s}".formatted(indentacaoChaves));
    }

    public String getNomeVariavel() {
        return nomeVariavel;
    }

    public String getValorPadraoVariavel() {
        return valorPadraoVariavel;
    }
}
