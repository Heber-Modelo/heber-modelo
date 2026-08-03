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
import converterPixeisParaNumero from "model/services/converterPixeisParaNumero";

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
      elementoPontoNorteValor.addEventListener(
        PropriedadeComponente.PROPERTY_CHANGE_EVENT,
        (): void => {
          this._lateralPrimeiroPonto =
            LateraisComponente[
              elementoPontoNorteValor.innerText as keyof typeof LateraisComponente
            ];
          this.atualizar(this._primeiroComponente.htmlComponente);
        },
      );
    }

    let elementoPontoSulValor: HTMLDivElement | null =
      this._htmlComponente.querySelector(".ponto-sul-valor");

    if (elementoPontoSulValor) {
      elementoPontoSulValor.innerText = LateraisComponente[lateralSegundoPonto];
      elementoPontoSulValor.addEventListener(
        PropriedadeComponente.PROPERTY_CHANGE_EVENT,
        (): void => {
          this._lateralSegundoPonto =
            LateraisComponente[elementoPontoSulValor.innerText as keyof typeof LateraisComponente];
          this.atualizar(this._segundoComponente.htmlComponente);
        },
      );
    }
  }

  protected ajustarConexao(): void {
    let alturaPrimeiroComponente: number = converterPixeisParaNumero(
      getComputedStyle(this._primeiroComponente.htmlComponente).height,
    );
    let alturaSegundoComponente: number = converterPixeisParaNumero(
      getComputedStyle(this._segundoComponente.htmlComponente).height,
    );

    let ponto1Ajustado: Ponto = new Ponto(
      this._ponto1.x,
      this._ponto1.y - alturaPrimeiroComponente / 2,
    );
    let ponto2Ajustado: Ponto = new Ponto(
      this._ponto2.x,
      this._ponto2.y - alturaSegundoComponente / 2,
    );
    let angulo: number = calcularAnguloDoisPontos(ponto1Ajustado, ponto2Ajustado);
    let distancia: number = this.calcularDistanciaConexao(ponto1Ajustado, ponto2Ajustado);

    this._htmlComponente.style.width = `${distancia}px`;
    this._htmlComponente.style.rotate = `${angulo}rad`;
    this._htmlComponente.style.top = `${ponto1Ajustado.y}px`;
    this._htmlComponente.style.left = `${ponto1Ajustado.x}px`;
  }

  private calcularDistanciaConexao(ponto1: Ponto, ponto2: Ponto): number {
    let deltaX: number = ponto2.x - ponto1.x;
    let deltaY: number = ponto2.y - ponto1.y;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}
