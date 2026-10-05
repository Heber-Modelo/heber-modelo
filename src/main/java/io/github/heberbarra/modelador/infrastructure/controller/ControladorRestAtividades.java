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
import io.github.heberbarra.modelador.domain.exception.UsuarioNotFoundException;
import io.github.heberbarra.modelador.domain.model.dto.AtividadeDTO;
import io.github.heberbarra.modelador.domain.repository.IAtividadeRepositorio;
import io.github.heberbarra.modelador.domain.repository.IFeedbackRepositorio;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import io.github.heberbarra.modelador.infrastructure.entity.Feedback;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorRestAtividades {

    private final IAtividadeRepositorio atividadeRepositorio;
    private final IFeedbackRepositorio feedbackRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;

    public ControladorRestAtividades(
            IAtividadeRepositorio atividadeRepositorio,
            IFeedbackRepositorio feedbackRepositorio,
            IUsuarioRepositorio usuarioRepositorio) {
        this.atividadeRepositorio = atividadeRepositorio;
        this.feedbackRepositorio = feedbackRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
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

    @PostMapping("/enviarAtividade")
    public ResponseEntity<HttpStatus> enviarAtividade(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("codigoAtividade") int codigoAtividade,
            @RequestParam("imagens") List<String> imagens) {
        Atividade atividade = atividadeRepositorio
                .findAtividadeByCodigo(codigoAtividade)
                .orElseThrow(() -> new AtividadeNotFoundException(codigoAtividade));
        Usuario estudante = usuarioRepositorio
                .findUsuarioByNome(userDetails.getUsername())
                .orElseThrow(() -> new UsuarioNotFoundException(userDetails.getUsername()));

        Feedback novoFeedback;
        LocalDateTime momentoAtual = LocalDateTime.now();
        for (String dataURL : imagens) {
            novoFeedback = new Feedback();
            novoFeedback.setDataCriacao(momentoAtual);
            novoFeedback.setAtividade(atividade);
            novoFeedback.setEstudante(estudante);
            novoFeedback.setImagemAtividade(dataURL);

            feedbackRepositorio.save(novoFeedback);
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
