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

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.model.xhtml.XHTMLConvertable;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorRecursos;
import io.github.heberbarra.modelador.infrastructure.acessador.IAcessadorRecurso;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import org.jspecify.annotations.NonNull;

public class DiagramasJSON implements XHTMLConvertable {
    private static final Logger logger = JavaLogger.obterLogger(DiagramasJSON.class.toString());
    private final IAcessadorRecurso acessadorRecurso;
    LocalDateTime creationDate;
    List<String> loadedCSSFiles;
    List<String> types;

    List<ComponenteJSON> components;
    List<DescricaoRelacionalJSON> relationalDescriptions;
    List<DicionarioDadosJSON> dataDictionaries;

    public DiagramasJSON() {
        acessadorRecurso = new AcessadorRecursos();
    }

    public DiagramasJSON(
            LocalDateTime creationDate,
            List<String> loadedCSSFiles,
            List<String> types,
            List<ComponenteJSON> components,
            List<DescricaoRelacionalJSON> relationalDescriptions,
            List<DicionarioDadosJSON> dataDictionaries) {
        acessadorRecurso = new AcessadorRecursos();

        this.creationDate = creationDate;
        this.loadedCSSFiles = loadedCSSFiles;
        this.types = types;
        this.components = components;
        this.relationalDescriptions = relationalDescriptions;
        this.dataDictionaries = dataDictionaries;
    }

    @Override
    public String toXHTML() {
        StringBuilder builder = new StringBuilder();
        builder.append("<!DOCTYPE html>");
        builder.append("%n<html xml:lang=\"en\" xmlns=\"https://www.w3.org/1999/xhtml\" >%n<head>%n".formatted());
        builder.append(
                "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />%n".formatted());
        builder.append(
                "<meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\" />%n"
                        .formatted());
        builder.append("<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />%n".formatted());
        builder.append("<title>Heber-Modelo</title>%n".formatted());

        Map<String, String> variaveisPaleta = ConfiguradorFactory.build().pegarInformacoesPaleta();
        builder.append("<style type=\"text/css\" >%n:root{".formatted());
        for (String nomeVariavel : variaveisPaleta.keySet()) {
            builder.append("--%s: %s;".formatted(nomeVariavel, variaveisPaleta.get(nomeVariavel)));
        }
        ;
        builder.append("}%n</style>%n".formatted());

        for (String cssFile : this.loadedCSSFiles) {
            builder.append("<style>%s</style>%n".formatted(this.loadCSSData(cssFile)));
        }

        builder.append("</head>%n<body>%n".formatted());

        String isoDate = DateTimeFormatter.ISO_DATE_TIME.format(this.creationDate);
        builder.append("<div style=\"display: none\" id=\"creation-datetime\">%s</div>%n".formatted(isoDate));

        builder.append("<div style=\"display: none;\" id=\"types\" >[");
        for (int i = 0; i < this.types.size(); i++) {
            if (i != types.size() - 1) {
                builder.append("%s, ".formatted(types.get(i)));
                continue;
            }

            builder.append(types.get(i));
        }
        builder.append("]</div>%n".formatted());

        for (ComponenteJSON componenteJSON : this.components) {
            builder.append(componenteJSON.toXHTML());
        }

        for (DescricaoRelacionalJSON relationalDescription : this.relationalDescriptions) {
            builder.append(relationalDescription.toXHTML());
        }

        for (DicionarioDadosJSON dataDictionary : this.dataDictionaries) {
            builder.append(dataDictionary.toXHTML());
        }

        builder.append("</body>%n</html>%n".formatted());

        return builder.toString();
    }

    private @NonNull String loadCSSData(String cssFile) {
        File file = this.acessadorRecurso.pegarArquivoRecurso("static/css/elementos/%s".formatted(cssFile));
        StringBuilder builder = new StringBuilder();

        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
            List<String> lines = bufferedReader.readAllLines();
            for (String line : lines) {
                builder.append(line);
            }
        } catch (IOException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.file.read")
                    .formatted(file.getPath(), e.getMessage()));
        }

        return builder.toString();
    }
}
