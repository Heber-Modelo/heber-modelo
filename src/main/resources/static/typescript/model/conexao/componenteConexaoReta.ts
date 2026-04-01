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

import AbstractComponenteConexao from "model/conexao/abstractComponenteConexao";

export default class ComponenteConexaoReta extends AbstractComponenteConexao {
  protected ajustarConexao(): void {
    let deltaX: number = this._ponto1.x - this._ponto2.x;
    let deltaY: number = this._ponto1.y - this._ponto2.y;

    let parteVertical: HTMLElement | null = this._htmlComponente.querySelector(".parte-vertical");
    let parteHorizontal: HTMLElement | null =
      this._htmlComponente.querySelector(".parte-horizontal");

    parteHorizontal?.style.setProperty("width", `${Math.abs(deltaX)}px`);
    parteVertical?.style.setProperty("height", `${Math.abs(deltaY)}px`);

    if (this._ponto1.y == this._ponto2.y) {
      parteVertical?.style.setProperty("top", `${this._ponto1.y}px`);
      parteHorizontal?.style.setProperty("top", `${this._ponto2.y}px`);
      parteHorizontal?.style.setProperty("left", `${this._ponto1.x}px`);
      parteVertical?.style.setProperty("left", `${this._ponto1.x}px`);
    }
  }
}
