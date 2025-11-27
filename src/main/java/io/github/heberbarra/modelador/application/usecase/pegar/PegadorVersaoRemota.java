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

package io.github.heberbarra.modelador.application.usecase.pegar;

import io.github.heberbarra.modelador.Principal;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import io.github.heberbarra.modelador.domain.model.json.JsonRespostaHttp;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * Pega a versão semântica da última release do repositório remoto.
 *
 * @since v0.0.3-SNAPSHOT
 */
public class PegadorVersaoRemota {

    private static final Logger logger = JavaLogger.obterLogger(PegadorVersaoRemota.class.getName());
    private static final URL URL_RELEASES_GITHUB;

    static {
        try {
            URI releasesGithub = new URI("https://api.github.com/repos/HeberBarra/%s/releases/latest"
                    .formatted(Principal.NOME_PROGRAMA.toLowerCase()));
            URL_RELEASES_GITHUB = releasesGithub.toURL();
        } catch (URISyntaxException | MalformedURLException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.urls.create")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CRIACAO_URLS.getCodigo());
            throw new RuntimeException();
        }
    }

    /**
     * Envia uma request HTTPS ao repositório do GitHub e retorna a response obtida. Caso ocorra algum erro durante a
     * request o programa pode ser encerrando com um dos seguintes erros: {@link CodigoSaida#ERRO_CONEXAO},
     * {@link CodigoSaida#PROTOCOLO_INVALIDO}, {@link CodigoSaida#ERRO_LEITURA_RESPONSE}, {@link CodigoSaida#ERRO_CONVERSAO_RESPONSE}
     * <p>
     * Caso a request tenha sido bem sucedida retorna o corpo da response, caso contrário retorna uma string vazia.
     *
     * @return o corpo da response obtida ou string vazia se tiver ocorrido algum erro
     */
    private String pegarResponseGitHub() {
        HttpsURLConnection connection;
        StringBuilder stringBuilder = new StringBuilder();
        try {
            connection = (HttpsURLConnection) URL_RELEASES_GITHUB.openConnection();
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.connect.github")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CONEXAO.getCodigo());
            return "";
        }

        try {
            connection.setRequestMethod("GET");
        } catch (ProtocolException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.protocol.invalid")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.PROTOCOLO_INVALIDO.getCodigo());
            return "";
        }

        try {
            if (connection.getResponseCode() != HttpsURLConnection.HTTP_OK) {
                logger.warning(TradutorWrapper.tradutor
                        .traduzirMensagem("error.update.code.not.200")
                        .formatted(connection.getResponseCode()));
                return "";
            }
        } catch (IOException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.connect.github")
                    .formatted(e.getMessage()));
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.update.verify.internet"));
            return "";
        }

        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String linha;
            while ((linha = bufferedReader.readLine()) != null) {
                stringBuilder.append(linha);
            }

            connection.disconnect();
            return stringBuilder.toString();
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.read.response.body")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_LEITURA_RESPONSE.getCodigo());
            return "";
        }
    }

    /**
     * Envia uma request ao repositório remoto e pega o atributo versão da response.
     *
     * @return a última versão semântica do programa
     * @see PegadorVersaoRemota#pegarResponseGitHub()
     */
    public String pegarVersaoRemota() {
        String resposta = pegarResponseGitHub();

        if (resposta.isEmpty()) {
            return "";
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonRespostaHttp jsonRespostaHttp = objectMapper.readValue(resposta, JsonRespostaHttp.class);
            return jsonRespostaHttp.getName();
        } catch (JacksonException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.update.convert.response")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ERRO_CONVERSAO_RESPONSE.getCodigo());
        }
        return "";
    }
}
