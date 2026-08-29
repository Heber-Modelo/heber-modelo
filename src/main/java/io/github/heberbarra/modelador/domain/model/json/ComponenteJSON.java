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
import java.util.Arrays;
import java.util.List;

public class ComponenteJSON implements XHTMLConvertable {
    public static final String CLASSE_BASE_COMPONENTE = "componente";
    public static final String PROPRIEDADE_NOME_COMPONENTE = "data-nome-componente";

    int idAba;
    int idComponente;
    String nomeComponente;
    List<String> classes;
    List<Integer> idsOuvintes;
    boolean recebePontosExtensores;
    boolean recebeSetasConectoras;
    String innerHTML;
    double x;
    double y;
    double height;
    double width;
    String rotate;

    public ComponenteJSON() {}

    public ComponenteJSON(
            int idAba,
            int idComponente,
            String nomeComponente,
            List<String> classes,
            List<Integer> idsOuvintes,
            boolean recebePontosExtensores,
            boolean recebeSetasConectoras,
            String innerHTML,
            double x,
            double y,
            double height,
            double width,
            String rotate) {
        this.idAba = idAba;
        this.idComponente = idComponente;
        this.nomeComponente = nomeComponente;
        this.classes = classes;
        this.idsOuvintes = idsOuvintes;
        this.recebePontosExtensores = recebePontosExtensores;
        this.recebeSetasConectoras = recebeSetasConectoras;
        this.innerHTML = innerHTML;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.rotate = rotate;
    }

    @Override
    public String toXHTML() {

        return "<div " + "%s=\"%d\" ".formatted(PROPRIEDADE_ID_ABA, idAba)
                + "%s=\"%d\" ".formatted(PROPRIEDADE_ID_COMPONENTE, idComponente)
                + "%s=\"%s\" ".formatted(PROPRIEDADE_IDS_OUVINTES, Arrays.toString(idsOuvintes.toArray()))
                + "%s=\"%s\" ".formatted(PROPRIEDADE_NOME_COMPONENTE, nomeComponente)
                + "%s=\"%b\" ".formatted(PROPRIEDADE_RECEBE_PONTOS_EXTENSORES, recebePontosExtensores)
                + "%s=\"%b\" ".formatted(PROPRIEDADE_RECEBE_SETAS_CONECTORAS, recebeSetasConectoras)
                + "class=\"%s\" ".formatted(String.join(" ", classes))
                + "style=\""
                + "left=%fpx ".formatted(x).replace(",", ".")
                + "top=%fpx; ".formatted(y).replace(",", ".")
                + "height=%fpx; ".formatted(height).replace(",", ".")
                + "width=%fpx; ".formatted(width).replace(",", ".")
                + "rotate=%s ".formatted(rotate)
                + "\" >"
                + innerHTML
                + "</div>%n".formatted();
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

    public List<String> getClasses() {
        return classes;
    }

    public void setClasses(List<String> classes) {
        this.classes = classes;
    }

    public List<Integer> getIdsOuvintes() {
        return idsOuvintes;
    }

    public void setIdsOuvintes(List<Integer> idsOuvintes) {
        this.idsOuvintes = idsOuvintes;
    }

    public boolean isRecebePontosExtensores() {
        return recebePontosExtensores;
    }

    public void setRecebePontosExtensores(boolean recebePontosExtensores) {
        this.recebePontosExtensores = recebePontosExtensores;
    }

    public boolean isRecebeSetasConectoras() {
        return recebeSetasConectoras;
    }

    public void setRecebeSetasConectoras(boolean recebeSetasConectoras) {
        this.recebeSetasConectoras = recebeSetasConectoras;
    }

    public String getInnerHTML() {
        return innerHTML;
    }

    public void setInnerHTML(String innerHTML) {
        this.innerHTML = innerHTML;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public String getRotate() {
        return rotate;
    }

    public void setRotate(String rotate) {
        this.rotate = rotate;
    }
}
