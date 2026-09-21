/*
 * Copyright (C) 2025 Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

package io.github.heberbarra.modelador;

import static io.github.heberbarra.modelador.infrastructure.controller.ControladorDesligar.TOKEN_SECRETO;
import static io.github.heberbarra.modelador.infrastructure.services.UsuarioDetailsService.NOME_AUTORIDADE_PROFESSOR;
import static java.awt.Desktop.Action.BROWSE;

import io.github.heberbarra.modelador.application.diagrama.ListadorTiposDiagrama;
import io.github.heberbarra.modelador.application.diagrama.ListadorTiposDiagrama.GruposDiagrama;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.NovoDiagramaDTO;
import io.github.heberbarra.modelador.domain.model.UsuarioDTO;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.configurador.WatcherConfiguracao;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import io.github.heberbarra.modelador.infrastructure.mapper.UsuarioMapper;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.logging.Handler;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@EnableAsync
@Controller
@SpringBootApplication
@Service
public class ControladorWeb {

    private static final Logger logger = JavaLogger.obterLogger(ControladorWeb.class.getName());
    private static final IConfigurador configurador = ConfiguradorFactory.build();
    private final TaskExecutor taskExecutor;
    private final IUsuarioRepositorio usuarioRepositorio;

    public ControladorWeb(
            @Qualifier("applicationTaskExecutor") TaskExecutor taskExecutor, IUsuarioRepositorio usuarioRepositorio) {
        this.taskExecutor = taskExecutor;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @PostConstruct
    public static void configurarLogger() {
        Logger loggerGlobal = Logger.getLogger("");

        for (Handler handler : loggerGlobal.getHandlers()) {
            loggerGlobal.removeHandler(handler);
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    public void iniciarWatcherConfig() {
        WatcherConfiguracao watcherConfiguracao = new WatcherConfiguracao();
        taskExecutor.execute(watcherConfiguracao);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void exibirMensagemProgramaPronto() {
        Optional<String> host = configurador.pegarValorConfiguracao("programa", "dominio", String.class);
        Optional<Long> porta = configurador.pegarValorConfiguracao("programa", "porta", long.class);

        if (host.isPresent() && porta.isPresent()) {
            logger.info(TradutorWrapper.tradutor
                    .traduzirMensagem("app.ready")
                    .formatted(host.get(), Math.toIntExact(porta.get())));
        }
    }

    @SuppressWarnings("HttpUrlsUsage")
    @EventListener(ApplicationReadyEvent.class)
    public void abrirWebBrowser() throws IOException {
        Optional<Boolean> abrirBrowser =
                configurador.pegarValorConfiguracao("programa", "abrir_navegador_automaticamente", boolean.class);
        if (abrirBrowser.isEmpty() || (!abrirBrowser.get())) return;

        logger.info(TradutorWrapper.tradutor.traduzirMensagem("app.opening.browser"));
        URI uriPrograma;
        try {
            Optional<String> dominioPrograma = configurador.pegarValorConfiguracao("programa", "dominio", String.class);
            Optional<Long> portaPrograma = configurador.pegarValorConfiguracao("programa", "porta", long.class);

            if (dominioPrograma.isEmpty() || portaPrograma.isEmpty()) {
                return;
            }

            uriPrograma = new URI("http://%s:%d".formatted(dominioPrograma.get(), portaPrograma.get()));
        } catch (URISyntaxException e) {
            logger.warning(TradutorWrapper.tradutor
                    .traduzirMensagem("error.browser.cannot.create.url")
                    .formatted(e.getMessage()));
            return;
        }

        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(BROWSE)) {
            Desktop.getDesktop().browse(uriPrograma);
            return;
        }

        String nomeSistemaOperacional = System.getProperty("os.name").toLowerCase();
        Runtime runtime = Runtime.getRuntime();

        if (nomeSistemaOperacional.contains("mac")) {
            runtime.exec(new String[] {"open", uriPrograma.toString()});
        } else if (nomeSistemaOperacional.contains("nix") || nomeSistemaOperacional.contains("nux")) {
            runtime.exec(new String[] {"xdg-open", uriPrograma.toString()});
        } else if (nomeSistemaOperacional.contains("windows")) {
            runtime.exec(new String[] {"powershell.exe", "-Command", uriPrograma.toString()});
        } else {
            logger.warning(TradutorWrapper.tradutor.traduzirMensagem("error.browser.cannot.open"));
        }
    }

    @RequestMapping({"/", "/index", "/index.html", "home", "home.html"})
    public String index(
            @AuthenticationPrincipal UserDetails userDetails, ModelMap modelMap, HttpServletResponse response) {

        Optional<String> currentUserAuthority = Optional.empty();
        if (userDetails != null
                && userDetails.getAuthorities().stream().findFirst().isPresent()) {
            currentUserAuthority = Optional.ofNullable(
                    userDetails.getAuthorities().stream().findFirst().get().getAuthority());
        }

        if (currentUserAuthority.isPresent() && currentUserAuthority.get().equals(NOME_AUTORIDADE_PROFESSOR)) {
            return "redirect:/listagemEstudantes";
        }

        InjetorAtributos.injetarTituloPagina(modelMap, "home");
        InjetorAtributos.injetarPaleta(modelMap);
        modelMap.addAttribute("desligar", "");

        if (userDetails != null) {
            modelMap.addAttribute("username", userDetails.getUsername());
        }

        Cookie cookieTokenDesligar = new Cookie("TOKEN_DESLIGAR", TOKEN_SECRETO);
        cookieTokenDesligar.setSecure(true);
        response.addCookie(cookieTokenDesligar);

        return "index";
    }

    @RequestMapping({"/listagemEstudantes", "/listagemEstudantes.html"})
    public String listagemEstudantes(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "students-list");
        InjetorAtributos.injetarPaleta(modelMap);

        List<UsuarioDTO> usuariosDTOs = usuarioRepositorio.findAll().stream()
                .map(UsuarioMapper::usuarioToDTO)
                .toList();
        modelMap.addAttribute(
                "professors",
                usuariosDTOs.stream()
                        .filter(usuarioDTO -> usuarioDTO.getTipo().equals("P"))
                        .toList());
        modelMap.addAttribute(
                "students",
                usuariosDTOs.stream()
                        .filter(usuarioDTO -> usuarioDTO.getTipo().equals("E"))
                        .toList());

        return "listagemEstudantes";
    }

    @RequestMapping({"/editor", "/editor.html"})
    public String editor(ModelMap modelMap, @ModelAttribute("novoDiagramaDTO") NovoDiagramaDTO novoDiagramaDTO) {
        InjetorAtributos.injetarTituloPagina(modelMap, "editor");
        InjetorAtributos.injetarPaleta(modelMap);
        InjetorAtributos.injetarBindings(modelMap);
        modelMap.addAttribute("novoDiagramaDTO", novoDiagramaDTO);
        modelMap.addAttribute(GruposDiagrama.UML.toString(), ListadorTiposDiagrama.pegarDiagramasUML());
        modelMap.addAttribute(GruposDiagrama.DATABASE.toString(), ListadorTiposDiagrama.pegarDiagramasBancoDados());
        modelMap.addAttribute(GruposDiagrama.MISC.toString(), ListadorTiposDiagrama.pegarDiagramasOutros());

        Optional<Boolean> exibirGrade = configurador.pegarValorConfiguracao("grade", "exibir", boolean.class);
        if (exibirGrade.isPresent() && exibirGrade.get()) {
            Optional<Long> tamanhoQuadradoGrade =
                    configurador.pegarValorConfiguracao("grade", "tamanho_quadrado_px", long.class);
            Optional<Long> espessuraGrade = configurador.pegarValorConfiguracao("grade", "espessura", long.class);
            Optional<Boolean> modoAvancadoEditorPropriedades =
                    configurador.pegarValorConfiguracao("editor", "modoAvancadoEditorPropriedades", boolean.class);

            if (tamanhoQuadradoGrade.isPresent()
                    && espessuraGrade.isPresent()
                    && modoAvancadoEditorPropriedades.isPresent()) {
                modelMap.addAttribute("tamanhoQuadradoGrade", tamanhoQuadradoGrade.get() + "px");
                modelMap.addAttribute("espessuraGrade", espessuraGrade.get() + "px");
                modelMap.addAttribute("modoAvancadoEditorPropriedades", modoAvancadoEditorPropriedades.get());
            }
        }

        modelMap.addAttribute(
                "incrementoMovimentacaoElemento",
                configurador
                        .pegarValorConfiguracao("editor", "incrementoMovimentacaoElemento", long.class)
                        .orElse(0L));

        return "editor";
    }

    @RequestMapping({"/novo", "/novo.html"})
    public String novoDiagrama(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "new-diagram");
        InjetorAtributos.injetarPaleta(modelMap);
        modelMap.addAttribute("novoDiagramaDTO", new NovoDiagramaDTO());
        modelMap.addAttribute("diagramasUML", ListadorTiposDiagrama.pegarDiagramasUML());
        modelMap.addAttribute("diagramasBD", ListadorTiposDiagrama.pegarDiagramasBancoDados());
        modelMap.addAttribute("diagramasOutro", ListadorTiposDiagrama.pegarDiagramasOutros());

        return "novo";
    }

    @RequestMapping({"/privacidade", "/privacidade.html"})
    public String politicaPrivacidade(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "privacy");
        InjetorAtributos.injetarPaleta(modelMap);

        return "privacidade";
    }

    @RequestMapping({"/termos", "/termos.html"})
    public String termosGerais(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "terms");
        InjetorAtributos.injetarPaleta(modelMap);

        return "termos";
    }
}
