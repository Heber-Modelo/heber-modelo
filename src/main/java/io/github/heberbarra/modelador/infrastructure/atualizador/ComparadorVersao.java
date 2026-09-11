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

package io.github.heberbarra.modelador.infrastructure.atualizador;

import io.github.heberbarra.modelador.domain.atualizador.SufixoVersao;
import java.util.ArrayList;
import java.util.List;

/**
 * Compara duas versões semânticas e diz qual é maior, ou se a duas são iguais.
 *
 * @since v0.0.3-SNAPSHOT
 */
public class ComparadorVersao {

    public static final int MAIOR = 1;
    public static final int IGUAL = 0;
    public static final int MENOR = -1;
    public static final int CANCELAR = -2;
    private static final String PREFIXO_VERSAO = "v";
    private String versaoPrograma;
    private String versaoRemota;

    /**
     * Divide a versão em múltiplas partes para facilitar a comparação.
     *
     * @param versao a versão a ser dividida
     * @return as partes da versão passada
     */
    private List<String> pegarPartesVersao(String versao) {
        List<String> partesVersao = new ArrayList<>(List.of(versao.split("\\.")));

        if (partesVersao.getLast().contains("-")) {
            List<String> ultimasPartesVersao = List.of(partesVersao.getLast().split("-"));
            partesVersao.removeLast();
            partesVersao.addAll(ultimasPartesVersao);
        }

        return partesVersao;
    }

    /**
     * Pega apenas o sufixo de uma versão específica.
     *
     * @param partesVersao partes da versão da qual se deseja pegar o sufixo
     * @return o sufixo da versão passada
     */
    private SufixoVersao pegarSufixoVersao(List<String> partesVersao) {
        if (partesVersao.size() > 3) {
            return SufixoVersao.valueOf(partesVersao.getLast());
        }

        return SufixoVersao.RELEASE;
    }

    /**
     * Compara a versão do programa instalado com a versão remota.
     *
     * @return {@link ComparadorVersao#CANCELAR} caso uma das versões seja {@code null},
     * <br>{@link ComparadorVersao#IGUAL} caso as duas versões sejam iguais,
     * <br>{@link ComparadorVersao#MAIOR} caso a versão remota seja maior que a versão local,
     * <br>{@link ComparadorVersao#MENOR} caso a versão remota seja menor que a versão local
     */
    public int compararVersoes() {
        if (versaoPrograma == null || versaoRemota == null) return CANCELAR;
        if (versaoPrograma.equals(versaoRemota)) return IGUAL;

        List<String> partesVersaoPrograma = pegarPartesVersao(versaoPrograma);
        List<String> partesVersaoRemota = pegarPartesVersao(versaoRemota);
        SufixoVersao sufixoVersaoPrograma = pegarSufixoVersao(partesVersaoPrograma);
        SufixoVersao sufixoVersaoRemota = pegarSufixoVersao(partesVersaoRemota);
        if (sufixoVersaoRemota.valor > sufixoVersaoPrograma.valor) {
            return MAIOR;
        } else if (sufixoVersaoRemota.valor < sufixoVersaoPrograma.valor) {
            return MENOR;
        }

        for (int i = 0; i < 3; i++) {
            if (partesVersaoRemota.get(i).compareToIgnoreCase(partesVersaoPrograma.get(i)) == 1) {
                return MAIOR;
            }

            if (partesVersaoRemota.get(i).compareToIgnoreCase(partesVersaoPrograma.get(i)) == -1) {
                return MENOR;
            }
        }

        return IGUAL;
    }

    /**
     * Remove o prefixo de uma versão específica para facilitar a comparação.
     *
     * @param versao a versão da qual se deseja remover o prefixo
     * @return a versão sem o prefixo
     */
    private String removerPrefixo(String versao) {
        if (versao == null) {
            return null;
        }

        if (versao.toLowerCase().startsWith(PREFIXO_VERSAO)) {
            return versao.substring(PREFIXO_VERSAO.length());
        }

        return versao;
    }

    public ComparadorVersao(String versaoPrograma, String versaoRemota) {
        if (versaoPrograma != null) this.versaoPrograma = removerPrefixo(versaoPrograma);
        this.versaoRemota = removerPrefixo(versaoRemota);
    }

    public void setVersaoPrograma(String versaoPrograma) {
        this.versaoPrograma = removerPrefixo(versaoPrograma);
    }

    public void setVersaoRemota(String versaoRemota) {
        this.versaoRemota = removerPrefixo(versaoRemota);
    }
}
