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

package io.github.heberbarra.modelador.infrastructure.conversor;

import java.util.List;
import java.util.Map;

/**
 * Converte uma entrada dados para uma string de tabela TOML
 *
 * @since v0.0.1-SNAPSHOT
 */
public class ConversorTomlPrograma implements IConversorTOMLString {

    public static int INDENTACAO = 2;

    @Override
    public String converterMapPaletaParaStringTOML(Map<String, List<Map<String, String>>> dados) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("[paleta]\n");

        for (Map<String, String> variavelPaleta : dados.get("paleta")) {
            stringBuilder.append("%s%s=".formatted(" ".repeat(INDENTACAO), variavelPaleta.get("nomeVariavel")));
            stringBuilder.append("\"%s\"%n".formatted(variavelPaleta.get("valorPadraoVariavel")));
        }

        return stringBuilder.toString();
    }

    @Override
    public String converterMapConfiguracaoParaStringTOML(Map<String, List<Map<String, String>>> dados) {
        StringBuilder stringBuilder = new StringBuilder();

        for (String categoria : dados.keySet()) {
            stringBuilder.append("[%s]%n".formatted(categoria));

            for (Map<String, String> informacoesAtributo : dados.get(categoria)) {
                stringBuilder.append("%s%s=".formatted(" ".repeat(INDENTACAO), informacoesAtributo.get("atributo")));

                if (informacoesAtributo.get("tipo").equals("String")) {
                    stringBuilder.append("\"%s\"%n".formatted(informacoesAtributo.get("valorPadrao")));
                    continue;
                }

                stringBuilder.append("%s%n".formatted(informacoesAtributo.get("valorPadrao")));
            }
        }

        return stringBuilder.toString();
    }
}
