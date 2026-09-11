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

package io.github.heberbarra.modelador.test.infrastructure.configuracao;

import io.github.heberbarra.modelador.infrastructure.configurador.CombinadorConfiguracoes;
import io.github.heberbarra.modelador.infrastructure.conversor.ConversorTomlPrograma;
import io.github.heberbarra.modelador.infrastructure.conversor.IConversorTOMLString;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.tomlj.Toml;
import org.tomlj.TomlTable;

public class TestCombinadorConfiguracoes {

    @Test
    protected void testCombinarConfiguracoes() {
        CombinadorConfiguracoes combinadorConfiguracoes = new CombinadorConfiguracoes();
        IConversorTOMLString conversorToml = new ConversorTomlPrograma();
        String nomeAtributo = "atributo";
        String nomeValor = "valorPadrao";
        String chaveTipo = "tipo";

        Map<String, List<Map<String, String>>> resultadoEsperadoConfiguracoes = Map.of(
                "teste_1",
                List.of(
                        Map.of(nomeAtributo, "valor_teste_1", nomeValor, "valor_1", chaveTipo, "String"),
                        Map.of(nomeAtributo, "valor_teste_2", nomeValor, "valor_2", chaveTipo, "String")),
                "teste_2",
                List.of(Map.of(nomeAtributo, "valor_teste_3", nomeValor, "valor_4", chaveTipo, "String")));

        Map<String, List<Map<String, String>>> configuracoesPadrao =
                criarMapConfiguracoesPadrao(nomeAtributo, nomeValor, chaveTipo);
        Map<String, List<Map<String, String>>> mapConfiguracoesUsuario =
                criarMapConfiguracoesUsuario(nomeAtributo, nomeValor, chaveTipo);

        String configuracoesUsuario = conversorToml.converterMapConfiguracaoParaStringTOML(mapConfiguracoesUsuario);
        TomlTable tomlConfiguracoes = Toml.parse(configuracoesUsuario);
        Map<String, List<Map<String, String>>> resultadoCombinacao = combinadorConfiguracoes.combinarConfiguracoes(
                configuracoesPadrao, tomlConfiguracoes, nomeAtributo, nomeValor);

        assert resultadoEsperadoConfiguracoes.size() == resultadoCombinacao.size();
    }

    @SuppressWarnings("ExtractMethodRecommender")
    private static Map<String, List<Map<String, String>>> criarMapConfiguracoesPadrao(
            String nomeAtributo, String nomeValor, String chaveTipo) {
        Map<String, List<Map<String, String>>> configuracoesPadrao = new HashMap<>();

        List<Map<String, String>> configuracoesPadraoTeste1 = new ArrayList<>();
        Map<String, String> valorTeste1 = new HashMap<>();
        valorTeste1.put(nomeAtributo, "valor_teste_1");
        valorTeste1.put(nomeValor, "valor_1");
        valorTeste1.put(chaveTipo, "String");

        Map<String, String> valorTeste2 = new HashMap<>();
        valorTeste2.put(nomeAtributo, "valor_teste_2");
        valorTeste2.put(nomeValor, "valor_2");
        valorTeste2.put(chaveTipo, "String");

        configuracoesPadraoTeste1.add(valorTeste1);
        configuracoesPadraoTeste1.add(valorTeste2);

        configuracoesPadrao.put("teste_1", configuracoesPadraoTeste1);

        List<Map<String, String>> configuracoesPadraoTeste2 = new ArrayList<>();
        Map<String, String> valorTeste3 = new HashMap<>();
        valorTeste3.put(nomeAtributo, "valor_teste_3");
        valorTeste3.put(nomeValor, "valor_3");
        valorTeste3.put(chaveTipo, "String");
        configuracoesPadraoTeste2.add(valorTeste3);
        configuracoesPadrao.put("teste_2", configuracoesPadraoTeste2);
        return configuracoesPadrao;
    }

    private static Map<String, List<Map<String, String>>> criarMapConfiguracoesUsuario(
            String nomeAtributo, String nomeValor, String chaveTipo) {
        Map<String, List<Map<String, String>>> mapConfiguracoesUsuario = new HashMap<>();

        List<Map<String, String>> configuracaoUsuarioTeste2 = new ArrayList<>();
        Map<String, String> valorTeste3 = new HashMap<>();
        valorTeste3.put(nomeAtributo, "valor_teste_3");
        valorTeste3.put(nomeValor, "valor_4");
        valorTeste3.put(chaveTipo, "String");
        configuracaoUsuarioTeste2.add(valorTeste3);
        mapConfiguracoesUsuario.put("teste_2", configuracaoUsuarioTeste2);
        return mapConfiguracoesUsuario;
    }

    @Test
    protected void testCombinarPaletas() {
        CombinadorConfiguracoes combinadorConfiguracoes = new CombinadorConfiguracoes();
        IConversorTOMLString conversorToml = new ConversorTomlPrograma();
        String nomeAtributo = "nomeVariavel";
        String nomeValor = "valorPadraoVariavel";

        Map<String, List<Map<String, String>>> resultadoEsperadoPaleta = Map.of(
                "paleta",
                List.of(
                        Map.of(nomeAtributo, "cor_teste_1", nomeValor, "#000000"),
                        Map.of(nomeAtributo, "cor_teste_2", nomeValor, "#111111"),
                        Map.of(nomeAtributo, "cor_teste_3", nomeValor, "#222222")));

        Map<String, List<Map<String, String>>> paletaPadrao = Map.of(
                "paleta",
                List.of(
                        Map.of(nomeAtributo, "cor_teste_1", nomeValor, "#000000"),
                        Map.of(nomeAtributo, "cor_teste_2", nomeValor, "#111111"),
                        Map.of(nomeAtributo, "cor_teste_3", nomeValor, "#333333")));

        Map<String, List<Map<String, String>>> mapPaletaUsuario =
                Map.of("paleta", List.of(Map.of("cor_teste_3", "#222222")));
        String paletaUsuario = conversorToml.converterMapPaletaParaStringTOML(mapPaletaUsuario);
        TomlTable tomlPaleta = Toml.parse(paletaUsuario);

        Map<String, List<Map<String, String>>> resultadoCombinacao =
                combinadorConfiguracoes.combinarConfiguracoes(paletaPadrao, tomlPaleta, nomeAtributo, nomeValor);

        assert resultadoEsperadoPaleta.get("paleta").size()
                == resultadoCombinacao.get("paleta").size();
        assert Objects.equals(
                resultadoEsperadoPaleta.get("paleta").getFirst().get("cor_teste_1"),
                resultadoCombinacao.get("paleta").getFirst().get("cor_teste_1"));
        assert Objects.equals(
                resultadoEsperadoPaleta.get("paleta").get(1).get("cor_teste_2"),
                resultadoCombinacao.get("paleta").get(1).get("cor_teste_2"));
        assert Objects.equals(
                resultadoEsperadoPaleta.get("paleta").get(2).get("cor_teste_3"),
                resultadoCombinacao.get("paleta").get(2).get("cor_teste_3"));
    }
}
