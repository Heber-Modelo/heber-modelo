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

package io.github.heberbarra.modelador.domain.injector;

import io.github.heberbarra.modelador.Principal;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.util.Map;
import org.jspecify.annotations.NonNull;
import org.springframework.ui.ModelMap;
import org.tomlj.TomlTable;

public class InjetorAtributos {
    private static final IConfigurador configurador = ConfiguradorFactory.build();

    public static void injetarBindings(@NonNull ModelMap modelMap) {
        TomlTable tabelaBindings = configurador
                .getLeitorConfiguracao()
                .getInformacoesConfiguracoes()
                .getTable("bindings");

        if (tabelaBindings == null) return;

        for (String nomeBindings : tabelaBindings.dottedKeySet()) {
            modelMap.addAttribute(nomeBindings, tabelaBindings.get(nomeBindings));
        }
    }

    public static void injetarPaleta(@NonNull ModelMap modelMap) {
        Map<String, String> variaveisPaleta = configurador.pegarInformacoesPaleta();
        StringBuilder stringBuilder = new StringBuilder(":root{%n".formatted());

        for (String variavel : variaveisPaleta.keySet()) {
            stringBuilder.append(
                    "    --%s: %s;%n".formatted(variavel.replace("_", "-"), variaveisPaleta.get(variavel)));
        }

        stringBuilder.append("  }%n".formatted());
        modelMap.addAttribute("paleta", stringBuilder.toString());
    }

    public static void injetarTituloPagina(@NonNull ModelMap modelMap, @NonNull String nomePagina) {
        String titulo = TradutorWrapper.tradutor.traduzirMensagem("web.page.%s.title".formatted(nomePagina));
        String nomePrograma = Principal.NOME_PROGRAMA.replace("-", " ");
        String sufixo = titulo.isBlank() ? "" : " - " + titulo;

        modelMap.addAttribute("programa", nomePrograma + sufixo);
    }
}
