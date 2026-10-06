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

package io.github.heberbarra.modelador.domain.model.dto;

import java.time.LocalDateTime;

public class AtividadeFeedbackDTO {

    private int codigoFeedback;
    private String matriculaEstudante;
    private String nomeEstudante;
    private String tituloAtividade;
    private LocalDateTime dataCriacao;

    public AtividadeFeedbackDTO() {}

    public AtividadeFeedbackDTO(
            int codigoAtividade,
            String matriculaEstudante,
            String nomeEstudante,
            String tituloAtividade,
            LocalDateTime dataCriacao) {
        this.codigoFeedback = codigoAtividade;
        this.matriculaEstudante = matriculaEstudante;
        this.nomeEstudante = nomeEstudante;
        this.tituloAtividade = tituloAtividade;
        this.dataCriacao = dataCriacao;
    }

    public int getCodigoFeedback() {
        return codigoFeedback;
    }

    public void setCodigoFeedback(int codigoAtividade) {
        this.codigoFeedback = codigoAtividade;
    }

    public String getMatriculaEstudante() {
        return matriculaEstudante;
    }

    public void setMatriculaEstudante(String matriculaEstudante) {
        this.matriculaEstudante = matriculaEstudante;
    }

    public String getNomeEstudante() {
        return nomeEstudante;
    }

    public void setNomeEstudante(String nomeEstudante) {
        this.nomeEstudante = nomeEstudante;
    }

    public String getTituloAtividade() {
        return tituloAtividade;
    }

    public void setTituloAtividade(String tituloAtividade) {
        this.tituloAtividade = tituloAtividade;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
