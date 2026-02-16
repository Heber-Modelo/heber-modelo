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

package io.github.heberbarra.modelador.application.diagrama;

import io.github.heberbarra.modelador.domain.model.TipoDiagramaDTO;
import java.util.List;

public class ListadorTiposDiagrama {

    public enum GruposDiagrama {
        DATABASE("diagramasBD"),
        UML("diagramasUML"),
        MISC("diagramasOutros");

        private final String nomeGrupo;

        GruposDiagrama(String nomeGrupo) {
            this.nomeGrupo = nomeGrupo;
        }

        @Override
        public String toString() {
            return this.nomeGrupo;
        }
    }

    public static List<TipoDiagramaDTO> pegarDiagramasUML() {
        return List.of(
                new TipoDiagramaDTO("diagram.activities.label", "DDA", "diagram.activities.title"),
                new TipoDiagramaDTO("diagram.use-case.label", "DCU", "diagram.use-case.title"),
                new TipoDiagramaDTO("diagram.class.label", "DCL", "diagram.class.title"),
                new TipoDiagramaDTO("diagram.communication.label", "DCM", "diagram.communication.title"),
                new TipoDiagramaDTO("diagram.components.label", "DCP", "diagram.components.title"),
                new TipoDiagramaDTO("diagram.structure.label", "DEC", "diagram.structure.title"),
                new TipoDiagramaDTO("diagram.deployment.label", "DDI", "diagram.deployment.title"),
                new TipoDiagramaDTO("diagram.vision.label", "DVI", "diagram.vision.title"),
                new TipoDiagramaDTO("diagram.objects.label", "DDO", "diagram.objects.title"),
                new TipoDiagramaDTO("diagram.packages.label", "DDP", "diagram.packages.title"),
                new TipoDiagramaDTO("diagram.profile.label", "DPF", "diagram.profile.title"),
                new TipoDiagramaDTO("diagram.state.label", "DTE", "diagram.state.title"),
                new TipoDiagramaDTO("diagram.time.label", "DDT", "diagram.time.title"),
                new TipoDiagramaDTO("diagram.sequence.label", "DDS", "diagram.sequence.title"));
    }

    public static List<TipoDiagramaDTO> pegarDiagramasBancoDados() {
        return List.of(
                new TipoDiagramaDTO("diagram.dictionary.label", "DDD", "diagram.dictionary.title"),
                new TipoDiagramaDTO("diagram.entity.label", "DER", "diagram.entity.title"),
                new TipoDiagramaDTO("diagram.relational.label", "DRL", "diagram.relational.title"),
                new TipoDiagramaDTO("diagram.relational-model.label", "MLR", "diagram.relational-model.title"));
    }

    public static List<TipoDiagramaDTO> pegarDiagramasOutros() {
        return List.of(
                new TipoDiagramaDTO("diagram.flowchart.label", "FLX", "diagram.flowchart.title"),
                new TipoDiagramaDTO("diagram.organizational.label", "ORG", "diagram.organizational.title"));
    }
}
