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

import converterPixeisParaNumero from "infrastructure/conversor/conversor";
import Ponto from "model/ponto";
import PosicoesRelativasPontoExtensor from "model/posicoesRelativasPontoExtensor";

export default class PontoExtensor {
  public static readonly CLASSE_PONTO_EXTENSOR: string = "ponto-extensor";

  private readonly _elemento: HTMLElement;
  private readonly _posicaoRelativa: PosicoesRelativasPontoExtensor;
  private _posicaoAbsoluta: Ponto | null = null;
  private _elementoAtual: HTMLElement | null = null;

  constructor(elementoPai: HTMLElement, posicao: PosicoesRelativasPontoExtensor) {
    this._elemento = document.createElement("div");
    elementoPai.appendChild(this._elemento);
    this._elemento.classList.add(PontoExtensor.CLASSE_PONTO_EXTENSOR);
    this._elemento.style.display = "none";
    this._elemento.style.position = "absolute";
    this._elemento.style.zIndex = "3";
    this._posicaoRelativa = posicao;
  }

  public trocarElementoAtual(novoElementoAtual: HTMLElement | null): void {
    this._elementoAtual = novoElementoAtual;

    if (this._elementoAtual === null) {
      this._posicaoAbsoluta = null;
      return;
    }

    this._posicaoAbsoluta = this.calcularPosicaoAbsoluta(
      this._elementoAtual,
      this._posicaoRelativa,
    );

    this._elemento.style.left = `${this._posicaoAbsoluta.x}px`;
    this._elemento.style.top = `${this._posicaoAbsoluta.y}px`;
  }

  public esconderPonto(): void {
    this._elemento.style.display = "none";
  }

  public mostrarPonto(): void {
    this._elemento.style.removeProperty("display");
  }

  private calcularPosicaoAbsoluta(
    elementoAlvo: HTMLElement,
    posicaoRelativa: PosicoesRelativasPontoExtensor,
  ): Ponto {
    let estiloElemento: CSSStyleDeclaration = getComputedStyle(elementoAlvo);
    let estiloPontoExtensor: CSSStyleDeclaration = getComputedStyle(this._elemento);

    let leftElemento: number = converterPixeisParaNumero(estiloElemento.left);
    let topElemento: number = converterPixeisParaNumero(estiloElemento.top);
    let heightElemento: number = converterPixeisParaNumero(estiloElemento.height);
    let widthElemento: number = converterPixeisParaNumero(estiloElemento.width);

    let heightPontoExtensor: number = converterPixeisParaNumero(estiloPontoExtensor.height);
    let widthPontoExtensor: number = converterPixeisParaNumero(estiloPontoExtensor.width);

    let x: number = 0;
    let y: number = 0;

    switch (posicaoRelativa) {
      case PosicoesRelativasPontoExtensor.TOP:
        x = leftElemento + widthElemento / 2;
        y = topElemento;

        break;

      case PosicoesRelativasPontoExtensor.TOP_LEFT:
        x = leftElemento;
        y = topElemento;

        break;

      case PosicoesRelativasPontoExtensor.TOP_RIGHT:
        x = leftElemento + widthElemento;
        y = topElemento;

        break;

      case PosicoesRelativasPontoExtensor.CENTER_LEFT:
        x = leftElemento;
        y = topElemento + heightElemento / 2;

        break;

      case PosicoesRelativasPontoExtensor.CENTER_RIGHT:
        x = leftElemento + widthElemento;
        y = topElemento + heightElemento / 2;

        break;

      case PosicoesRelativasPontoExtensor.BOTTOM:
        x = leftElemento + widthElemento / 2;
        y = topElemento + heightElemento;

        break;

      case PosicoesRelativasPontoExtensor.BOTTOM_LEFT:
        x = leftElemento;
        y = topElemento + heightElemento;

        break;

      case PosicoesRelativasPontoExtensor.BOTTOM_RIGHT:
        x = leftElemento + widthElemento;
        y = topElemento + heightElemento;

        break;
    }

    x -= widthPontoExtensor / 2;
    y -= heightPontoExtensor / 2;

    return new Ponto(x, y);
  }
}
