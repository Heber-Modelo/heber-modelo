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
import calcularExpressao from "domain/services/calcularValorExpressao";

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

    let novoValor: string = valor.endsWith(this._sufixo)
      ? valor.substring(0, valor.length - this._sufixo.length)
      : valor;

    try {
      let valorNumerico: number | null = calcularExpressao(novoValor);

      if (valorNumerico) {
        novoValor = `${valorNumerico}`;
      }
    } catch (e) {}

    elementoAlvo?.style.setProperty(this._nome, `${novoValor}${this._sufixo}`);
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

    let valorPropriedade: string = elementoAlvo?.style.getPropertyValue(this._nome) ?? "";

    if (elementoAlvo && valorPropriedade === "" && this._nome !== "font-size") {
      let estiloComponente: CSSStyleDeclaration = getComputedStyle(elementoAlvo);
      valorPropriedade = estiloComponente.getPropertyValue(this._nome);
    }

    return valorPropriedade;
  }
}
