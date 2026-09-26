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

import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.BLOQUEADO;
import static io.github.heberbarra.modelador.domain.router.Roteador.EstadosRoteador.ESPERANDO;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.ConfiguracaoSessao;
import io.github.heberbarra.modelador.domain.router.Roteador;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessao;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessaoEstudante;
import io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha;
import java.util.Optional;
import java.util.logging.Logger;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplicationShutdownHandlers;
import org.springframework.context.event.EventListener;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ControladorSessao {
    private static final Logger logger = JavaLogger.obterLogger(ControladorSessao.class.getName());
    private static Roteador roteador;
    private final TaskExecutor taskExecutor;

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
    public String criarSessao(@ModelAttribute("session-port") Integer porta, @ModelAttribute("password") String senha) {

        RoteadorSessao roteadorSessao = new RoteadorSessao(porta);
        VerificadorSenha verificadorSenha = new VerificadorSenha(senha);

        try {
            roteadorSessao.registrarFuncionalidade(
                    VerificadorSenha.VERIFICADOR_SENHA_HEADER,
                    verificadorSenha,
                    VerificadorSenha.class.getMethod("verificar", String.class));
            roteador = roteadorSessao;
            taskExecutor.execute(roteador);
        } catch (NoSuchMethodException e) {
            logger.severe(TradutorWrapper.tradutor
                    .traduzirMensagem("error.session.method.not-found")
                    .formatted(e.getMessage()));
        }

        return "redirect:/login";
    }

    @PostMapping({"/entrarSessao", "/entrarSessao.html"})
    public String entrarSessao(
            @ModelAttribute("ip") String ip,
            @ModelAttribute("session-port") Integer porta,
            @ModelAttribute("password") String senha) {

        RoteadorSessaoEstudante roteadorSessaoEstudante = new RoteadorSessaoEstudante(porta, ip, senha);
        roteador = roteadorSessaoEstudante;
        taskExecutor.execute(roteador);

        try {
            while (roteadorSessaoEstudante.getEstado().equals(ESPERANDO)) {
                //noinspection BusyWait
                Thread.sleep(200);
            }
        } catch (InterruptedException e) {
            logger.warning(e.getMessage());
        }

        if (roteadorSessaoEstudante.getEstado().equals(BLOQUEADO)) {
            roteador = null;

            return "redirect:/entrarSessao";
        } else {
            return "redirect:/login";
        }
    }

    @RequestMapping({"/configurarSessao", "/configurarSessao.html"})
    public String configurarSessao(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "session-configuration");
        InjetorAtributos.injetarPaleta(modelMap);

        ConfiguracaoSessao configuracaoSessao = SessaoFactory.getSessao().configuracaoSessao();
        modelMap.addAttribute("configuracao", configuracaoSessao);

        return "configurarSessao";
    }

    @GetMapping("/verificarEstadoSessao")
    @ResponseBody
    public @Nullable ResponseEntity<String> verificarEstadoSessao() {
        Optional<String> estadoRoteador = roteador == null
                ? Optional.empty()
                : Optional.of(roteador.getEstado().toString().replace("\"", ""));

        return ResponseEntity.of(estadoRoteador);
    }

    @EventListener(SpringApplicationShutdownHandlers.class)
    @PostMapping("/encerrarSessao")
    private ResponseEntity<HttpStatus> finalizarSessao() {
        SessaoFactory.closeSocket();

        return ResponseEntity.ok().build();
    }

    public static boolean isSessaoInativa() {
        return roteador == null;
    }
}
