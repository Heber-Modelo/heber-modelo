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

package io.github.heberbarra.modelador;

import io.github.heberbarra.modelador.application.diagrama.ListadorTiposDiagrama;
import io.github.heberbarra.modelador.application.logging.JavaLogger;
import io.github.heberbarra.modelador.application.tradutor.TradutorWrapper;
import io.github.heberbarra.modelador.domain.configurador.IConfigurador;
import io.github.heberbarra.modelador.domain.model.NovoDiagramaDTO;
import io.github.heberbarra.modelador.domain.model.UsuarioDTO;
import io.github.heberbarra.modelador.infrastructure.configurador.Configurador;
import io.github.heberbarra.modelador.infrastructure.configurador.WatcherConfiguracao;
import io.github.heberbarra.modelador.infrastructure.controller.ControladorDesligar;
import io.github.heberbarra.modelador.infrastructure.entity.Usuario;
import io.github.heberbarra.modelador.infrastructure.factory.ConfiguradorFactory;
import io.github.heberbarra.modelador.infrastructure.services.UsuarioServices;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Handler;
import java.util.logging.Logger;
import java.util.regex.Pattern;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.tomlj.TomlTable;

@EnableAsync
@Controller
@SpringBootApplication
@Service
public class ControladorWeb {

    private static final Logger logger = JavaLogger.obterLogger(ControladorWeb.class.getName());
    private static final IConfigurador configurador = ConfiguradorFactory.build();
    private final TaskExecutor taskExecutor;
    private final UsuarioServices usuarioServices;

    public ControladorWeb(
            @Qualifier("applicationTaskExecutor") TaskExecutor taskExecutor, UsuarioServices usuarioServices) {
        this.taskExecutor = taskExecutor;
        this.usuarioServices = usuarioServices;
    }

    public static class InjetorAtributos {

        public static void injetarBindings(ModelMap modelMap) {
            TomlTable tabelaBindings = ((Configurador) configurador)
                    .getLeitorConfiguracao()
                    .getInformacoesConfiguracoes()
                    .getTable("bindings");

            if (tabelaBindings == null) return;

            for (String nomeBindings : tabelaBindings.dottedKeySet()) {
                modelMap.addAttribute(nomeBindings, tabelaBindings.get(nomeBindings));
            }
        }

        public static void injetarPaleta(ModelMap modelMap) {
            Map<String, String> variaveisPaleta = configurador.pegarInformacoesPaleta();
            StringBuilder stringBuilder = new StringBuilder(":root{%n".formatted());

            for (String variavel : variaveisPaleta.keySet()) {
                stringBuilder.append(
                        "    --%s: %s;%n".formatted(variavel.replace("_", "-"), variaveisPaleta.get(variavel)));
            }

            stringBuilder.append("  }%n".formatted());
            modelMap.addAttribute("paleta", stringBuilder.toString());
        }

        public static void injetarTituloPagina(ModelMap modelMap, String nomePagina) {
            String titulo = TradutorWrapper.tradutor.traduzirMensagem("web.page.%s.title".formatted(nomePagina));
            String nomePrograma = Principal.NOME_PROGRAMA.replace("-", " ");
            String sufixo = titulo.isBlank() ? "" : " - " + titulo;

            modelMap.addAttribute("programa", nomePrograma + sufixo);
        }
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

        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            Desktop.getDesktop().browse(uriPrograma);
            return;
        }

        String nomeSistemaOperacional = System.getProperty("os.name");
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
    public String index(ModelMap modelMap, HttpServletResponse response) {
        InjetorAtributos.injetarTituloPagina(modelMap, "home");
        InjetorAtributos.injetarPaleta(modelMap);
        Cookie cookieTokenDesligar = new Cookie("TOKEN_DESLIGAR", ControladorDesligar.TOKEN_SECRETO);
        modelMap.addAttribute("desligar", "");
        response.addCookie(cookieTokenDesligar);

        return "index";
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

        usuarioDTO.setTipo(Principal.getTipoUsuario());
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

    @RequestMapping(
            value = {"/editor", "/editor.html"},
            method = {RequestMethod.GET, RequestMethod.POST})
    public String editor(ModelMap modelMap, @ModelAttribute("novoDiagramaDTO") NovoDiagramaDTO novoDiagramaDTO) {
        InjetorAtributos.injetarTituloPagina(modelMap, "editor");
        InjetorAtributos.injetarPaleta(modelMap);
        InjetorAtributos.injetarBindings(modelMap);
        modelMap.addAttribute("novoDiagramaDTO", novoDiagramaDTO);
        modelMap.addAttribute("diagramasUML", ListadorTiposDiagrama.pegarDiagramasUML());
        modelMap.addAttribute("diagramasBD", ListadorTiposDiagrama.pegarDiagramasBancoDados());
        modelMap.addAttribute("diagramasOutros", ListadorTiposDiagrama.pegarDiagramasOutros());

        Optional<Boolean> exibirGrade = configurador.pegarValorConfiguracao("grade", "exibir", boolean.class);
        if (exibirGrade.isPresent() && exibirGrade.get()) {
            Optional<Long> tamanhoQuadradoGrade =
                    configurador.pegarValorConfiguracao("grade", "tamanho_quadrado_px", long.class);
            Optional<Long> espessuraGrade = configurador.pegarValorConfiguracao("grade", "espessura", long.class);

            if (tamanhoQuadradoGrade.isPresent() && espessuraGrade.isPresent()) {
                modelMap.addAttribute("tamanhoQuadradoGrade", tamanhoQuadradoGrade.get() + "px");
                modelMap.addAttribute("espessuraGrade", espessuraGrade.get() + "px");
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
        modelMap.addAttribute("diagramasOutros", ListadorTiposDiagrama.pegarDiagramasOutros());

        return "novo";
    }

    @RequestMapping({"/perfil", "/perfil.html"})
    public String perfil(@AuthenticationPrincipal UserDetails userDetails, ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "profile");
        InjetorAtributos.injetarPaleta(modelMap);

        Usuario usuario = usuarioServices.findUserByNome(userDetails.getUsername());
        modelMap.addAttribute("usuario", usuario);

        return "perfil";
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
