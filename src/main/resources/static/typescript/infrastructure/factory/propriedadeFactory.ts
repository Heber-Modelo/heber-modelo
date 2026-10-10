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

import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";
import PropriedadeEstiloComponente from "domain/model/propriedade/propriedadeEstiloComponente";
import PropriedadeInnerText from "domain/model/propriedade/propriedadeInnerText";
import PropriedadeFilho from "domain/model/propriedade/propriedadeFilho";
import PropriedadeFilhoChaveAtributo from "domain/model/propriedade/propriedadeFilhoChaveAtributo";
import PropriedadeSelecionavel from "domain/model/propriedade/propriedadeSelecionavel";
import PropriedadeSelecionavelTipoConexao from "domain/model/propriedade/propriedadeSelecionavelTipoConexao";

export default class PropriedadeFactory {
  public criarPropriedade(
    nomePropriedade: string,
    sufixo: string,
    componente: ComponenteDiagrama,
    label: string,
    classeElemento: string,
    chavesI18nLabelsValoresPermitidos: string[] | undefined,
    valoresPermitidos: string[] | undefined,
  ): PropriedadeComponente | null {
    if (nomePropriedade === "innerText") {
      return new PropriedadeInnerText(componente, sufixo, label, classeElemento);
    } else if (nomePropriedade === "connectionType" && valoresPermitidos) {
      return new PropriedadeSelecionavelTipoConexao(
        nomePropriedade,
        componente,
        sufixo,
        label,
        classeElemento,
        chavesI18nLabelsValoresPermitidos,
        valoresPermitidos,
      );
    } else if (nomePropriedade.startsWith("style")) {
      return new PropriedadeEstiloComponente(
        nomePropriedade.split(".")[1],
        componente,
        sufixo,
        label,
        classeElemento,
      );
    } else if (!valoresPermitidos && nomePropriedade.startsWith("child.")) {
      return new PropriedadeFilho(
        nomePropriedade.split(".")[1],
        componente,
        sufixo,
        label,
        classeElemento,
      );
    } else if (valoresPermitidos && nomePropriedade.startsWith("child.")) {
      return new PropriedadeFilhoChaveAtributo(
        nomePropriedade.split(".")[1],
        componente,
        sufixo,
        label,
        classeElemento,
        chavesI18nLabelsValoresPermitidos,
        valoresPermitidos,
      );
    } else if (valoresPermitidos) {
      return new PropriedadeSelecionavel(
        nomePropriedade,
        componente,
        sufixo,
        label,
        classeElemento,
        chavesI18nLabelsValoresPermitidos,
        valoresPermitidos,
      );
    } else {
      return new PropriedadeComponente(nomePropriedade, componente, sufixo, label, classeElemento);
    }
  }
}
