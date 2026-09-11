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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.LinkedHashMap;
import java.util.Map;

@JsonPropertyOrder({"categoria", "atributo", "tipo", "valorPadrao"})
public class AtributoJsonConfiguracao extends AtributoJSON {

    private String categoria;
    private String atributo;
    private String tipo;
    private String valorPadrao;

    @Override
    public Map<String, String> converterParaMap() {
        Map<String, String> informacoesAtributo = new LinkedHashMap<>();

        informacoesAtributo.put("categoria", categoria);
        informacoesAtributo.put("atributo", atributo);
        informacoesAtributo.put("tipo", tipo);
        informacoesAtributo.put("valorPadrao", valorPadrao);

        return informacoesAtributo;
    }

    @Override
    public String toString() {
        String indentacaoAtributos = " ".repeat(indentacao * nivelIndentacao);
        String indentacaoChaves = " ".repeat(indentacao * (nivelIndentacao - 1));

        return ("%s{%n".formatted(indentacaoChaves) + "%s\"categoria\": \"%s\",%n")
                        .formatted(indentacaoAtributos, categoria)
                + "%s\"atributo\": \"%s\",%n".formatted(indentacaoAtributos, atributo)
                + "%s\"tipo\": \"%s\",%n".formatted(indentacaoAtributos, tipo)
                + "%s\"valorPadrao\": %s%n".formatted(indentacaoAtributos, pegarStringFormatadaValorPadrao())
                + "%s}".formatted(indentacaoChaves);
    }

    public String pegarStringFormatadaValorPadrao() {
        if (tipo.equals("String")) {
            return "\"%s\"".formatted(valorPadrao);
        }

        return valorPadrao;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getAtributo() {
        return atributo;
    }

    public String getTipo() {
        return tipo;
    }

    public String getValorPadrao() {
        return valorPadrao;
    }
}
