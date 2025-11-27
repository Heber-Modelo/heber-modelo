/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.domain.repository;

import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAtividadeRepositorio extends JpaRepository<@NonNull Atividade, @NonNull Integer> {

    Atividade getAtividadeByCodigo(int codigo);

    Atividade getAtividadeByNome(String nome);

    List<Atividade> searchAtividadesByNomeContaining(String nome);

    List<Atividade> getAtividadesByUsuario(Usuario usuario);
}
