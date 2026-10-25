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

public class MetaDadosCardinalidadeJSON extends MetaDadosComponenteJSON {
    public static final String CLASSE_ID_CONEXAO = "id-componente-conexao";
    public static final String CLASSE_ID_RELACIONAMENTO = "id-componente-relacionamento";

    private int idComponenteConexao;
    private int idComponenteRelacionamento;

    public MetaDadosCardinalidadeJSON() {}

    public MetaDadosCardinalidadeJSON(
            Integer idComponenteSelf, String tipo, int idComponenteConexao, int idComponenteRelacionamento) {
        super(idComponenteSelf, tipo);
        this.idComponenteConexao = idComponenteConexao;
        this.idComponenteRelacionamento = idComponenteRelacionamento;
    }

    @Override
    public String toXHTML() {
        return "<div class=\"%s\" ><div %s=\"%d\"></div><div %s=\"%s\"></div>"
                        .formatted(
                                CLASSE_META_DADOS,
                                PROPRIEDADE_ID_SELF,
                                idComponenteSelf,
                                PROPRIEDADE_TIPO_METADADOS,
                                tipo)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_CONEXAO, idComponenteConexao)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_RELACIONAMENTO, idComponenteRelacionamento)
                + "</div>";
    }

    public int getIdComponenteConexao() {
        return idComponenteConexao;
    }

    public void setIdComponenteConexao(int idComponenteConexao) {
        this.idComponenteConexao = idComponenteConexao;
    }

    public int getIdComponenteRelacionamento() {
        return idComponenteRelacionamento;
    }

    public void setIdComponenteRelacionamento(int idComponenteRelacionamento) {
        this.idComponenteRelacionamento = idComponenteRelacionamento;
    }
}
