package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.application.conversor.ConversorDiagramaXML;
import io.github.heberbarra.modelador.domain.model.xml.DiagramaXML;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;

public class ControladorDiagramaXML {
    private final ConversorDiagramaXML conversor = new ConversorDiagramaXML();
    private File ultimoArquivo;

    @PostMapping("/salvar")
    public ResponseEntity<Void> salvar(@RequestBody DiagramaXML diagrama) throws Exception {
        ultimoArquivo = conversor.salvar(diagrama);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exportar")
    public ResponseEntity<FileSystemResource> exportar() {

        if (ultimoArquivo == null || !ultimoArquivo.exists()) {
            return ResponseEntity.notFound().build();
        }

        FileSystemResource resource = new FileSystemResource(ultimoArquivo);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"diagram.xml\"")
                .contentType(MediaType.APPLICATION_XML)
                .body(resource);
    }
}
