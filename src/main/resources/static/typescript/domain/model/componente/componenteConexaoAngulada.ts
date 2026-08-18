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

import AbstractComponenteConexao from "domain/model/componente/abstractComponenteConexao";
import Ponto from "domain/model/ponto";
import calcularAnguloDoisPontos from "domain/services/calcularAnguloDoisPontos";
import converterPixeisParaNumero from "domain/services/converterPixeisParaNumero";

export default class ComponenteConexaoAngulada extends AbstractComponenteConexao {
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
