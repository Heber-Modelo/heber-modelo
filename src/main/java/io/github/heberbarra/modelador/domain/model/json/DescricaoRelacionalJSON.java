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

package io.github.heberbarra.modelador.domain.model.json;

import io.github.heberbarra.modelador.domain.model.xhtml.XHTMLConvertable;

public class DescricaoRelacionalJSON implements XHTMLConvertable {

    int idAba;
    int idComponente;
    String nomeComponente;
    String descricaoHTML;

    public DescricaoRelacionalJSON() {}

    public DescricaoRelacionalJSON(int idAba, int idComponente, String nomeComponente, String descricaoHTML) {
        this.idAba = idAba;
        this.idComponente = idComponente;
        this.nomeComponente = nomeComponente;
        this.descricaoHTML = descricaoHTML;
    }

    @Override
    public String toXHTML() {
        StringBuilder builder = new StringBuilder();

        builder.append("<div ");
        builder.append("%s=\"%d\" ".formatted(PROPRIEDADE_ID_ABA, idAba));
        builder.append("%s=\"%d\" ".formatted(PROPRIEDADE_ID_COMPONENTE, idComponente));
        builder.append("%s=\"%s\" >".formatted(PROPRIEDADE_NOME_COMPONENTE, nomeComponente));

        String descricaoFormatada = descricaoHTML.replace("<br>", "<br/>");

        builder.append(descricaoFormatada);
        builder.append("</div>");

        return builder.toString();
    }

    public int getIdAba() {
        return idAba;
    }

    public void setIdAba(int idAba) {
        this.idAba = idAba;
    }

    public int getIdComponente() {
        return idComponente;
    }

    public void setIdComponente(int idComponente) {
        this.idComponente = idComponente;
    }

    public String getNomeComponente() {
        return nomeComponente;
    }

    public void setNomeComponente(String nomeComponente) {
        this.nomeComponente = nomeComponente;
    }

    public String getDescricaoHTML() {
        return descricaoHTML;
    }

    public void setDescricaoHTML(String descricaoHTML) {
        this.descricaoHTML = descricaoHTML;
    }
}
