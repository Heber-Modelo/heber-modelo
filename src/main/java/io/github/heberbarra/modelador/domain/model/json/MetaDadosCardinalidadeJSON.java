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
    public static final String CLASSE_ID_COMPONENTE = "id-componente-diagrama";
    public static final String CLASSE_ID_CONEXAO = "id-componente-conexao";
    public static final String CLASSE_ID_RELACIONAMENTO = "id-componente-relacionamento";
    public static final String CLASSE_LATERAL_COMPONENTE = "lateral-componente";

    private int idComponenteConexao;
    private int idComponenteDiagrama;
    private int idComponenteRelacionamento;
    private int lateralComponente;

    public MetaDadosCardinalidadeJSON() {}

    public MetaDadosCardinalidadeJSON(
            Integer idComponenteSelf,
            String tipo,
            int idComponenteConexao,
            int idComponenteDiagrama,
            int idComponenteRelacionamento,
            int lateralComponente) {
        super(idComponenteSelf, tipo);
        this.idComponenteConexao = idComponenteConexao;
        this.idComponenteDiagrama = idComponenteDiagrama;
        this.idComponenteRelacionamento = idComponenteRelacionamento;
        this.lateralComponente = lateralComponente;
    }

    @Override
    public String toXHTML() {
        return "<div class=\"%s\" %s=\"%d\" %s=\"%s\">"
                        .formatted(
                                CLASSE_META_DADOS,
                                PROPRIEDADE_ID_SELF,
                                idComponenteSelf,
                                PROPRIEDADE_TIPO_METADADOS,
                                tipo)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_COMPONENTE, idComponenteDiagrama)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_CONEXAO, idComponenteConexao)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_RELACIONAMENTO, idComponenteRelacionamento)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_LATERAL_COMPONENTE, lateralComponente)
                + "</div>";
    }

    public int getIdComponenteConexao() {
        return idComponenteConexao;
    }

    public void setIdComponenteConexao(int idComponenteConexao) {
        this.idComponenteConexao = idComponenteConexao;
    }

    public int getIdComponenteDiagrama() {
        return idComponenteDiagrama;
    }

    public void setIdComponenteDiagrama(int idComponenteDiagrama) {
        this.idComponenteDiagrama = idComponenteDiagrama;
    }

    public int getIdComponenteRelacionamento() {
        return idComponenteRelacionamento;
    }

    public void setIdComponenteRelacionamento(int idComponenteRelacionamento) {
        this.idComponenteRelacionamento = idComponenteRelacionamento;
    }

    public int getLateralComponente() {
        return lateralComponente;
    }

    public void setLateralComponente(int lateralComponente) {
        this.lateralComponente = lateralComponente;
    }
}
