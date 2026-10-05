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

import io.github.heberbarra.modelador.domain.exception.AtividadeNotFoundException;
import io.github.heberbarra.modelador.domain.injector.InjetorAtributos;
import io.github.heberbarra.modelador.domain.model.dto.AtividadeDTO;
import io.github.heberbarra.modelador.domain.model.dto.AtividadeFeedbackDTO;
import io.github.heberbarra.modelador.domain.repository.IAtividadeRepositorio;
import io.github.heberbarra.modelador.domain.repository.IFeedbackRepositorio;
import io.github.heberbarra.modelador.domain.repository.IUsuarioRepositorio;
import io.github.heberbarra.modelador.infrastructure.entity.Atividade;
import io.github.heberbarra.modelador.infrastructure.mapper.AtividadeMapper;
import io.github.heberbarra.modelador.infrastructure.mapper.FeedbackMapper;
import io.github.heberbarra.modelador.infrastructure.services.AtividadeServices;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ControladorAtividades {

    private final IAtividadeRepositorio atividadeRepositorio;
    private final AtividadeServices atividadeServices;
    private final IFeedbackRepositorio feedbackRepositorio;
    private final IUsuarioRepositorio usuarioRepositorio;

    public ControladorAtividades(
            IAtividadeRepositorio atividadeRepositorio,
            AtividadeServices atividadeServices,
            IFeedbackRepositorio feedbackRepositorio,
            IUsuarioRepositorio usuarioRepositorio) {
        this.atividadeRepositorio = atividadeRepositorio;
        this.atividadeServices = atividadeServices;
        this.feedbackRepositorio = feedbackRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @RequestMapping("/atividade/{codigo_atividade}")
    public String atividade(ModelMap modelMap, @PathVariable("codigo_atividade") int codigoAtividade) {
        InjetorAtributos.injetarPaleta(modelMap);
        InjetorAtributos.injetarTituloPagina(modelMap, "assignment");

        AtividadeDTO atividade = AtividadeMapper.atividadeToDTO(this.atividadeRepositorio
                .findAtividadeByCodigo(codigoAtividade)
                .orElseThrow(() -> new AtividadeNotFoundException(codigoAtividade)));
        modelMap.addAttribute("assignment", atividade);

        return "atividade";
    }

    @GetMapping({"/criarAtividade", "/criarAtividade.html"})
    public String criarAtividade(ModelMap modelMap) {
        InjetorAtributos.injetarPaleta(modelMap);
        InjetorAtributos.injetarTituloPagina(modelMap, "create-assignment");

        return "criarAtividade";
    }

    @PostMapping("/criarAtividade")
    public ResponseEntity<HttpStatus> criarAtividade(@RequestBody AtividadeDTO atividadeDTO) {
        this.atividadeServices.saveAtividade(atividadeDTO);

        return ResponseEntity.ok().build();
    }

    @RequestMapping({"/listagemAtividades", "/listagemAtividades.html"})
    public String listagemAtividades(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "assignments-list");
        InjetorAtributos.injetarPaleta(modelMap);

        List<Atividade> atividades = this.atividadeRepositorio.findAll();
        List<AtividadeDTO> atividadeDTOS =
                atividades.stream().map(AtividadeMapper::atividadeToDTO).toList();

        modelMap.addAttribute("atividades", atividadeDTOS);

        return "listagemAtividades";
    }

    @RequestMapping({"/listagemAtividadesCorrecao", "/listagemAtividadesCorrecao.html"})
    public String listagemAtividadesParaCorrecao(ModelMap modelMap) {
        InjetorAtributos.injetarTituloPagina(modelMap, "assignments-feedback-list");
        InjetorAtributos.injetarPaleta(modelMap);

        List<AtividadeFeedbackDTO> atividadesPendentes =
                feedbackRepositorio.getFeedbacksByDescricaoNullOrderByAtividade().stream()
                        .map(FeedbackMapper::feedbackToAtividadeFeedbackDTO)
                        .toList();
        List<AtividadeFeedbackDTO> atividadesCorrigidas =
                feedbackRepositorio.getFeedbacksByDescricaoNotNullOrderByAtividade().stream()
                        .map(FeedbackMapper::feedbackToAtividadeFeedbackDTO)
                        .toList();

        modelMap.addAttribute("atividadesPendentes", atividadesPendentes);
        modelMap.addAttribute("atividadesCorrigidas", atividadesCorrigidas);

        return "listagemAtividadesCorrecao";
    }
}
