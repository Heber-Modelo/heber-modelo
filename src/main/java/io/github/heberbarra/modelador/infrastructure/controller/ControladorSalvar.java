package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.io.ByteArrayInputStream;
import java.util.logging.Logger;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public class ControladorSalvar {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSalvar.class.toString());

    @PostMapping(
            path = {"/salvar"},
            produces = "application/json")
    public ResponseEntity<InputStreamResource> salvar(@RequestBody DiagramasJSON diagramas) {
        diagramas.getComponents().forEach(component -> logger.info(component.getNomeComponente()));

        ObjectMapper mapper = new ObjectMapper();
        byte[] data = mapper.writeValueAsBytes(diagramas);

        return ResponseEntity.ok()
                .contentLength(data.length)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Content-Disposition", "attachment; filename=\"diagrama.json\"")
                .body(new InputStreamResource(new ByteArrayInputStream(data)));
    }
}
