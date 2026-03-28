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

import ComponenteDiagrama from "model/componente/componenteDiagrama";

export default class PropriedadeComponente {
  constructor(
    nome: string,
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
  ) {
    this._nome = nome;
    this._componente = componente;
    this._sufixo = sufixo;
    this._label = label;
    this._classeElemento = classeElemento.startsWith(".") ? classeElemento : `.${classeElemento}`;
  }

  private static _CLASSE_PROPRIEDADE_CUSTOMIZADA: string = "custom";
  protected _nome: string;
  protected _componente: ComponenteDiagrama;
  protected _sufixo: string;
  protected _label: string;
  protected _classeElemento: string;

  static get CLASSE_PROPRIEDADE_CUSTOMIZADA(): string {
    return this._CLASSE_PROPRIEDADE_CUSTOMIZADA;
  }

  get nome(): string {
    return this._nome;
  }

  protected pegarValorPropriedade(): string {
    return (
      this._componente.htmlComponente
        .querySelector(this._classeElemento)
        ?.getAttribute(this._nome) ?? ""
    );
  }

  public definirValorPropriedade(valor: string): void {
    this._componente.htmlComponente
      .querySelector(this._classeElemento)
      ?.setAttribute(this._nome, `${valor}${this._sufixo}`);
  }

  private formatarLabel(): string {
    return this._label.substring(0, 1).toUpperCase() + this._label.substring(1) + ":";
  }

  public criarElementoInputPropriedade(): HTMLLabelElement {
    let labelInput: HTMLLabelElement = document.createElement("label");
    let elementoInput: HTMLInputElement = document.createElement("input");

    elementoInput.addEventListener("input", (): void => {
      this.definirValorPropriedade(elementoInput.value);
      this._componente.atualizarOuvintes();
    });

    elementoInput.value = this.pegarValorPropriedade();
    labelInput.innerText = this.formatarLabel();
    labelInput.appendChild(elementoInput);
    labelInput.classList.add(PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA);

    return labelInput;
  }
}
