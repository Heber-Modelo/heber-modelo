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

package io.github.heberbarra.modelador.infrastructure.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import io.github.heberbarra.modelador.infrastructure.controller.ControladorUsuarios;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import org.jspecify.annotations.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class UsuarioModelAssembler
        implements RepresentationModelAssembler<@NonNull Usuario, @NonNull EntityModel<@NonNull Usuario>> {

    @Override
    @NonNull public EntityModel<@NonNull Usuario> toModel(@NonNull Usuario usuario) {
        return EntityModel.of(
                usuario,
                linkTo(methodOn(ControladorUsuarios.class).one(usuario.getMatricula()))
                        .withSelfRel(),
                linkTo(methodOn(ControladorUsuarios.class).all()).withRel("usuários"));
    }
}
