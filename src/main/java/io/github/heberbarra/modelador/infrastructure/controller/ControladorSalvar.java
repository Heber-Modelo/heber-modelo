package io.github.heberbarra.modelador.infrastructure.controller;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorSalvar {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSalvar.class.toString());

    @PostMapping(
            path = {"/exportar"},
            produces = "application/pdf")
    public ResponseEntity<Resource> exportar(@RequestBody @Validated DiagramasJSON diagramas) {
        String xhtmlData = diagramas.toXHTML();
        Document parsedDocument = Jsoup.parse(xhtmlData);
        parsedDocument.outputSettings().syntax(Document.OutputSettings.Syntax.xml);

        String outputPDF = "diagrama.pdf";
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withUri(outputPDF);
            builder.toStream(outputStream);
            builder.withW3cDocument(new W3CDom().fromJsoup(parsedDocument), "/");
            builder.run();

            byte[] dados = outputStream.toByteArray();
            HttpHeaders headers = new HttpHeaders();

            headers.setContentDisposition(ContentDisposition.attachment().build());
            headers.setContentLength(dados.length);
            headers.setContentType(MediaType.APPLICATION_PDF);

            ByteArrayResource resource = new ByteArrayResource(dados);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(dados.length)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (IOException e) {
            logger.warning(
                    TradutorWrapper.tradutor.traduzirMensagem("error.file.read").formatted(e.getMessage()));
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping(
            path = {"/salvar"},
            produces = "application/xhtml+xml")
    public ResponseEntity<Resource> salvar(@RequestBody @Validated DiagramasJSON diagramas) {
        String xhtmlData = diagramas.toXHTML();
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_XHTML_XML);
        headers.setContentDisposition(ContentDisposition.attachment().build());
        headers.setContentLength(xhtmlData.length());

        ByteArrayResource resource = new ByteArrayResource(xhtmlData.getBytes(StandardCharsets.UTF_8));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(xhtmlData.length())
                .contentType(MediaType.APPLICATION_XHTML_XML)
                .body(resource);
    }
}
