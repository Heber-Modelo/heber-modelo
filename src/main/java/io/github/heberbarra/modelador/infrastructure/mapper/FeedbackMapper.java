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

package io.github.heberbarra.modelador.infrastructure.mapper;

import io.github.heberbarra.modelador.domain.model.dto.AtividadeFeedbackDTO;
import io.github.heberbarra.modelador.domain.model.dto.FeedbackDTO;
import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import io.github.heberbarra.modelador.infrastructure.entity.Feedback;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import java.util.Optional;

public class FeedbackMapper {

    public static FeedbackDTO feedbackToDTO(Feedback feedback) {
        Optional<Usuario> professor = Optional.ofNullable(feedback.getProfessor());
        String matriculaProfessor = null;

        if (professor.isPresent()) {
            matriculaProfessor = professor.get().getMatricula();
        }

        return new FeedbackDTO(
                feedback.getCodigo(),
                feedback.getDescricao(),
                feedback.getAtividade().getCodigo(),
                feedback.getImagemAtividade(),
                feedback.getEstudante().getMatricula(),
                matriculaProfessor);
    }

    public static AtividadeFeedbackDTO feedbackToAtividadeFeedbackDTO(Feedback feedback) {
        Atividade atividade = feedback.getAtividade();
        Usuario estudante = feedback.getEstudante();

        return new AtividadeFeedbackDTO(
                feedback.getCodigo(),
                estudante.getMatricula(),
                estudante.getNome(),
                feedback.getAtividade().getNome(),
                feedback.getDataCriacao());
    }
}
