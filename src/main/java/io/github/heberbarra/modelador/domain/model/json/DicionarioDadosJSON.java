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

import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.model.xhtml.XHTMLConvertable;
import java.util.List;
import org.jspecify.annotations.NonNull;

public class DicionarioDadosJSON implements XHTMLConvertable {

    int idAba;
    int idComponente;
    String nomeComponente;
    String nomeEntidade;

    List<String> atributos;
    List<String> descricoes;
    List<String> tipos;
    List<String> tamanhos;
    List<String> nulos;
    List<String> regras;
    List<String> chaves;
    List<String> defaults;
    List<String> unicos;

    public DicionarioDadosJSON() {}

    public DicionarioDadosJSON(
            int idAba,
            int idComponente,
            String nomeComponente,
            String nomeEntidade,
            List<String> atributos,
            List<String> descricoes,
            List<String> tipos,
            List<String> tamanhos,
            List<String> nulos,
            List<String> regras,
            List<String> chaves,
            List<String> defaults,
            List<String> unicos) {
        this.idAba = idAba;
        this.idComponente = idComponente;
        this.nomeComponente = nomeComponente;
        this.nomeEntidade = nomeEntidade;
        this.atributos = atributos;
        this.descricoes = descricoes;
        this.tipos = tipos;
        this.tamanhos = tamanhos;
        this.nulos = nulos;
        this.regras = regras;
        this.chaves = chaves;
        this.defaults = defaults;
        this.unicos = unicos;
    }

    @Override
    public String toXHTML() {

        String tableHeader = "<div " + "%s=\"%d\" ".formatted(PROPRIEDADE_ID_COMPONENTE, idComponente)
                + "%s=\"%d\"%n ".formatted(PROPRIEDADE_ID_ABA, idAba)
                + "%s=\"%s\" >%n".formatted(PROPRIEDADE_NOME_COMPONENTE, nomeComponente)
                + "<table>%n".formatted()
                + "<caption>%s</caption>%n".formatted(nomeEntidade)
                + "<thead>%n<tr>%n".formatted()
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(TradutorWrapper.tradutor.traduzirMensagem(
                                "element.property.default-name.attribute-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(TradutorWrapper.tradutor.traduzirMensagem(
                                "element.property.default-name.description-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(
                                TradutorWrapper.tradutor.traduzirMensagem("element.property.default-name.type-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(
                                TradutorWrapper.tradutor.traduzirMensagem("element.property.default-name.size-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(TradutorWrapper.tradutor.traduzirMensagem(
                                "element.property.default-name.nullable-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(
                                TradutorWrapper.tradutor.traduzirMensagem("element.property.default-name.check-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(TradutorWrapper.tradutor.traduzirMensagem("element.property.default-name.key-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(TradutorWrapper.tradutor.traduzirMensagem(
                                "element.property.default-name.default-label"))
                + "<th scope=\"col\">%s</th>%n"
                        .formatted(
                                TradutorWrapper.tradutor.traduzirMensagem("element.property.default-name.unique-label"))
                + "</tr>%n</thead>%n".formatted();

        StringBuilder builder = createBuilder(tableHeader);
        builder.append("</table>%n</div>%n".formatted());

        return builder.toString();
    }

    private @NonNull StringBuilder createBuilder(String tableHeader) {
        StringBuilder builder = new StringBuilder(tableHeader);

        builder.append("<tbody>%n".formatted());
        int rowNumber = descricoes.size();
        for (int i = 0; i < rowNumber; i++) {
            builder.append("<tr>%n".formatted());
            builder.append("<th scope=\"row\"><p>%s</p></th>%n".formatted(atributos.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(descricoes.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(tipos.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(tamanhos.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(nulos.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(regras.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(chaves.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(defaults.get(i)));
            builder.append("<td><p>%s</p></td>%n".formatted(unicos.get(i)));
            builder.append("</tr>%n".formatted());
        }
        builder.append("</tbody>%n".formatted());

        return builder;
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

    public String getNomeEntidade() {
        return nomeEntidade;
    }

    public void setNomeEntidade(String nomeEntidade) {
        this.nomeEntidade = nomeEntidade;
    }

    public List<String> getAtributos() {
        return atributos;
    }

    public void setAtributos(List<String> atributos) {
        this.atributos = atributos;
    }

    public List<String> getDescricoes() {
        return descricoes;
    }

    public void setDescricoes(List<String> descricoes) {
        this.descricoes = descricoes;
    }

    public List<String> getTipos() {
        return tipos;
    }

    public void setTipos(List<String> tipos) {
        this.tipos = tipos;
    }

    public List<String> getTamanhos() {
        return tamanhos;
    }

    public void setTamanhos(List<String> tamanhos) {
        this.tamanhos = tamanhos;
    }

    public List<String> getNulos() {
        return nulos;
    }

    public void setNulos(List<String> nulos) {
        this.nulos = nulos;
    }

    public List<String> getRegras() {
        return regras;
    }

    public void setRegras(List<String> regras) {
        this.regras = regras;
    }

    public List<String> getChaves() {
        return chaves;
    }

    public void setChaves(List<String> chaves) {
        this.chaves = chaves;
    }

    public List<String> getDefaults() {
        return defaults;
    }

    public void setDefaults(List<String> defaults) {
        this.defaults = defaults;
    }

    public List<String> getUnicos() {
        return unicos;
    }

    public void setUnicos(List<String> unicos) {
        this.unicos = unicos;
    }
}
