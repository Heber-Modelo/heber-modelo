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
import calcularExpressao from "domain/services/calcularValorExpressao";

export default class PropriedadeComponente {
  public static readonly CLASSE_PROPRIEDADE_CUSTOMIZADA: string = "custom";

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

  private readonly _nome: string;
  protected _componente: ComponenteDiagrama;
  protected _sufixo: string;
  protected _label: string;
  protected _classeElemento: string;
  protected _input: HTMLInputElement | undefined;

  public atualizarInput(): void {
    if (this._input) {
      this._input.value = this.pegarValorPropriedade();
    }
  }

  protected pegarValorPropriedade(): string {
    return (
      this._componente.htmlComponente
        .querySelector(this._classeElemento)
        ?.getAttribute(this._nome) ?? ""
    );
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

    this._componente.htmlComponente
      .querySelector(this._classeElemento)
      ?.setAttribute(this._nome, `${novoValor}${this._sufixo}`);
  }

  protected formatarLabel(): string {
    return this._label.substring(0, 1).toUpperCase() + this._label.substring(1) + ":";
  }

  public criarElementoInputPropriedade(): HTMLLabelElement {
    let labelInput: HTMLLabelElement = document.createElement("label");
    this._input = document.createElement("input");

    this._input.addEventListener("input", (): void => {
      this.definirValorPropriedade((this._input as HTMLInputElement).value);
      this._componente.atualizarOuvintes();
    });

    this._input.value = this.pegarValorPropriedade();
    labelInput.innerText = this.formatarLabel();
    labelInput.appendChild(this._input);
    labelInput.classList.add(PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA);

    return labelInput;
  }

  get nome(): string {
    return this._nome;
  }
}
