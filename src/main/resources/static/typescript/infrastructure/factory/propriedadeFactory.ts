/*
 * Copyright (c) 2025. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import ComponenteDiagrama from "model/componente/componenteDiagrama.js";
import PropriedadeComponente from "model/propriedade/propriedadeComponente.js";
import PropriedadeInnerText from "model/propriedade/propriedadeInnerText.js";

export default class PropriedadeFactory {
  public criarPropriedade(
    nomePropriedade: string,
    sufixo: string,
    componente: ComponenteDiagrama,
    label: string,
    classeElemento: string,
  ): PropriedadeComponente | null {
    if (nomePropriedade === "innerText") {
      return new PropriedadeInnerText(componente, sufixo, label, classeElemento);
    } else {
      return new PropriedadeComponente(nomePropriedade, componente, sufixo, label, classeElemento);
    }
  }
}
