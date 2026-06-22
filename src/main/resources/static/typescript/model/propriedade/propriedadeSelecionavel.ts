/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import PropriedadeComponente from "model/propriedade/propriedadeComponente";
import ComponenteDiagrama from "model/componente/componenteDiagrama";

export default class PropriedadeSelecionavel extends PropriedadeComponente {
  private readonly _valoresPermitidos: string[];

  constructor(
    nome: string,
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
    valoresPermitidos: string[],
  ) {
    super(nome, componente, sufixo, label, classeElemento);
    this._valoresPermitidos = valoresPermitidos;
  }

  definirValorPropriedade(valor: string): void {
    let texto: HTMLElement | null = this._componente.htmlComponente.querySelector(
      this._classeElemento,
    );

    if (texto) {
      texto.innerText = valor;
    }
  }

  protected pegarValorPropriedade(): string {
    let texto: HTMLElement | null = this._componente.htmlComponente.querySelector(
      this._classeElemento,
    );

    return texto?.innerText ?? "";
  }

  criarElementoInputPropriedade(): HTMLLabelElement {
    let selectElement: HTMLSelectElement = document.createElement("select");
    selectElement.name = this._nome;

    this._valoresPermitidos.forEach((valorPermitido: string): void => {
      let option: HTMLOptionElement = document.createElement("option");
      option.value = valorPermitido;
      option.innerText = valorPermitido;
      selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", (): void => {
      let selectedOption: HTMLOptionElement | null = selectElement.options.item(
        selectElement.selectedIndex,
      );

      if (selectedOption) {
        this.definirValorPropriedade(selectedOption.innerText);
      }
    });

    let labelElement: HTMLLabelElement = document.createElement("label");
    labelElement.innerText = this.formatarLabel();
    labelElement.appendChild(selectElement);
    labelElement.classList.add(PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA);

    let valorAtual: string = this.pegarValorPropriedade();
    for (let option of selectElement.options) {
      option.selected = option.innerText === valorAtual;
    }

    return labelElement;
  }
}
