/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import io.github.heberbarra.modelador.domain.exception.AtividadeNotFoundException;
import io.github.heberbarra.modelador.domain.model.dto.AtividadeDTO;
import io.github.heberbarra.modelador.domain.repository.IAtividadeRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorRestAtividades {

    private final IAtividadeRepositorio atividadeRepositorio;

    public ControladorRestAtividades(IAtividadeRepositorio atividadeRepositorio) {
        this.atividadeRepositorio = atividadeRepositorio;
    }

    @PostMapping("/atividade/{codigo}")
    public ResponseEntity<HttpStatus> atualizarAtividade(
            @RequestBody AtividadeDTO atividadeDTO, @PathVariable("codigo") int codigoAtividade) {

        try {
            Atividade atividade = this.atividadeRepositorio
                    .findAtividadeByCodigo(codigoAtividade)
                    .orElseThrow(() -> new AtividadeNotFoundException(codigoAtividade));

            atividade.setNome(atividadeDTO.getTitulo());
            atividade.setDescricao(atividadeDTO.getDescricao());
            atividade.setDataPostagem(atividadeDTO.getDataPostagem());
            atividade.setDataLimite(atividadeDTO.getDataLimite());
            atividade.setProva(atividadeDTO.isProva());

            this.atividadeRepositorio.saveAndFlush(atividade);
        } catch (AtividadeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/atividade/{codigo}")
    public ResponseEntity<HttpStatus> excluirAtividade(@PathVariable("codigo") int codigoAtividade) {

        try {
            Atividade atividade = this.atividadeRepositorio
                    .findAtividadeByCodigo(codigoAtividade)
                    .orElseThrow(() -> new AtividadeNotFoundException(codigoAtividade));
            this.atividadeRepositorio.delete(atividade);
        } catch (AtividadeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok().build();
    }
}
