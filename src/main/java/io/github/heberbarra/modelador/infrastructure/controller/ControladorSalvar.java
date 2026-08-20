package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.model.json.DiagramasJSON;
import java.util.logging.Logger;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorSalvar {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSalvar.class.toString());

    @PostMapping({"/salvar"})
    public void salvar(@RequestBody DiagramasJSON diagramas) {
        logger.info(diagramas.toString());
        logger.info(diagramas.getCreationDate().toString());
    }
}
