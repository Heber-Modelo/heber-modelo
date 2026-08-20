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

import java.time.LocalDateTime;
import java.util.List;

public class DiagramasJSON {

    LocalDateTime creationDate;
    List<String> types;

    List<ComponenteJSON> components;
    List<DescricaoRelacionalJSON> relationalDescriptions;
    List<DicionarioDadosJSON> dataDictionaries;

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public List<String> getTypes() {
        return types;
    }

    public List<ComponenteJSON> getComponents() {
        return components;
    }

    public List<DescricaoRelacionalJSON> getRelationalDescriptions() {
        return relationalDescriptions;
    }

    public List<DicionarioDadosJSON> getDataDictionaries() {
        return dataDictionaries;
    }
}
