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

import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UsuarioDetailsService implements UserDetailsService {

    private final IUsuarioRepositorio repositorio;

    public UsuarioDetailsService(IUsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public UserDetails loadUserByUsername(String identification) throws UsernameNotFoundException {
        Optional<Usuario> optionalUsuario = repositorio.findUsuarioByNome(identification);

        if (optionalUsuario.isEmpty()) {
            optionalUsuario = repositorio.findUsuarioByEmail(identification);
        }

        if (optionalUsuario.isEmpty()) {
            try {
                long matricula = Long.parseLong(identification);
                optionalUsuario = repositorio.findUsuarioByMatricula(matricula);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        if (optionalUsuario.isEmpty()) {
            return null;
        }

        Usuario usuario = optionalUsuario.get();
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        if (usuario.getTipo().equals("P")) {
            authorities.add(new SimpleGrantedAuthority("PROFESSOR"));
        }

        authorities.add(new SimpleGrantedAuthority("ESTUDANTE"));
        return new User(usuario.getNome(), usuario.getSenha(), authorities);
    }
}
