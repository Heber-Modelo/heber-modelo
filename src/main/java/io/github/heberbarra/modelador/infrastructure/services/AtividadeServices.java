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

package io.github.heberbarra.modelador.infrastructure.services;

import io.github.heberbarra.modelador.domain.model.AtividadeDTO;
import io.github.heberbarra.modelador.domain.repository.IAtividadeRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AtividadeServices {

    private final IAtividadeRepositorio repositorio;

    public AtividadeServices(IAtividadeRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public void saveAtividade(@NonNull AtividadeDTO atividadeDTO) {
        Atividade atividade = new Atividade();

        atividade.setNome(atividadeDTO.getTitulo());
        atividade.setDescricao(atividadeDTO.getDescricao());
        atividade.setDataLimite(atividadeDTO.getDataLimite());
        atividade.setDataPostagem(atividadeDTO.getDataPostagem());
        atividade.setProva(atividadeDTO.isProva());

        this.repositorio.save(atividade);
    }
}
