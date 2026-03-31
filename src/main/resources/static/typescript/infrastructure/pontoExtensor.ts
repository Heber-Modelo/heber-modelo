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

import Ponto from "model/ponto";
import FormulaPosicaoAbsoluta from "model/formula/formulaPosicaoAbsoluta";
import { PontoAnterior } from "./factory/pontoExtensorFactory";

export default class PontoExtensor {
  public static readonly CLASSE_PONTO_EXTENSOR: string = "ponto-extensor";

  private readonly _elemento: HTMLElement;
  private readonly _callback: (event: MouseEvent) => void;
  private readonly _formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta;
  private _posicaoAbsoluta: Ponto | null = null;
  private _elementoAtual: HTMLElement | null = null;

  constructor(
    elementoPai: HTMLElement,
    callback: (event: MouseEvent) => void,
    formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta,
  ) {
    this._callback = callback;
    this._formulaPosicaoAbsoluta = formulaPosicaoAbsoluta;

    this._elemento = document.createElement("div");
    elementoPai.appendChild(this._elemento);
    this._elemento.classList.add(PontoExtensor.CLASSE_PONTO_EXTENSOR);
    this._elemento.style.display = "none";
    this._elemento.addEventListener("mousedown", this.iniciarReajuste);
  }

  public iniciarReajuste = (): void => {
    PontoAnterior.x = 0;
    PontoAnterior.y = 0;

    window.addEventListener("mouseup", this.pararReajuste);
    window.addEventListener("mousemove", this._callback);
  };

  public pararReajuste = (): void => {
    window.removeEventListener("mouseup", this.pararReajuste);
    window.removeEventListener("mousemove", this._callback);
  };

  public trocarElementoAtual(novoElementoAtual: HTMLElement | null): void {
    this._elementoAtual = novoElementoAtual;

    if (this._elementoAtual === null) {
      this._posicaoAbsoluta = null;
      return;
    }

    let estiloElementoAtual: CSSStyleDeclaration = getComputedStyle(this._elementoAtual);
    let estiloPonto: CSSStyleDeclaration = getComputedStyle(this._elemento);
    this._posicaoAbsoluta = this._formulaPosicaoAbsoluta(estiloElementoAtual, estiloPonto);
    this._elemento.style.left = `${this._posicaoAbsoluta.x}px`;
    this._elemento.style.top = `${this._posicaoAbsoluta.y}px`;
  }

  public esconderPonto(): void {
    this._elemento.style.display = "none";
  }

  public mostrarPonto(): void {
    this._elemento.style.removeProperty("display");
  }
}
