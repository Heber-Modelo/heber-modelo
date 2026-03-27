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

export default class PropriedadeInnerText extends PropriedadeComponente {
  constructor(
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
  ) {
    super("innerText", componente, sufixo, label, classeElemento);
  }

  definirValorPropriedade(valor: string): void {
    let elemento: HTMLElement | null = this._componente.htmlComponente.querySelector(
      this._classeElemento,
    );

    if (elemento != null) {
      elemento.innerText = `${valor}${this._sufixo}`;
    }
  }

  protected pegarValorPropriedade(): string {
    let elemento: HTMLElement | null = this._componente.htmlComponente.querySelector(
      this._classeElemento,
    );

    if (elemento === null) {
      return "";
    }

    return elemento?.innerText;
  }
}
