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

package io.github.heberbarra.modelador.infrastructure.controller;

import io.github.heberbarra.modelador.domain.model.AtividadeDTO;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.services.AtividadeServices;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorAtividades {

    private final AtividadeServices atividadeServices;

    public ControladorAtividades(AtividadeServices atividadeServices) {
        this.atividadeServices = atividadeServices;
    }

    @PostMapping({"criarAtividade"})
    public String criarAtividade(@RequestBody AtividadeDTO atividadeDTO) {
        this.atividadeServices.saveAtividade(atividadeDTO);

        return "redirect:/listagemEstudantes";
    }
}
