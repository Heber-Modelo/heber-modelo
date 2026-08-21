package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.util.logging.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorSalvar {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSalvar.class.toString());

    @PostMapping(path = {"/salvar"})
    public ResponseEntity<Object> salvar(@RequestBody @Validated DiagramasJSON diagramas) {

        logger.info(diagramas.toXHTML());

        return ResponseEntity.ok().build();
    }
}
