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

public class MetaDadosConexaoJSON extends MetaDadosComponenteJSON {
    public static final String CLASSE_PRIMEIRO_PONTO = "primeiro-ponto";
    public static final String CLASSE_SEGUNDO_PONTO = "segundo-ponto";
    public static final String CLASSE_PRIMEIRA_LATERAL = "primeira-lateral";
    public static final String CLASSE_SEGUNDA_LATERAL = "segunda-lateral";
    public static final String CLASSE_ID_PRIMEIRO_COMPONENTE = "id-primeiro-componente";
    public static final String CLASSE_ID_SEGUNDO_COMPONENTE = "id-segundo-componente";
    public static final String PROPRIEDADE_X_PONTO = "data-x-ponto";
    public static final String PROPRIEDADE_Y_PONTO = "data-y-ponto";

    private PontoJSON primeiroPonto;
    private PontoJSON segundoPonto;
    private int lateralPrimeiroComponente;
    private int lateralSegundoComponente;
    private int idPrimeiroComponente;
    private int idSegundoComponente;

    public MetaDadosConexaoJSON() {}

    public MetaDadosConexaoJSON(
            Integer idComponenteSelf,
            String tipo,
            PontoJSON primeiroPonto,
            PontoJSON segundoPonto,
            int lateralPrimeiroComponente,
            int lateralSegundoComponente,
            int idPrimeiroComponente,
            int idSegundoComponente) {
        super(idComponenteSelf, tipo);
        this.primeiroPonto = primeiroPonto;
        this.segundoPonto = segundoPonto;
        this.lateralPrimeiroComponente = lateralPrimeiroComponente;
        this.lateralSegundoComponente = lateralSegundoComponente;
        this.idPrimeiroComponente = idPrimeiroComponente;
        this.idSegundoComponente = idSegundoComponente;
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
                + "<div class=\"%s\" %s=\"%f\" %s=\"%f\"></div>"
                        .formatted(
                                CLASSE_PRIMEIRO_PONTO,
                                PROPRIEDADE_X_PONTO,
                                primeiroPonto.getX(),
                                PROPRIEDADE_Y_PONTO,
                                primeiroPonto.getY())
                + "<div class=\"%s\" %s=\"%f\" %s=\"%f\"></div>"
                        .formatted(
                                CLASSE_SEGUNDO_PONTO,
                                PROPRIEDADE_X_PONTO,
                                segundoPonto.getY(),
                                PROPRIEDADE_Y_PONTO,
                                segundoPonto.getY())
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_PRIMEIRO_COMPONENTE, idPrimeiroComponente)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_ID_SEGUNDO_COMPONENTE, idSegundoComponente)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_PRIMEIRA_LATERAL, lateralPrimeiroComponente)
                + "<div class=\"%s\">%d</div>".formatted(CLASSE_SEGUNDA_LATERAL, lateralSegundoComponente)
                + "</div>";
    }

    public PontoJSON getPrimeiroPonto() {
        return primeiroPonto;
    }

    public void setPrimeiroPonto(PontoJSON primeiroPonto) {
        this.primeiroPonto = primeiroPonto;
    }

    public PontoJSON getSegundoPonto() {
        return segundoPonto;
    }

    public void setSegundoPonto(PontoJSON segundoPonto) {
        this.segundoPonto = segundoPonto;
    }

    public int getLateralPrimeiroComponente() {
        return lateralPrimeiroComponente;
    }

    public void setLateralPrimeiroComponente(int lateralPrimeiroComponente) {
        this.lateralPrimeiroComponente = lateralPrimeiroComponente;
    }

    public int getLateralSegundoComponente() {
        return lateralSegundoComponente;
    }

    public void setLateralSegundoComponente(int lateralSegundoComponente) {
        this.lateralSegundoComponente = lateralSegundoComponente;
    }

    public int getIdPrimeiroComponente() {
        return idPrimeiroComponente;
    }

    public void setIdPrimeiroComponente(int idPrimeiroComponente) {
        this.idPrimeiroComponente = idPrimeiroComponente;
    }

    public int getIdSegundoComponente() {
        return idSegundoComponente;
    }

    public void setIdSegundoComponente(int idSegundoComponente) {
        this.idSegundoComponente = idSegundoComponente;
    }
}
