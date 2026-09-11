/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador.infrastructure.services;

import io.github.heberbarra.modelador.domain.model.UsuarioDTO;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioServices {

    private final IUsuarioRepositorio IUsuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServices(IUsuarioRepositorio IUsuarioRepositorio, PasswordEncoder passwordEncoder) {
        this.IUsuarioRepositorio = IUsuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
    }

    public void saveUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();

        usuario.setMatricula(usuarioDTO.getMatricula());
        usuario.setNome(usuarioDTO.getNome());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        usuario.setTipo(usuarioDTO.getTipo());

        IUsuarioRepositorio.save(usuario);
    }

    public Usuario findUserByMatricula(long matricula) {
        return IUsuarioRepositorio.findUsuarioByMatricula(matricula).orElse(null);
    }

    public Usuario findUserByEmail(String email) {
        return IUsuarioRepositorio.findUsuarioByEmail(email).orElse(null);
    }

    public Usuario findUserByNome(String nome) {
        return IUsuarioRepositorio.findUsuarioByNome(nome).orElse(null);
    }
}
