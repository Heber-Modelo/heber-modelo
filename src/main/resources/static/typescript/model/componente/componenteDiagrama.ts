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

import converterPixeisParaNumero from "infrastructure/conversor/conversor";
import ComponenteDiagramaOuvido from "model/componente/componenteDiagramaOuvido";
import ComponenteDiagramaOuvinte from "model/componente/componenteDiagramaOuvinte";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";

export enum LateralComponente {
  NORTE,
  SUL,
  LESTE,
  OESTE,
}

export default class ComponenteDiagrama implements ComponenteDiagramaOuvido {
  constructor(htmlComponente: HTMLDivElement, propriedades: PropriedadeComponente[] | null) {
    this._htmlComponente = htmlComponente;
    this._propriedades = propriedades ?? [];
  }

  private readonly _propriedades: PropriedadeComponente[];
  private _ouvintes: ComponenteDiagramaOuvinte[] = [];
  protected _htmlComponente: HTMLDivElement;
  protected _recebeSetas: boolean = true;

  get htmlComponente(): HTMLDivElement {
    return this._htmlComponente;
  }

  set htmlComponente(novoHtmlComponente: HTMLDivElement) {
    this._htmlComponente = novoHtmlComponente;
  }

  get propriedades(): PropriedadeComponente[] {
    return this._propriedades;
  }

  get recebeSetas(): boolean {
    return this._recebeSetas;
  }

  public definirValorPropriedade(nomePropriedade: string, valorPropriedade: string): void {
    this._propriedades.forEach((propriedade: PropriedadeComponente): void => {
      if (propriedade.nome === nomePropriedade) {
        propriedade.definirValorPropriedade(valorPropriedade);
        this.atualizarOuvintes();
        return;
      }
    });

    if (this._htmlComponente.hasAttribute(nomePropriedade)) {
      this._htmlComponente.setAttribute(nomePropriedade, String(valorPropriedade));
      this.atualizarOuvintes();
      return;
    }

    throw `Propriedade ${nomePropriedade} não existe no elemento: ${this._htmlComponente}`;
  }

  public pegarEstiloElemento(): CSSStyleDeclaration {
    return getComputedStyle(this._htmlComponente);
  }

  public pegarIDElemento(): number {
    return Number(this._htmlComponente.getAttribute("data-id"));
  }

  public calcularPontoLateralComponente(lateralComponente: LateralComponente): number[] {
    let estiloComponente: CSSStyleDeclaration = this.pegarEstiloElemento();
    let x: number = 0;
    let y: number = 0;

    switch (lateralComponente) {
      case LateralComponente.NORTE:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width) / 2;
        y = converterPixeisParaNumero(estiloComponente.top);
        break;

      case LateralComponente.SUL:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width) / 2;
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height);
        break;

      case LateralComponente.OESTE:
        x = converterPixeisParaNumero(estiloComponente.left);
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height) / 2;
        break;

      case LateralComponente.LESTE:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width);
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height) / 2;
        break;
    }

    return [x, y];
  }

  adicionarOuvinte(ouvinte: ComponenteDiagramaOuvinte): void {
    this._ouvintes.push(ouvinte);
  }

  removerOuvinte(
    ouvinte: ComponenteDiagramaOuvinte,
    alertar: boolean,
  ): ComponenteDiagramaOuvinte | null {
    let indexOuvinte: number = this._ouvintes.indexOf(ouvinte);

    if (alertar) {
      ouvinte.alertarRemovido();
    }

    if (indexOuvinte > -1) {
      this._ouvintes.splice(indexOuvinte, 1);
      return ouvinte;
    }

    return null;
  }

  atualizarOuvintes(): void {
    this._ouvintes.forEach((ouvinte: ComponenteDiagramaOuvinte): void => {
      ouvinte.atualizar(this._htmlComponente);
    });
  }

  removerTodosOuvintes(): ComponenteDiagramaOuvinte[] {
    let ouvintesRemovidos: ComponenteDiagramaOuvinte[] = [];
    let ouvintesCopia: ComponenteDiagramaOuvinte[] = this._ouvintes.slice();
    ouvintesCopia.forEach((ouvinte: ComponenteDiagramaOuvinte): void => {
      let ouvinteRemovido: ComponenteDiagramaOuvinte | null = this.removerOuvinte(ouvinte, true);

      if (ouvinteRemovido !== null) {
        ouvintesRemovidos.push(ouvinteRemovido);
      }
    });

    return ouvintesRemovidos;
  }
}
