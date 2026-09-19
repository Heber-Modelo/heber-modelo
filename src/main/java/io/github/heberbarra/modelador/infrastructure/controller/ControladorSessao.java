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

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.router.Roteador;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessao;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessaoEstudante;
import io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ControladorSessao {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSessao.class.getName());
    private final TaskExecutor taskExecutor;
    private Roteador roteador;

    public ControladorSessao(@Qualifier("applicationTaskExecutor") TaskExecutor taskExecutor) {
        this.taskExecutor = taskExecutor;
    }

    @GetMapping({"/criarSessao", "/criarSessao.html"})
    public String criarSessao(ModelMap modelMap) {

        if (!DataSourceBuilder.isProfessor()) {
            return "redirect:/entrarSessao";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "session-create");
        InjetorAtributos.injetarPaleta(modelMap);

        return "criarSessao";
    }

    @GetMapping({"/entrarSessao", "/entrarSessao.html"})
    public String entrarSessao(ModelMap modelMap) {

        if (DataSourceBuilder.isProfessor()) {
            return "redirect:/criarSessao";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "session-enter");
        InjetorAtributos.injetarPaleta(modelMap);

        return "entrarSessao";
    }

    @PostMapping({"/criarSessao", "/criarSessao.html"})
    public void criarSessao(@ModelAttribute("session-port") Integer porta, @ModelAttribute("password") String senha) {

        RoteadorSessao roteadorSessao = new RoteadorSessao(porta, senha);
        VerificadorSenha verificadorSenha = new VerificadorSenha(senha);

        try {
            roteadorSessao.registrarFuncionalidade(
                    VerificadorSenha.VERIFICADOR_SENHA_HEADER,
                    verificadorSenha,
                    VerificadorSenha.class.getMethod("verificar", String.class));
            this.roteador = roteadorSessao;
            taskExecutor.execute(this.roteador);
        } catch (NoSuchMethodException e) {
            logger.severe(e.getMessage());
        }
    }

    @PostMapping({"/entrarSessao", "/entrarSessao.html"})
    public void entrarSessao(
            @ModelAttribute("ip") String ip,
            @ModelAttribute("session-port") Integer porta,
            @ModelAttribute("password") String senha) {

        this.roteador = new RoteadorSessaoEstudante(porta, ip, senha);
        taskExecutor.execute(this.roteador);
    }

    @RequestMapping({"/configurarSessao", "/configurarSessao.html"})
    public String configurarSessao(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "session-configuration");
        InjetorAtributos.injetarPaleta(modelMap);

        return "configurarSessao";
    }
}
