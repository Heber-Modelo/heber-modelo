/*
 * Copyright (c) 2025. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;
import java.time.LocalDate;
import java.util.List;

@XmlRootElement(name = "diagram", namespace = "https://github.com/HeberBarra/heber-modelo")
@XmlType(propOrder = {"creation-date", "last-modification", "authors", "types", "links", "pages"})
public class DiagramaXML {

    @XmlElement(name = "creation-date", required = true)
    private LocalDate creationDate;

    @XmlElement(name = "last-modification", required = true)
    private LocalDate lastModification;

    @XmlElement(name = "authors")
    private List<AutorXML> authors;

    @XmlElement(name = "types", required = true)
    private List<TiposDiagramaXML> types;

    @XmlElement(name = "links", required = true)
    private List<LinkXML> links;

    @XmlElement(name = "pages", required = true)
    private List<PaginaXML> paginas;

    public DiagramaXML() {}

    public DiagramaXML(
            LocalDate creationDate,
            LocalDate lastModification,
            List<AutorXML> authors,
            List<TiposDiagramaXML> types,
            List<LinkXML> links,
            List<PaginaXML> paginas) {
        this.creationDate = creationDate;
        this.lastModification = lastModification;
        this.authors = authors;
        this.types = types;
        this.links = links;
        this.paginas = paginas;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getLastModification() {
        return lastModification;
    }

    public void setLastModification(LocalDate lastModification) {
        this.lastModification = lastModification;
    }

    public List<AutorXML> getAuthors() {
        return authors;
    }

    public void setAuthors(List<AutorXML> authors) {
        this.authors = authors;
    }

    public List<TiposDiagramaXML> getTypes() {
        return types;
    }

    public void setTypes(List<TiposDiagramaXML> types) {
        this.types = types;
    }

    public List<LinkXML> getLinks() {
        return links;
    }

    public void setLinks(List<LinkXML> links) {
        this.links = links;
    }

    public List<PaginaXML> getPaginas() {
        return paginas;
    }

    public void setPaginas(List<PaginaXML> paginas) {
        this.paginas = paginas;
    }
}
