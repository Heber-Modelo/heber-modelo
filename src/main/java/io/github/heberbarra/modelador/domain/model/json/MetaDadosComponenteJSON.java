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

package io.github.heberbarra.modelador.domain.model.json;

import io.github.heberbarra.modelador.domain.model.xhtml.XHTMLConvertable;

public class MetaDadosComponenteJSON implements XHTMLConvertable {
    public static final String CLASSE_META_DADOS = "metadados";
    public static final String PROPRIEDADE_ID_SELF = "data-id-self";
    public static final String PROPRIEDADE_TIPO_METADADOS = "data-tipo-metados";

    protected int idComponenteSelf;
    protected String tipo;

    public MetaDadosComponenteJSON() {}

    public MetaDadosComponenteJSON(Integer idComponenteSelf, String tipo) {
        this.idComponenteSelf = idComponenteSelf;
        this.tipo = tipo;
    }

    @Override
    public String toXHTML() {
        return "";
    }

    public Integer getIdComponenteSelf() {
        return idComponenteSelf;
    }

    public void setIdComponenteSelf(Integer idComponenteSelf) {
        this.idComponenteSelf = idComponenteSelf;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
