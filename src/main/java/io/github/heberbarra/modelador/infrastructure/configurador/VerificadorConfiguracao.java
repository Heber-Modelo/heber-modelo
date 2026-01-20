/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.infrastructure.configurador;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IVerificadorConfiguracao;
import io.github.heberbarra.modelador.domain.configurador.LeitorAbstratoArquivoVerificador;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorConfiguracoes;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorDotEnv;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorPaleta;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import org.tomlj.TomlTable;

public class VerificadorConfiguracao implements IVerificadorConfiguracao {

    private static final Logger logger = JavaLogger.obterLogger(VerificadorConfiguracao.class.getName());
    private final List<LeitorAbstratoArquivoVerificador<?>> leitores;
    private boolean configuracaoErrada;

    public VerificadorConfiguracao() {
        AcessadorRecursos acessadorRecursos = new AcessadorRecursos();
        configuracaoErrada = false;
        leitores = new ArrayList<>();
        leitores.add(new LeitorArquivoVerificacaoPadrao<>(
                JsonVerificadorConfiguracoes.class,
                acessadorRecursos.pegarArquivoRecurso("config/configuracao.template.json")));
        leitores.add(new LeitorArquivoVerificacaoPadrao<>(
                JsonVerificadorDotEnv.class, acessadorRecursos.pegarArquivoRecurso("config/dotenv.template.json")));
        leitores.add(new LeitorArquivoVerificacaoPadrao<>(
                JsonVerificadorPaleta.class, acessadorRecursos.pegarArquivoRecurso("config/paleta.template.json")));
    }

    /**
     * Lê os arquivos de modelo de configuração.
     *
     * @see LeitorArquivoVerificacaoPadrao
     */
    public void lerArquivosTemplate() {
        leitores.forEach(LeitorAbstratoArquivoVerificador::lerArquivo);
    }

    @Override
    public boolean configuracoesContemErrosGraves() {
        return configuracaoErrada;
    }

    @Override
    public void registrarLeitor(LeitorAbstratoArquivoVerificador<?> leitorArquivoVerificacao) {
        leitores.add(leitorArquivoVerificacao);
    }

    @Override
    public void mostrarInformacoes() {
        leitores.forEach(leitor -> System.out.println(leitor.getInformacoesJSON()));
    }

    @SuppressWarnings("unchecked")
    public LeitorArquivoVerificacaoPadrao<JsonVerificadorPaleta> getLeitorPaleta() {
        return (LeitorArquivoVerificacaoPadrao<JsonVerificadorPaleta>) leitores.get(2);
    }

    @SuppressWarnings("unchecked")
    public LeitorArquivoVerificacaoPadrao<JsonVerificadorDotEnv> getLeitorDotEnv() {
        return (LeitorArquivoVerificacaoPadrao<JsonVerificadorDotEnv>) leitores.get(1);
    }

    @SuppressWarnings("unchecked")
    public LeitorArquivoVerificacaoPadrao<JsonVerificadorConfiguracoes> getLeitorConfiguracoes() {
        return (LeitorArquivoVerificacaoPadrao<JsonVerificadorConfiguracoes>) leitores.getFirst();
    }

    @Override
    public void verificarArquivoConfiguracao(
            Map<String, List<Map<String, String>>> configuracaoPadrao, TomlTable dados) {
        configuracaoErrada = false;

        for (String categoria : dados.keySet()) {

            if (!configuracaoPadrao.containsKey(categoria)) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.config.category.notfound")
                        .formatted(categoria));
                continue;
            }

            TomlTable tabelaCategoria = dados.getTable(categoria);
            if (tabelaCategoria == null) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.config.category.empty")
                        .formatted(categoria));
                continue;
            }

            for (String atributo : tabelaCategoria.keySet()) {
                verificarAtributoConfiguracao(
                        configuracaoPadrao.get(categoria), atributo, tabelaCategoria.get(atributo));
            }
        }
    }

    @Override
    public void verificarAtributoConfiguracao(List<Map<String, String>> atributos, String nomeAtributo, Object valor) {
        int quantidade = 0;

        Map<String, String> atributoPadraoEncontrado = null;
        for (Map<String, String> atributoPadrao : atributos) {

            if (atributoPadrao.get("atributo").equals(nomeAtributo)) {
                atributoPadraoEncontrado = atributoPadrao;
                quantidade++;
            }
        }

        if (quantidade == 0) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.config.attribute.invalid")
                    .formatted(nomeAtributo));
            return;
        }

        if (quantidade > 1) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.config.attribute.multiple.occurrences")
                    .formatted(nomeAtributo, quantidade));
        }

        String tipoPadraoAtributo = atributoPadraoEncontrado.get("tipo");
        String tipoAtributo = valor.getClass().getSimpleName();

        if (tipoPadraoAtributo.equals(tipoAtributo)) {
            return;
        }

        logger.warning(TradutorWrapper.tradutor
                .traduzirMensagem("error.config.attribute.invalid.type")
                .formatted(nomeAtributo, tipoPadraoAtributo));
        configuracaoErrada = true;
    }

    @Override
    public void verificarAtributoDotEnv(Map<String, String> map, String s, Object o) {}

    @Override
    public void verificarArquivoDotEnv(Map<String, String> map, Map<String, String> map1) {}

    @Override
    public void verificarArquivoPaleta(Map<String, List<Map<String, String>>> paletaPadrao, TomlTable dados) {
        TomlTable tabelaPaleta = dados.getTable("paleta");
        List<Map<String, String>> variaveisTabelaPadrao = paletaPadrao.get("paleta");

        if (tabelaPaleta == null) {
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.paleta.notfound"));
            configuracaoErrada = true;
            return;
        }

        for (String variavel : tabelaPaleta.keySet()) {
            verificarVariavelPaleta(variaveisTabelaPadrao, variavel, tabelaPaleta.get(variavel));
        }
    }

    @Override
    public void verificarVariavelPaleta(List<Map<String, String>> variaveis, String nomeVariavel, Object valor) {
        String regexPaleta = "^#(?:[0-9a-fA-F]{3}){1,2}$";
        int quantidade = 0;

        for (Map<String, String> variavelPadrao : variaveis) {

            if (variavelPadrao.get("nomeVariavel").equals(nomeVariavel)) {
                quantidade++;
            }
        }

        if (quantidade == 0) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.paleta.variable.notfound")
                    .formatted(nomeVariavel));
            return;
        }

        if (quantidade > 1) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.paleta.variable.multiple.occurrences")
                    .formatted(nomeVariavel, quantidade));
        }

        if (valor instanceof String valorVariavel) {
            if (!valorVariavel.matches(regexPaleta)) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.paleta.variable.invalid.format")
                        .formatted(nomeVariavel));
                configuracaoErrada = true;
            }

            return;
        }

        logger.warning(TradutorWrapper.tradutor
                .traduzirMensagem("error.paleta.variable.invalid.type")
                .formatted(nomeVariavel));
        configuracaoErrada = true;
    }

    public List<LeitorAbstratoArquivoVerificador<?>> getLeitores() {
        return leitores;
    }
}
