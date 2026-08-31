/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.domain.model;

import java.time.LocalDateTime;

public class AtividadeDTO {

    public AtividadeDTO(String titulo, LocalDateTime datePostagem, LocalDateTime dataLimite, boolean isProva, String descricao) {
        this.titulo = titulo;
        this.datePostagem = datePostagem;
        this.dataLimite = dataLimite;
        this.isProva = isProva;
        this.descricao = descricao;
    }

    String titulo;
    LocalDateTime datePostagem;
    LocalDateTime dataLimite;
    String descricao;
    boolean isProva;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public LocalDateTime getDatePostagem() {
        return datePostagem;
    }

    public void setDatePostagem(LocalDateTime datePostagem) {
        this.datePostagem = datePostagem;
    }

    public LocalDateTime getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDateTime dataLimite) {
        this.dataLimite = dataLimite;
    }

    public boolean isProva() {
        return isProva;
    }

    public void setProva(boolean prova) {
        isProva = prova;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
