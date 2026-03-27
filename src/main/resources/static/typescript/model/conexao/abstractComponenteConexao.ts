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

import ComponenteDiagrama, { LateralComponente } from "model/componente/componenteDiagrama.js";
import ComponenteDiagramaOuvinte from "model/componente/componenteDiagramaOuvinte.js";
import Ponto from "model/ponto.js";
import PropriedadeComponente from "model/propriedade/propriedadeComponente.js";

export default abstract class AbstractComponenteConexao
  extends ComponenteDiagrama
  implements ComponenteDiagramaOuvinte
{
  protected _ponto1: Ponto;
  protected _ponto2: Ponto;
  protected readonly _lateralPrimeiroPonto: LateralComponente;
  protected readonly _lateralSegundoPonto: LateralComponente;
  protected readonly _primeiroComponente: ComponenteDiagrama;
  protected readonly _segundoComponente: ComponenteDiagrama;

  constructor(
    htmlComponente: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    ponto1: Ponto,
    ponto2: Ponto,
    lateralPrimeiroPonto: LateralComponente,
    lateralSegundoPonto: LateralComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
  ) {
    super(htmlComponente, propriedades);
    this._ponto1 = ponto1;
    this._ponto2 = ponto2;
    this._lateralPrimeiroPonto = lateralPrimeiroPonto;
    this._lateralSegundoPonto = lateralSegundoPonto;
    this._primeiroComponente = primeiroComponente;
    this._segundoComponente = segundoComponente;
    this._primeiroComponente.adicionarOuvinte(this);
    this._segundoComponente.adicionarOuvinte(this);
    this._recebeSetas = false;
    this.ajustarConexao();
  }

  protected abstract ajustarConexao(): void;

  atualizar(htmlElemento: HTMLDivElement): void {
    if (this._primeiroComponente.htmlComponente === htmlElemento) {
      let ponto: number[] = this._primeiroComponente.calcularPontoLateralComponente(
        this._lateralPrimeiroPonto,
      );
      this._ponto1 = new Ponto(ponto[0], ponto[1]);
    } else {
      let ponto: number[] = this._segundoComponente.calcularPontoLateralComponente(
        this._lateralSegundoPonto,
      );
      this._ponto2 = new Ponto(ponto[0], ponto[1]);
    }
    this.ajustarConexao();
  }

  alertarRemovido(): void {
    this._htmlComponente.remove();
    this._primeiroComponente.removerOuvinte(this, false);
    this._segundoComponente.removerOuvinte(this, false);
  }

  isDependente(): boolean {
    return true;
  }
}
