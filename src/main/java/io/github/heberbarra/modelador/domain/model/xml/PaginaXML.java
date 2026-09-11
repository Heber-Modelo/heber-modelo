/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.domain.model.xml;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "page")
public class PaginaXML {

    @XmlElement(name = "components", required = true)
    private List<ComponenteXML> componentes;

    public PaginaXML() {}

    public PaginaXML(List<ComponenteXML> componentes) {
        this.componentes = componentes;
    }

    public List<ComponenteXML> getComponentes() {
        return componentes;
    }

    public void setComponentes(List<ComponenteXML> componentes) {
        this.componentes = componentes;
    }
}
