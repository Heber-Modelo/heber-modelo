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

package io.github.heberbarra.modelador.domain.model;

public class AtributoConfiguracaoSessao<T> {

    String chaveI18N;
    String nome;
    T valor;

    public AtributoConfiguracaoSessao() {}

    public AtributoConfiguracaoSessao(String chaveI18N, String nome, T valor) {
        this.chaveI18N = chaveI18N;
        this.valor = valor;
    }

    public T pegarValor() {
        return valor;
    }

    public String getChaveI18N() {
        return chaveI18N;
    }

    public void setChaveI18N(String chaveI18N) {
        this.chaveI18N = chaveI18N;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public T getValor() {
        return valor;
    }

    public void setValor(T valor) {
        this.valor = valor;
    }
}
