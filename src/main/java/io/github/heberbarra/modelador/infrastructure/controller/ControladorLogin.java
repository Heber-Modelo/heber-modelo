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

import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.AUTORIZADO;
import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.ESPERANDO;
import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorTokenTrocarSenha.VERIFICAR_TOKEN_TROCAR_SENHA_HEADER;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.exception.UsuarioNotFoundException;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.dto.RedefinirSenhaDTO;
import io.github.heberbarra.modelador.domain.model.dto.SolicitarTrocarSenhaDTO;
import io.github.heberbarra.modelador.domain.model.dto.UsuarioDTO;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessaoEstudante;
import io.github.heberbarra.modelador.infrastructure.services.UsuarioServices;
import java.util.Objects;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ControladorLogin {
    private static final Logger logger = JavaLogger.obterLogger(ControladorLogin.class.getName());
    private final PasswordEncoder passwordEncoder;
    private final IUsuarioRepositorio usuarioRepositorio;
    private final UsuarioServices usuarioServices;

    public ControladorLogin(
            PasswordEncoder passwordEncoder, IUsuarioRepositorio usuarioRepositorio, UsuarioServices usuarioServices) {
        this.passwordEncoder = passwordEncoder;
        this.usuarioRepositorio = usuarioRepositorio;
        this.usuarioServices = usuarioServices;
    }

    @GetMapping({"/cadastro", "/cadastro.html"})
    public String cadastro(ModelMap modelMap) {
        if (ControladorSessao.isSessaoInativa()) {
            return "redirect:/entrarSessao";
        }

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
        if (ControladorSessao.isSessaoInativa()) {
            return "redirect:/entrarSessao";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "login");
        InjetorAtributos.injetarPaleta(modelMap);
        modelMap.addAttribute("isProfessor", DataSourceBuilder.isProfessor());

        if (userDetails == null) return "login";

        return "redirect:/";
    }

    @RequestMapping({"perfil", "perfil.html"})
    public String perfil(@AuthenticationPrincipal UserDetails userDetails, ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "profile");
        InjetorAtributos.injetarPaleta(modelMap);

        modelMap.addAttribute("usuario", usuarioServices.findUserByNome(userDetails.getUsername()));

        return "perfil";
    }

    @RequestMapping("/perfil/{matricula}")
    public String perfil(@PathVariable("matricula") String matricula, ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "profile");
        InjetorAtributos.injetarPaleta(modelMap);

        if (!DataSourceBuilder.isProfessor()) {
            return "redirect:/perfil";
        }

        Usuario usuario = usuarioServices.findUserByMatricula(matricula);

        if (usuario == null) {
            throw new UsuarioNotFoundException(matricula);
        }

        modelMap.addAttribute("usuario", usuario);

        return "perfil";
    }

    @GetMapping({"/redefinir", "/redefinir.html"})
    public String redefinirSenha(ModelMap modelMap) {
        if (ControladorSessao.isSessaoInativa()) {
            return "redirect:/entrarSessao";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "reset-password");
        InjetorAtributos.injetarPaleta(modelMap);
        modelMap.addAttribute("usuario", new RedefinirSenhaDTO());

        return "redefinir";
    }

    @PostMapping("/redefinir")
    public String redefinirSenha(@ModelAttribute("usuario") RedefinirSenhaDTO redefinirSenhaDTO) {
        Usuario usuario = usuarioServices.findUserByNome(redefinirSenhaDTO.getUsername());

        if (usuario == null) {
            usuario = usuarioServices.findUserByEmail(redefinirSenhaDTO.getUsername());
        }

        if (usuario == null) {
            usuario = usuarioServices.findUserByMatricula(redefinirSenhaDTO.getUsername());
        }

        if (usuario == null) {
            return "redirect:/redefinir?userNotFound";
        }

        if (!Objects.equals(redefinirSenhaDTO.getSenhaNova(), redefinirSenhaDTO.getConfirmarSenha())) {
            return "redirect:/redefinir?mismatch";
        }

        usuario.setSenha(passwordEncoder.encode(redefinirSenhaDTO.getSenhaNova()));
        usuarioRepositorio.save(usuario);

        return "redirect:/login?passwordChangeSuccess";
    }

    @GetMapping({"/solicitar", "/solicitar.html"})
    public String solicitarNovaSenha(ModelMap modelMap) {
        if (ControladorSessao.isSessaoInativa()) {
            return "redirect:/entrarSessao";
        }

        if (DataSourceBuilder.isProfessor()) {
            return "redirect:/redefinir";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "request-password-change");
        InjetorAtributos.injetarPaleta(modelMap);

        return "solicitar";
    }

    @PostMapping("/solicitar")
    public ResponseEntity<HttpStatus> solicitarNovaSenha(@RequestBody SolicitarTrocarSenhaDTO solicitarTrocarSenhaDTO) {
        if (ControladorSessao.getRoteador() instanceof RoteadorSessaoEstudante roteador) {
            RoteadorSessaoEstudante.setDados(solicitarTrocarSenhaDTO.getToken());
            RoteadorSessaoEstudante.setHeaderDados(VERIFICAR_TOKEN_TROCAR_SENHA_HEADER);

            while (roteador.getEstadoTrocarSenha() == ESPERANDO) {
                try {
                    //noinspection BusyWait
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    logger.warning(e.getMessage());
                }
            }

            if (roteador.getEstadoTrocarSenha() == AUTORIZADO) {
                roteador.setEstadoTrocarSenha(ESPERANDO);
                return ResponseEntity.ok().build();
            }
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
