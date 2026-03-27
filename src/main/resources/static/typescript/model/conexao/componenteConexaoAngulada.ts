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

import AbstractComponenteConexao from "model/conexao/abstractComponenteConexao.js";

export default class ComponenteConexaoAngulada extends AbstractComponenteConexao {
  protected ajustarConexao(): void {
    let angulo: number = this.calcularAnguloConexao();
    let distancia: number = this.calcularDistanciaConexao();

    this._htmlComponente.style.width = `${distancia}px`;
    this._htmlComponente.style.rotate = `${angulo}rad`;
    this._htmlComponente.style.top = `${this._ponto1.y}px`;
    this._htmlComponente.style.left = `${this._ponto1.x}px`;
  }

  private calcularAnguloConexao(): number {
    let deltaX: number = this._ponto2.x - this._ponto1.x;
    let deltaY: number = this._ponto2.y - this._ponto1.y;

    return Math.atan2(deltaY, deltaX);
  }

  private calcularDistanciaConexao(): number {
    let deltaX: number = this._ponto2.x - this._ponto1.x;
    let deltaY: number = this._ponto2.y - this._ponto1.y;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}
