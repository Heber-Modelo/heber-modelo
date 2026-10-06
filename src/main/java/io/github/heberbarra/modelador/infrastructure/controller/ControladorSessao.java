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
import static io.github.heberbarra.modelador.infrastructure.acessador.AcessadorSegundosTimeoutTeste.ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER;
import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha.VERIFICADOR_SENHA_HEADER;
import static io.github.heberbarra.modelador.infrastructure.verificador.VerificadorTokenTrocarSenha.VERIFICAR_TOKEN_TROCAR_SENHA_HEADER;

import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.application.usecase.gerar.GeradorToken;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.ConfiguracaoSessao;
import io.github.heberbarra.modelador.domain.router.Roteador;
import io.github.heberbarra.modelador.infrastructure.acessador.AcessadorSegundosTimeoutTeste;
import io.github.heberbarra.modelador.infrastructure.data.DataSourceBuilder;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import io.github.heberbarra.modelador.infrastructure.factory.SessaoFactory;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessao;
import io.github.heberbarra.modelador.infrastructure.router.RoteadorSessaoEstudante;
import io.github.heberbarra.modelador.infrastructure.verificador.VerificadorSenha;
import io.github.heberbarra.modelador.infrastructure.verificador.VerificadorTokenTrocarSenha;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.ServerSocket;
import java.util.logging.Logger;
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

@Controller
public class ControladorSessao {
    public static final String TOKEN_TROCAR_SENHA;
    private static final Logger logger = JavaLogger.obterLogger(ControladorSessao.class.getName());
    private static ConfiguracaoSessao configuracaoSessao;
    private static Roteador roteador;
    private final TaskExecutor taskExecutor;

    static {
        GeradorToken geradorToken = new GeradorToken();
        geradorToken.gerarToken();
        TOKEN_TROCAR_SENHA = geradorToken.getToken().substring(0, 6);
    }

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

        taskExecutor.execute(() -> {
            IConfigurador configurador = ConfiguradorFactory.build();
            configuracaoSessao = new ConfiguracaoSessao(configurador
                    .pegarValorConfiguracao("prova", "limiteSegundosSemFoco", long.class)
                    .orElse(5L));

            AcessadorSegundosTimeoutTeste acessadorSegundosTimeoutTeste =
                    new AcessadorSegundosTimeoutTeste(configuracaoSessao);
            RoteadorSessao roteadorSessao;
            VerificadorSenha verificadorSenha = new VerificadorSenha(senha);
            VerificadorTokenTrocarSenha verificadorTokenTrocarSenha =
                    new VerificadorTokenTrocarSenha(TOKEN_TROCAR_SENHA);

            Method getSegundosTimeout;
            Method verificarSenha;
            Method verificarToken;
            try (ServerSocket serverSocket = new ServerSocket(porta)) {
                getSegundosTimeout = AcessadorSegundosTimeoutTeste.class.getMethod("getSegundosTimeout");
                verificarSenha = VerificadorSenha.class.getMethod("verificar", String.class);
                verificarToken = VerificadorTokenTrocarSenha.class.getMethod("verificar", String.class);

                //noinspection InfiniteLoopStatement
                while (true) {
                    roteadorSessao = new RoteadorSessao(serverSocket.accept());
                    roteadorSessao.registrarFuncionalidade(
                            ACESSADOR_SEGUNDOS_TIMEOUT_TESTE_HEADER, acessadorSegundosTimeoutTeste, getSegundosTimeout);
                    roteadorSessao.registrarFuncionalidade(VERIFICADOR_SENHA_HEADER, verificadorSenha, verificarSenha);
                    roteadorSessao.registrarFuncionalidade(
                            VERIFICAR_TOKEN_TROCAR_SENHA_HEADER, verificadorTokenTrocarSenha, verificarToken);
                    taskExecutor.execute(roteadorSessao);
                }
            } catch (NoSuchMethodException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.session.method.not-found")
                        .formatted(e.getMessage()));
            } catch (IOException e) {
                logger.severe(TradutorWrapper.tradutor
                        .traduzirMensagem("error.session.create.failure")
                        .formatted(e.getMessage()));
            }
        });

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

    @GetMapping({"/configurarSessao", "/configurarSessao.html"})
    public String configurarSessao(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "session-configuration");
        InjetorAtributos.injetarPaleta(modelMap);

        modelMap.addAttribute("configuracao", configuracaoSessao);
        modelMap.addAttribute("tokenTrocarSenha", TOKEN_TROCAR_SENHA);

        return "configurarSessao";
    }

    @PostMapping("/configurarSessao")
    public String configurarSessao(@ModelAttribute("configuracao") ConfiguracaoSessao configuracaoSessao) {
        ControladorSessao.configuracaoSessao.setSecondsTimeout(configuracaoSessao.getSecondsTimeout());

        return "redirect:/listagemEstudantes";
    }

    @EventListener(SpringApplicationShutdownHandlers.class)
    @PostMapping("/encerrarSessao")
    private ResponseEntity<HttpStatus> finalizarSessao() {
        SessaoFactory.closeSocket();

        return ResponseEntity.ok().build();
    }

    public static Roteador getRoteador() {
        return roteador;
    }

    public static boolean isSessaoInativa() {
        return roteador == null && configuracaoSessao == null;
    }
}
