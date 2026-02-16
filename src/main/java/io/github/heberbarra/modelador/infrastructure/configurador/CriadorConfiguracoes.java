/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.configurador.CriadorConfiguracoesBase;
import io.github.heberbarra.modelador.domain.configurador.IPastaConfiguracao;
import io.github.heberbarra.modelador.domain.verificador.VerificadorAbstratoJSONAtributo;
import io.github.heberbarra.modelador.infrastructure.conversor.ConversorTomlPrograma;
import io.github.heberbarra.modelador.infrastructure.conversor.IConversorTOMLString;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorConfiguracoes;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorDotEnv;
import io.github.heberbarra.modelador.infrastructure.verificador.JsonVerificadorPaleta;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

public class CriadorConfiguracoes extends CriadorConfiguracoesBase {

    private static final Logger logger = JavaLogger.obterLogger(CriadorConfiguracoes.class.getName());
    private final IConversorTOMLString conversorToml;
    private final Map<String, List<Map<String, String>>> configuracaoPadrao;
    private final Map<String, String> dotenvPadrao;
    private final Map<String, List<Map<String, String>>> paletaPadrao;

    public CriadorConfiguracoes(IPastaConfiguracao pastaConfiguracao) {
        super(pastaConfiguracao);
        conversorToml = new ConversorTomlPrograma();
        configuracaoPadrao = new LinkedHashMap<>();
        dotenvPadrao = new LinkedHashMap<>();
        paletaPadrao = new LinkedHashMap<>();
        paletaPadrao.put("paleta", new ArrayList<>());
    }

    @Override
    public void criarPastaConfiguracao() {
        File pasta = new File(pastaConfiguracao.getPasta());
        if (pasta.mkdirs()) {
            logger.info(TradutorWrapper.tradutor
                    .traduzirMensagem("file.dir.creation.success")
                    .formatted(pasta));
        }
    }

    @Override
    public void criarArquivoConfiguracoes(String arquivoConfiguracoes) {
        String dadosToml = conversorToml.converterMapConfiguracaoParaStringTOML(configuracaoPadrao);
        criarArquivo(dadosToml, pastaConfiguracao.getPasta() + "/" + arquivoConfiguracoes);
    }

    @Override
    public void criarArquivoDotEnv() {
        File dotenv = new File("%s/.env".formatted(pastaConfiguracao.getPasta()));

        if (dotenv.exists() && dotenv.length() != 0) {
            return;
        }

        try (BufferedWriter dotenvWriter = new BufferedWriter(new FileWriter(dotenv))) {
            if (dotenv.createNewFile()) {
                logger.info(TradutorWrapper.tradutor
                        .traduzirMensagem("file.creation.success")
                        .formatted(dotenv.getAbsoluteFile()));
            }

            if (dotenv.length() == 0) {

                for (String key : dotenvPadrao.keySet()) {
                    dotenvWriter.write("%s=%s".formatted(key, dotenvPadrao.get(key)));
                    dotenvWriter.newLine();
                }
            }

        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create")
                    .formatted(dotenv.getAbsoluteFile(), e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_CONFIG.getCodigo());
        }
    }

    @Override
    public void criarArquivoPaleta(String arquivoPaleta) {
        String dadosToml = conversorToml.converterMapPaletaParaStringTOML(paletaPadrao);
        criarArquivo(dadosToml, pastaConfiguracao.getPasta() + "/" + arquivoPaleta);
    }

    @Override
    public void sobrescreverArquivoConfiguracoes(String arquivoConfiguracoes, String dadosToml) {
        criarArquivo(dadosToml, pastaConfiguracao.getPasta() + "/" + arquivoConfiguracoes, false);
    }

    @Override
    public void sobrescreverArquivoDotEnv(Map<String, String> dados) {
        File dotEnvFile = new File("%s/.env".formatted(pastaConfiguracao.getPasta()));

        try (BufferedWriter dotEnvWriter = new BufferedWriter(new FileWriter(dotEnvFile))) {
            for (String key : dados.keySet()) {
                dotEnvWriter.write("%s=%s".formatted(key, dados.get(key)));
                dotEnvWriter.newLine();
            }
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create")
                    .formatted(dotEnvFile.getAbsolutePath(), e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_CONFIG.getCodigo());
        }
    }

    @Override
    public void sobrescreverArquivoPaleta(String arquivoPaleta, String dadosToml) {
        criarArquivo(dadosToml, pastaConfiguracao.getPasta() + "/" + arquivoPaleta, false);
    }

    @Override
    public void pegarConfiguracaoPadrao(VerificadorAbstratoJSONAtributo<?> verificadorAbstratoJSONAtributo) {
        if (verificadorAbstratoJSONAtributo instanceof JsonVerificadorConfiguracoes verificador) {
            verificador.getAtributos().forEach(atributo -> {
                if (!configuracaoPadrao.containsKey(atributo.getCategoria())) {
                    configuracaoPadrao.put(atributo.getCategoria(), new ArrayList<>());
                }

                configuracaoPadrao.get(atributo.getCategoria()).add(atributo.converterParaMap());
            });
        }
    }

    @Override
    public void pegarDotEnvPadrao(VerificadorAbstratoJSONAtributo<?> verificadorAbstratoJSONAtributo) {
        if (verificadorAbstratoJSONAtributo instanceof JsonVerificadorDotEnv verificador) {
            verificador.getAtributos().forEach(atributo -> {
                dotenvPadrao.put(atributo.getNome(), atributo.getValorPadrao());
            });
        }
    }

    @Override
    public void pegarPaletaPadrao(VerificadorAbstratoJSONAtributo<?> verificadorAbstratoJSONAtributo) {
        if (verificadorAbstratoJSONAtributo instanceof JsonVerificadorPaleta verificador) {
            List<Map<String, String>> atributos = paletaPadrao.get("paleta");

            verificador.getAtributos().forEach(atributo -> atributos.add(atributo.converterParaMap()));
        }
    }

    /**
     * Cria o arquivo com os dados fornecidos sem sobrescrever um arquivo existente.
     *
     * @param dadosToml      os dados a serem escritos
     * @param caminhoArquivo o caminho até o arquivo
     */
    private void criarArquivo(String dadosToml, String caminhoArquivo) {
        criarArquivo(dadosToml, caminhoArquivo, true);
    }

    /**
     * Cria o arquivo com os dados fornecidos, com a opção de sobrescrever um arquivo existente.
     *
     * @param dadosToml        os dados a serem escritos
     * @param caminhoArquivo   o caminho até o arquivo
     * @param naoSobrescrever se um arquivo existente deve ou não ser sobrescrito
     */
    private void criarArquivo(String dadosToml, String caminhoArquivo, boolean naoSobrescrever) {
        File arquivo = new File(caminhoArquivo);

        if (naoSobrescrever && arquivo.length() != 0) {
            return;
        }

        try (BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(caminhoArquivo))) {
            bufferedWriter.write(dadosToml);
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.create")
                    .formatted(caminhoArquivo, e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_CONFIG.getCodigo());
        }
    }

    public Map<String, List<Map<String, String>>> getConfiguracaoPadrao() {
        return configuracaoPadrao;
    }

    public Map<String, String> getDotenvPadrao() {
        return dotenvPadrao;
    }

    public Map<String, List<Map<String, String>>> getPaletaPadrao() {
        return paletaPadrao;
    }
}
