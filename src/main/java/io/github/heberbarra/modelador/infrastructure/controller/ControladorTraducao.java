/*
 * Copyright (c) 2025. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *   https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.model.MensagemTraduzidaDTO;
import io.github.heberbarra.modelador.infrastructure.assembler.TraducaoModelAssembler;
import org.jspecify.annotations.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorTraducao {

    private final TraducaoModelAssembler assembler;

    public ControladorTraducao(TraducaoModelAssembler assembler) {
        this.assembler = assembler;
    }

    @RequestMapping("traducao/{chave}")
    public EntityModel<@NonNull MensagemTraduzidaDTO> mensagemTraduzida(@PathVariable String chave) {
        String mensagem = TradutorWrapper.tradutor.traduzirMensagem(chave);
        MensagemTraduzidaDTO mensagemTraduzidaDTO = new MensagemTraduzidaDTO(chave, mensagem);

        return assembler.toModel(mensagemTraduzidaDTO);
    }
}
