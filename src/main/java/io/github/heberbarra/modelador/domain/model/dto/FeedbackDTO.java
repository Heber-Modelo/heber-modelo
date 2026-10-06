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

public class FeedbackDTO {

    private int codigo;
    private String descricao;
    private int codigoAtividade;
    private String imagemAtividade;
    private String matriculaEstudante;
    private String matriculaProfessor;

    public FeedbackDTO() {}

    public FeedbackDTO(
            int codigo,
            String descricao,
            int codigoAtividade,
            String imagemAtividade,
            String matriculaEstudante,
            String matriculaProfessor) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.codigoAtividade = codigoAtividade;
        this.imagemAtividade = imagemAtividade;
        this.matriculaEstudante = matriculaEstudante;
        this.matriculaProfessor = matriculaProfessor;
    }

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getCodigoAtividade() {
        return codigoAtividade;
    }

    public void setCodigoAtividade(int codigoAtividade) {
        this.codigoAtividade = codigoAtividade;
    }

    public String getImagemAtividade() {
        return imagemAtividade;
    }

    public void setImagemAtividade(String imagemAtividade) {
        this.imagemAtividade = imagemAtividade;
    }

    public String getMatriculaEstudante() {
        return matriculaEstudante;
    }

    public void setMatriculaEstudante(String matriculaEstudante) {
        this.matriculaEstudante = matriculaEstudante;
    }

    public String getMatriculaProfessor() {
        return matriculaProfessor;
    }

    public void setMatriculaProfessor(String matriculaProfessor) {
        this.matriculaProfessor = matriculaProfessor;
    }
}
