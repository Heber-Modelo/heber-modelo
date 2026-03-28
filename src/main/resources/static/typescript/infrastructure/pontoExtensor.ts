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
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";
import FormulaPosicaoAbsoluta from "model/formulaPosicaoAbsoluta";

export default class PontoExtensor {
  public static readonly CLASSE_PONTO_EXTENSOR: string = "ponto-extensor";

  private readonly _elemento: HTMLElement;
  private readonly _formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta;
  private readonly _posicaoRelativa: PosicoesRelativasPontoExtensor;
  private _posicaoAbsoluta: Ponto | null = null;
  private _elementoAtual: HTMLElement | null = null;

  constructor(
    elementoPai: HTMLElement,
    formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta,
    posicao: PosicoesRelativasPontoExtensor,
  ) {
    this._elemento = document.createElement("div");
    elementoPai.appendChild(this._elemento);
    this._elemento.classList.add(PontoExtensor.CLASSE_PONTO_EXTENSOR);
    this._elemento.style.display = "none";
    this._elemento.style.position = "absolute";
    this._elemento.style.zIndex = "3";
    this._formulaPosicaoAbsoluta = formulaPosicaoAbsoluta;
    this._posicaoRelativa = posicao;
  }

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
