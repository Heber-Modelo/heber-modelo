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

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "component")
public class ComponenteXML {

    @XmlElement(name = "component-name", required = true)
    private String name;

    @XmlElement(name = "component-data", required = true)
    private String data;

    @XmlElement(name = "component-height", required = true)
    private Double height;

    @XmlElement(name = "component-width", required = true)
    private Double width;

    @XmlElement(name = "component-x", required = true)
    private Double x;

    @XmlElement(name = "component-y", required = true)
    private Double y;

    @XmlElement(name = "component-fontsize", required = true)
    private Double fontsize;

    public ComponenteXML() {}

    public ComponenteXML(String name, String data, Double height, Double width, Double x, Double y, Double fontsize) {
        this.name = name;
        this.data = data;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.fontsize = fontsize;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getFontsize() {
        return fontsize;
    }

    public void setFontsize(Double fontsize) {
        this.fontsize = fontsize;
    }
}
