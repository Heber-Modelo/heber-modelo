/*
 * Copyright (c) 2025-2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import AbstractComponenteConexao from "model/componente/abstractComponenteConexao";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import Ponto from "model/ponto";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";
import calcularAnguloDoisPontos from "model/services/calcularAnguloDoisPontos";

export default class ComponenteConexaoAngulada extends AbstractComponenteConexao {
  constructor(
    htmlComponente: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    ponto1: Ponto,
    ponto2: Ponto,
    lateralPrimeiroPonto: LateraisComponente,
    lateralSegundoPonto: LateraisComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
  ) {
    super(
      htmlComponente,
      propriedades,
      ponto1,
      ponto2,
      lateralPrimeiroPonto,
      lateralSegundoPonto,
      primeiroComponente,
      segundoComponente,
    );

    let elementoPontoNorteValor: HTMLDivElement | null =
      this.htmlComponente.querySelector(".ponto-norte-valor");

    if (elementoPontoNorteValor) {
      elementoPontoNorteValor.innerText = LateraisComponente[lateralPrimeiroPonto];
    }

    let elementoPontoSulValor: HTMLDivElement | null =
      this._htmlComponente.querySelector(".ponto-sul-valor");

    if (elementoPontoSulValor) {
      elementoPontoSulValor.innerText = LateraisComponente[lateralSegundoPonto];
    }
  }

  protected ajustarConexao(): void {
    let angulo: number = calcularAnguloDoisPontos(this._ponto1, this._ponto2);
    let distancia: number = this.calcularDistanciaConexao();

    this._htmlComponente.style.width = `${distancia}px`;
    this._htmlComponente.style.rotate = `${angulo}rad`;
    this._htmlComponente.style.top = `${this._ponto1.y}px`;
    this._htmlComponente.style.left = `${this._ponto1.x}px`;
  }

  private calcularDistanciaConexao(): number {
    let deltaX: number = this._ponto2.x - this._ponto1.x;
    let deltaY: number = this._ponto2.y - this._ponto1.y;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}
