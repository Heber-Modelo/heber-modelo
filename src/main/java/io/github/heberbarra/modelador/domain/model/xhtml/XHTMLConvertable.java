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

package io.github.heberbarra.modelador.domain.model.xhtml;

public interface XHTMLConvertable {
    String PROPRIEDADE_ID_ABA = "data-id-aba";
    String PROPRIEDADE_ID_COMPONENTE = "data-id";
    String PROPRIEDADE_IDS_OUVINTES = "data-ids-ouvintes";
    String PROPRIEDADE_NOME_COMPONENTE = "data-nome-componente";
    String PROPRIEDADE_RECEBE_PONTOS_EXTENSORES = "data-recebe-pontos-extensores";
    String PROPRIEDADE_RECEBE_SETAS_CONECTORAS = "data-recebe-setas-conectoras";

    String toXHTML();
}
