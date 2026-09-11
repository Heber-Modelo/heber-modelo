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

package io.github.heberbarra.modelador.application.usecase.hash;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.codigo.CodigoSaida;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;

/**
 * Utilizado para calcular o hash utilizando vários algoritmos, veja os métodos disponíveis para descobrir os algoritmos disponíveis
 * <p>
 * TIAN, Beau. SHA-256 and SHA3-256 Hashing in Java. Postado em: 20 nov. 2016
 * [blog]. Disponível em: <<a href="https://www.baeldung.com/sha-256-hashing-java">https://www.baeldung.com/sha-256-hashing-java</a>>.
 * Acesso em: 24 nov. 2024.
 *
 * @since v0.0.3-SNAPSHOT
 */
public class CalculadorHash {

    private static final Logger logger = JavaLogger.obterLogger(CalculadorHash.class.getName());

    /**
     * Calcula o hash de um array dados utilizando um algoritmo específico
     *
     * @param messageDigest especifica o algoritmo que será utilizado para o cálculo do hash
     * @param dados         os dados a serem processados pelo algoritmo
     * @return a string do hash calculado
     */
    private String calcularHash(MessageDigest messageDigest, byte[] dados) {
        byte[] mensagemHex = messageDigest.digest(dados);
        StringBuilder hexString = new StringBuilder(mensagemHex.length * 2);

        for (byte hash : mensagemHex) {
            String hex = Integer.toHexString(0xff & hash);

            if (hex.length() == 1) {
                hexString.append("0");
            }

            hexString.append(hex);
        }

        return hexString.toString();
    }

    /**
     * Calcula o hash sum de um dado array de bytes utilizando o algoritmo SHA-256
     *
     * @param dados os dados que serão processados
     * @return a string do hash calculado
     */
    public String calcularHash256(byte[] dados) {
        MessageDigest messageDigest;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.hash.invalid.algorithm")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ALGORITMO_INVALIDO.getCodigo());
            throw new RuntimeException(e);
        }

        return calcularHash(messageDigest, dados);
    }

    /**
     * Calcula o hash sum de um dado array de bytes utilizando o algoritmo SHA-512
     *
     * @param dados os dados que serão processados
     * @return a string do hash calculado
     */
    public String calcularHash512(byte[] dados) {
        MessageDigest messageDigest;
        try {
            messageDigest = MessageDigest.getInstance("SHA-512");
        } catch (NoSuchAlgorithmException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.hash.invalid.algorithm")
                    .formatted(e.getMessage()));
            logger.severe(TradutorWrapper.tradutor.traduzirMensagem("app.end"));
            System.exit(CodigoSaida.ALGORITMO_INVALIDO.getCodigo());
            throw new RuntimeException(e);
        }

        return calcularHash(messageDigest, dados);
    }
}
