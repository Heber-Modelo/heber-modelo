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

package io.github.heberbarra.modelador.infrastructure.controller;

import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.CLASSE_BASE_COMPONENTE;
import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.PROPRIEDADE_IDS_OUVINTES;
import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.PROPRIEDADE_ID_COMPONENTE;
import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.PROPRIEDADE_NOME_COMPONENTE;
import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES;
import static io.github.heberbarra.modelador.domain.model.json.ComponenteJSON.PROPRIEDADE_RECEBE_SETAS_CONECTORAS;
import static io.github.heberbarra.modelador.domain.model.json.DiagramasJSON.CREATION_DATE_ID;
import static io.github.heberbarra.modelador.domain.model.json.DiagramasJSON.CSS_FILES_ID;
import static io.github.heberbarra.modelador.domain.model.json.DiagramasJSON.PROPRIEDADE_ID_ABA;
import static io.github.heberbarra.modelador.domain.model.json.DiagramasJSON.PROPRIEDADE_NOME_ABA;
import static io.github.heberbarra.modelador.domain.model.json.DiagramasJSON.TYPES_ID;

import io.github.heberbarra.modelador.domain.model.json.AbaJSON;
import io.github.heberbarra.modelador.domain.model.json.ComponenteJSON;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.jspecify.annotations.NonNull;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorImportar {

    private @NonNull List<String> createListFromElement(@NonNull Optional<Element> element) {
        if (element.isEmpty()) {
            return new ArrayList<>();
        }

        String text = element.get().text();
        return Arrays.stream(text.substring(1, text.length() - 1).split(","))
                .map(String::trim)
                .toList();
    }

    @PostMapping(path = "/importar", consumes = "text/xml", produces = "application/json")
    public ResponseEntity<Resource> importar(@RequestBody String textoXHTML) {
        Document parsedXHTML = Jsoup.parse(textoXHTML.replace("\\", ""));

        Optional<Element> creationDatetimeElement = Optional.ofNullable(parsedXHTML.getElementById(CREATION_DATE_ID));
        LocalDateTime dateTime = LocalDateTime.now();

        if (creationDatetimeElement.isPresent()) {
            String dateTimeString = creationDatetimeElement.get().text();
            dateTime = LocalDateTime.from(DateTimeFormatter.ISO_DATE_TIME.parse(dateTimeString));
        }

        List<String> cssFiles = createListFromElement(Optional.ofNullable(parsedXHTML.getElementById(CSS_FILES_ID)));
        List<String> types = createListFromElement(Optional.ofNullable(parsedXHTML.getElementById(TYPES_ID)));

        Elements tabsElements = parsedXHTML.getElementsByAttribute(PROPRIEDADE_NOME_ABA);
        List<AbaJSON> tabs = new ArrayList<>();

        if (!tabsElements.isEmpty()) {
            tabs = tabsElements.stream()
                    .map(tabElement -> {
                        String nome = tabElement.attr(PROPRIEDADE_NOME_ABA);
                        Integer id = Integer.parseInt(tabElement.attr(PROPRIEDADE_ID_ABA));

                        return new AbaJSON(id, nome);
                    })
                    .toList();
        }

        Elements components = parsedXHTML.getElementsByClass(CLASSE_BASE_COMPONENTE);
        List<ComponenteJSON> componentesJSON = new ArrayList<>();

        for (Element component : components) {
            int idAba = Integer.parseInt(component.attr(PROPRIEDADE_ID_ABA));
            int idComponente = Integer.parseInt(component.attr(PROPRIEDADE_ID_COMPONENTE));
            String nomeComponente = component.attr(PROPRIEDADE_NOME_COMPONENTE);

            List<String> classes = new ArrayList<>();
            String classesTexto = component.attr("class");

            if (classesTexto.length() > 2) {
                classes = Arrays.stream(classesTexto
                                .substring(1, classesTexto.length() - 1)
                                .split(" "))
                        .map(String::trim)
                        .toList();
            }

            List<Integer> idsOuvintes = new ArrayList<>();
            String idsOuvintesTexto = component.attr(PROPRIEDADE_IDS_OUVINTES);

            if (idsOuvintesTexto.length() > 2) {
                idsOuvintes = Arrays.stream(idsOuvintesTexto
                                .substring(1, idsOuvintesTexto.length() - 1)
                                .split(","))
                        .map(String::trim)
                        .map(Integer::parseInt)
                        .toList();
            }

            boolean recebePontosExtensores = Boolean.parseBoolean(component.attr(PROPRIEDADE_RECEBE_PONTOS_EXTENSORES));
            boolean recebeSetasConectoras = Boolean.parseBoolean(component.attr(PROPRIEDADE_RECEBE_SETAS_CONECTORAS));

            String innerHTML = component.html();

            String style = component.attr("style");
            List<String> partesEstilo = Arrays.stream(style.split(" "))
                    .map(parteEstilo -> parteEstilo.split("=")[1])
                    .toList();

            String pixelsLeft = partesEstilo.getFirst();
            String pixelsTop = partesEstilo.get(1);
            String pixelsHeight = partesEstilo.get(2);
            String pixelsWidth = partesEstilo.get(3);
            String rotate = partesEstilo.get(4).equals("none") ? "null" : partesEstilo.get(4);

            double x = Double.parseDouble(pixelsLeft.substring(0, pixelsLeft.length() - 2));
            double y = Double.parseDouble(pixelsTop.substring(0, pixelsTop.length() - 3));
            double height = Double.parseDouble(pixelsHeight.substring(0, pixelsHeight.length() - 3));
            double width = Double.parseDouble(pixelsWidth.substring(0, pixelsWidth.length() - 3));

            componentesJSON.add(new ComponenteJSON(
                    idAba,
                    idComponente,
                    nomeComponente,
                    classes,
                    idsOuvintes,
                    recebePontosExtensores,
                    recebeSetasConectoras,
                    innerHTML,
                    x,
                    y,
                    height,
                    width,
                    rotate));
        }

        DiagramasJSON diagramasJSON = new DiagramasJSON();
        diagramasJSON.setCreationDate(dateTime);
        diagramasJSON.setLoadedCSSFiles(cssFiles);
        diagramasJSON.setTypes(types);
        diagramasJSON.setTabs(tabs);
        diagramasJSON.setComponents(componentesJSON);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentDisposition(ContentDisposition.attachment().build());
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok().headers(headers).build();
    }
}
