package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.nio.charset.StandardCharsets;
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
