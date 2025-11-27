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

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import io.github.heberbarra.modelador.domain.exception.UsuarioNotFoundException;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.assembler.UsuarioModelAssembler;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ControladorUsuarios {

    private final IUsuarioRepositorio repositorio;
    private final UsuarioModelAssembler assembler;

    public ControladorUsuarios(IUsuarioRepositorio repositorio, UsuarioModelAssembler assembler) {
        this.repositorio = repositorio;
        this.assembler = assembler;
    }

    @GetMapping("/usuarios")
    public CollectionModel<@NonNull EntityModel<@NonNull Usuario>> all() {
        List<EntityModel<@NonNull Usuario>> usuarios =
                repositorio.findAll().stream().map(assembler::toModel).toList();

        return CollectionModel.of(
                usuarios, linkTo(methodOn(ControladorUsuarios.class).all()).withSelfRel());
    }

    @GetMapping("/usuarios/{matricula}")
    public EntityModel<@NonNull Usuario> one(@PathVariable Long matricula) {
        Usuario usuario = repositorio
                .findUsuarioByMatricula(matricula)
                .orElseThrow(() -> new UsuarioNotFoundException(matricula));

        return assembler.toModel(usuario);
    }
}
