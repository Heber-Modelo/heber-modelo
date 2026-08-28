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
}
