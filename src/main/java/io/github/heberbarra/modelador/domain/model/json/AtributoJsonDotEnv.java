/*
 * Copyright (C) 2026 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.LinkedHashMap;
import java.util.Map;

@JsonPropertyOrder({"nome", "valorPadro", "tipo"})
public class AtributoJsonDotEnv extends AtributoJSON {

    private String nome;
    private String valorPadrao;
    private String tipo;

    @Override
    public Map<String, String> converterParaMap() {
        Map<String, String> informacoesVariavelDotEnv = new LinkedHashMap<>();

        informacoesVariavelDotEnv.put("nome", nome);
        informacoesVariavelDotEnv.put("valorPadrao", valorPadrao);
        informacoesVariavelDotEnv.put("tipo", tipo);

        return informacoesVariavelDotEnv;
    }

    @Override
    public String toString() {
        String indentacaoAtributos = " ".repeat(indentacao * nivelIndentacao);
        String indentacaoChaves = " ".repeat(indentacao * (nivelIndentacao - 1));

        return ("%s{%n".formatted(indentacaoChaves)
                + "%s\"nomeVariavel\": \"%s\",%n".formatted(indentacaoAtributos, nome)
                + "%s\"valorPadraoVariavel\": \"%s\"%n".formatted(indentacaoAtributos, valorPadrao)
                + "%s}".formatted(indentacaoChaves));
    }

    public String getNome() {
        return nome;
    }

    public String getValorPadrao() {
        return valorPadrao;
    }

    public String getTipo() {
        return tipo;
    }
}
