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

import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";

export default class PropriedadeSelecionavel extends PropriedadeComponente {
  private readonly _chavesI18nLabelsValoresPermitidos: string[] | undefined;
  private readonly _valoresPermitidos: string[];
  private _selectElement: HTMLSelectElement | undefined;

  constructor(
    nome: string,
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
    chavesI18nLabelsValoresPermitidos: string[] | undefined,
    valoresPermitidos: string[],
  ) {
    super(nome, componente, sufixo, label, classeElemento);
    this._chavesI18nLabelsValoresPermitidos = chavesI18nLabelsValoresPermitidos;
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
    this._selectElement = document.createElement("select");
    this._selectElement.name = this._nome;

    if (this._chavesI18nLabelsValoresPermitidos) {
      for (let i: number = 0; i < this._valoresPermitidos.length; i++) {
        let option: HTMLOptionElement = document.createElement("option");
        option.value = this._valoresPermitidos[i];

        traduzirChaveI18n(this._chavesI18nLabelsValoresPermitidos[i]).then(
          (label: string): void => {
            option.innerText = label.toUpperCase();
          },
        );

        this._selectElement.appendChild(option);
      }
    } else {
      this._valoresPermitidos.forEach((valorPermitido: string): void => {
        let option: HTMLOptionElement = document.createElement("option");
        option.value = valorPermitido;
        option.innerText = valorPermitido;
        this._selectElement?.appendChild(option);
      });
    }

    this._selectElement.addEventListener("change", (): void => {
      let selectedOption: HTMLOptionElement | undefined | null = this._selectElement?.options.item(
        this._selectElement.selectedIndex,
      );

      if (selectedOption) {
        this.definirValorPropriedade(selectedOption.value);
      }
    });

    this._selectElement.addEventListener("change", (): void => {
      let targetElement: HTMLElement | null = this._componente.htmlComponente.querySelector(
        this._classeElemento,
      );
      targetElement?.dispatchEvent(new Event(PropriedadeSelecionavel.PROPERTY_CHANGE_EVENT));
    });

    let labelElement: HTMLLabelElement = document.createElement("label");
    labelElement.innerText = this.formatarLabel();
    labelElement.appendChild(this._selectElement);
    labelElement.classList.add(PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA);

    let valorAtual: string = this.pegarValorPropriedade();
    for (let option of this._selectElement.options) {
      option.selected = option.value === valorAtual;
    }

    return labelElement;
  }
}
