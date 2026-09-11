/*
 * Copyright (C) 2025 Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *   https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.domain.model.json;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Utilizado para mapear uma resposta HTTP para uma classe.
 *
 * @since v0.0.3-SNAPSHOT
 */
public class JsonRespostaHttp {

    private String name;
    private Map<String, Object> outrosAtributos;

    public JsonRespostaHttp() {
        outrosAtributos = new LinkedHashMap<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Object> getOutrosAtributos() {
        return outrosAtributos;
    }

    public void setOutrosAtributos(Map<String, Object> outrosAtributos) {
        this.outrosAtributos = outrosAtributos;
    }

    @JsonAnySetter
    public void setAtributo(String chave, Object valor) {
        outrosAtributos.put(chave, valor);
    }
}
