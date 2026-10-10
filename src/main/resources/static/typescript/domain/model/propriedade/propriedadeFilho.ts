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
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import calcularExpressao from "domain/services/calcularValorExpressao";

export default class PropriedadeFilho extends PropriedadeComponente {
  private _indiceComponente: number;

  constructor(
    nome: string,
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
  ) {
    super(nome, componente, sufixo, label, classeElemento);
    this._indiceComponente = 0;
  }

  protected pegarValorPropriedade(): string {
    let elementos: NodeListOf<HTMLElement> = this._componente.htmlComponente.querySelectorAll(
      this._classeElemento,
    );
    let elementoAlvo: HTMLElement | null = elementos.item(this._indiceComponente);

    if (elementoAlvo && this._nome === "innerText") {
      return elementoAlvo.innerText;
    }

    return elementoAlvo.getAttribute(this._nome) ?? "";
  }

  public definirValorPropriedade(valor: string): void {
    let novoValor: string = valor.endsWith(this._sufixo)
      ? valor.substring(0, valor.length - this._sufixo.length)
      : valor;

    try {
      let valorNumerico: number | null = calcularExpressao(novoValor);

      if (valorNumerico) {
        novoValor = `${valorNumerico}`;
      }
    } catch (e) {}

    let elementos: NodeListOf<HTMLElement> = this._componente.htmlComponente.querySelectorAll(
      this._classeElemento,
    );
    let elementoAlvo: HTMLElement | null = elementos.item(this._indiceComponente);

    if (elementoAlvo && this._nome === "innerText") {
      elementoAlvo.innerText = `${novoValor}${this._sufixo}`;
    }

    elementoAlvo?.setAttribute(this._nome, `${novoValor}${this._sufixo}`);
  }

  get indiceComponente(): number {
    return this._indiceComponente;
  }

  set indiceComponente(value: number) {
    this._indiceComponente = value;
  }
}
