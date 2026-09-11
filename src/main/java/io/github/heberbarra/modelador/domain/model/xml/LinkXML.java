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
import java.net.URI;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "link")
public class LinkXML {

    @XmlElement(name = "name-component", required = true)
    private String nameComponent;

    @XmlElement(name = "uri-component", required = true)
    private URI uriComponent;

    public LinkXML() {}

    public LinkXML(String nameComponent, URI uriComponent) {
        this.nameComponent = nameComponent;
        this.uriComponent = uriComponent;
    }

    public String getNameComponent() {
        return nameComponent;
    }

    public void setNameComponent(String nameComponent) {
        this.nameComponent = nameComponent;
    }

    public URI getUriComponent() {
        return uriComponent;
    }

    public void setUriComponent(URI uriComponent) {
        this.uriComponent = uriComponent;
    }
}
