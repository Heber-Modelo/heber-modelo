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

import java.util.List;

public class DicionarioDadosJSON {

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
}
