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

import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.UsuarioDTO;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import io.github.heberbarra.modelador.infrastructure.services.UsuarioServices;
import java.util.regex.Pattern;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ControladorLogin {
    private final UsuarioServices usuarioServices;

    public ControladorLogin(UsuarioServices usuarioServices) {
        this.usuarioServices = usuarioServices;
    }

    @GetMapping({"/cadastro", "/cadastro.html"})
    public String cadastro(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "register");
        InjetorAtributos.injetarPaleta(modelMap);
        modelMap.addAttribute("usuario", new UsuarioDTO());

        return "cadastro";
    }

    @PostMapping({"/cadastro", "/cadastro.html"})
    public String cadastro(@ModelAttribute("usuario") UsuarioDTO usuarioDTO) {

        usuarioDTO.setTipo(DataSourceBuilder.getTipoUsuario());
        usuarioDTO.setNome(usuarioDTO.getNome().trim());
        usuarioDTO.setEmail(usuarioDTO.getEmail().trim());
        usuarioDTO.setSenha(usuarioDTO.getSenha().trim());
        usuarioDTO.setConfirmarSenha(usuarioDTO.getConfirmarSenha().trim());

        if (usuarioServices.findUserByMatricula(usuarioDTO.getMatricula()) != null
                || usuarioServices.findUserByNome(usuarioDTO.getNome()) != null
                || usuarioServices.findUserByEmail(usuarioDTO.getEmail()) != null) {
            return "redirect:/cadastro.html?exists";
        }

        if (!usuarioDTO.getSenha().equals(usuarioDTO.getConfirmarSenha())) {
            return "redirect:cadastro.html?mismatch";
        }

        Pattern regexEmail = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

        if (!regexEmail.matcher(usuarioDTO.getEmail()).matches()) {
            return "redirect:/cadastro.html?invalidEmail";
        }

        usuarioServices.saveUsuario(usuarioDTO);
        return "redirect:/login.html?cadastroSuccess";
    }

    @RequestMapping({"/login", "/login.html"})
    public String login(@AuthenticationPrincipal UserDetails userDetails, ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "login");
        InjetorAtributos.injetarPaleta(modelMap);

        if (userDetails == null) return "login";

        return "redirect:/";
    }

    @RequestMapping({"/perfil", "/perfil.html"})
    public String perfil(@AuthenticationPrincipal UserDetails userDetails, ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "profile");
        InjetorAtributos.injetarPaleta(modelMap);

        Usuario usuario = usuarioServices.findUserByNome(userDetails.getUsername());
        modelMap.addAttribute("usuario", usuario);

        return "perfil";
    }

    @RequestMapping({"/redefinir", "/redefinir.html"})
    public String redefinirSenha(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "reset-password");
        InjetorAtributos.injetarPaleta(modelMap);

        return "redefinir";
    }

    @RequestMapping({"solicitar", "solicitar.html"})
    public String solicitarNovaSenha(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "request-password-change");
        InjetorAtributos.injetarPaleta(modelMap);

        return "solicitar";
    }
}
