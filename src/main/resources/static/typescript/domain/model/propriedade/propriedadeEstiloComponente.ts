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

import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";

export default class PropriedadeEstiloComponente extends PropriedadeComponente {
  public definirValorPropriedade(valor: string): void {
    let elementoAlvo: HTMLElement | null;

    if (
      this._componente.htmlComponente.classList.contains(
        this._classeElemento.substring(1, this._classeElemento.length),
      )
    ) {
      elementoAlvo = this._componente.htmlComponente;
    } else {
      elementoAlvo = this._componente.htmlComponente.querySelector(this._classeElemento);
    }

    elementoAlvo?.style.setProperty(this._nome, `${valor}${this._sufixo}`);
  }

  protected pegarValorPropriedade(): string {
    let elementoAlvo: HTMLElement | null;

    if (
      this._componente.htmlComponente.classList.contains(
        this._classeElemento.substring(1, this._classeElemento.length),
      )
    ) {
      elementoAlvo = this._componente.htmlComponente;
    } else {
      elementoAlvo = this._componente.htmlComponente.querySelector(this._classeElemento);
    }

    return elementoAlvo?.style.getPropertyValue(this._nome) ?? "";
  }
}
