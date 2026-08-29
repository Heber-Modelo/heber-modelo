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
import io.github.heberbarra.modelador.domain.model.json.DescricaoRelacionalJSON;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import io.github.heberbarra.modelador.domain.model.json.DicionarioDadosJSON;
import java.nio.charset.StandardCharsets;
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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.ObjectWriter;

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
        LocalDateTime creationDateTime = LocalDateTime.now();

        if (creationDatetimeElement.isPresent()) {
            String dateTimeString = creationDatetimeElement.get().text();
            creationDateTime = LocalDateTime.from(DateTimeFormatter.ISO_DATE_TIME.parse(dateTimeString));
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
            String rotation = partesEstilo.get(4);

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
                    rotation));
        }

        Elements relationalDescriptionElements =
                parsedXHTML.getElementsByAttributeValue(PROPRIEDADE_NOME_COMPONENTE, "editor_descricao_relacional");
        List<DescricaoRelacionalJSON> descricoesRelacionaisJSON = new ArrayList<>();

        for (Element relationalDescriptionElement : relationalDescriptionElements) {
            int idAba = Integer.parseInt(relationalDescriptionElement.attr(PROPRIEDADE_ID_ABA));
            int idComponente = Integer.parseInt(relationalDescriptionElement.attr(PROPRIEDADE_ID_COMPONENTE));
            String nomeComponente = relationalDescriptionElement.attr(PROPRIEDADE_NOME_COMPONENTE);
            String descricaoHTML = relationalDescriptionElement.html();

            descricoesRelacionaisJSON.add(
                    new DescricaoRelacionalJSON(idAba, idComponente, nomeComponente, descricaoHTML));
        }

        Elements dataDictionariesElements =
                parsedXHTML.getElementsByAttributeValue(PROPRIEDADE_NOME_COMPONENTE, "tabela_dicionario");
        List<DicionarioDadosJSON> dicionariosDadosJSONS = new ArrayList<>();

        for (Element dataDictionaryElement : dataDictionariesElements) {
            int idAba = Integer.parseInt(dataDictionaryElement.attr(PROPRIEDADE_ID_ABA));
            int idComponente = Integer.parseInt(dataDictionaryElement.attr(PROPRIEDADE_ID_COMPONENTE));
            String nomeComponente = dataDictionaryElement.attr(PROPRIEDADE_NOME_COMPONENTE);

            Optional<Element> captionElement = Optional.ofNullable(dataDictionaryElement.selectFirst("caption"));
            String nomeEntidade = "";

            if (captionElement.isPresent()) {
                nomeEntidade = captionElement.get().text();
            }

            //noinspection DuplicatedCode
            List<String> atributos = new ArrayList<>();
            List<String> descricoes = new ArrayList<>();
            List<String> tipos = new ArrayList<>();
            List<String> tamanhos = new ArrayList<>();
            //noinspection DuplicatedCode
            List<String> nulos = new ArrayList<>();
            List<String> regras = new ArrayList<>();
            List<String> chaves = new ArrayList<>();
            List<String> defaults = new ArrayList<>();
            List<String> unicos = new ArrayList<>();

            Elements tableRows = dataDictionaryElement.select("tbody tr");
            for (Element row : tableRows) {
                Elements cells = row.select("p");
                atributos.add(cells.getFirst().text());
                descricoes.add(cells.get(1).text());
                tipos.add(cells.get(2).text());
                tamanhos.add(cells.get(3).text());
                nulos.add(cells.get(4).text());
                regras.add(cells.get(5).text());
                chaves.add(cells.get(6).text());
                defaults.add(cells.get(7).text());
                unicos.add(cells.get(8).text());
            }

            dicionariosDadosJSONS.add(new DicionarioDadosJSON(
                    idAba,
                    idComponente,
                    nomeComponente,
                    nomeEntidade,
                    atributos,
                    descricoes,
                    tipos,
                    tamanhos,
                    nulos,
                    regras,
                    chaves,
                    defaults,
                    unicos));
        }

        DiagramasJSON diagramasJSON = new DiagramasJSON(
                creationDateTime,
                cssFiles,
                types,
                tabs,
                componentesJSON,
                descricoesRelacionaisJSON,
                dicionariosDadosJSONS);

        ObjectWriter objectWriter = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String jsonContent = objectWriter.writeValueAsString(diagramasJSON);

        HttpHeaders headers = new HttpHeaders();
        ByteArrayResource jsonResource = new ByteArrayResource(jsonContent.getBytes(StandardCharsets.UTF_8));

        headers.setContentDisposition(ContentDisposition.attachment().build());
        headers.setContentLength(jsonResource.contentLength());
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(jsonResource.contentLength())
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonResource);
    }
}
