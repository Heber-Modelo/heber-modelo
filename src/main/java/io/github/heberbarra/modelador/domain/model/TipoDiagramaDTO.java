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

package io.github.heberbarra.modelador.domain.model;

import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;

public class TipoDiagramaDTO {

    private String nome;
    private String valor;
    private String titulo;

    public TipoDiagramaDTO() {}

    public TipoDiagramaDTO(String chaveNome, String valor, String chaveTitulo) {
        this.nome = TradutorWrapper.tradutor.traduzirMensagem(chaveNome);
        this.valor = valor;
        this.titulo = TradutorWrapper.tradutor.traduzirMensagem(chaveTitulo);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
}
