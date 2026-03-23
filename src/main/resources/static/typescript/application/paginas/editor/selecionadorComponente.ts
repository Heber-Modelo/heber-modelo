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

import { converterPixeisParaNumero } from "../../../infrastructure/conversor/conversor.js";
import { ComponenteDiagrama } from "../../../model/componente/componenteDiagrama.js";
import { Ponto } from "../../../model/ponto.js";

export const CLASSE_ELEMENTO_SELECIONADO: string = "selected";

enum PosicaoRelativaPontoExtensor {
  TOP,
  TOP_RIGHT,
  TOP_LEFT,
  CENTER_RIGHT,
  CENTER_LEFT,
  BOTTOM,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

class PontoExtensor {
  public static readonly CLASSE_PONTO_EXTENSOR: string = "ponto-extensor";

  private readonly _elemento: HTMLElement;
  private readonly _posicaoRelativa: PosicaoRelativaPontoExtensor;
  private _posicaoAbsoluta: Ponto | null = null;
  private _elementoAtual: HTMLElement | null = null;

  constructor(elementoPai: HTMLElement, posicao: PosicaoRelativaPontoExtensor) {
    this._elemento = document.createElement("div");
    elementoPai.appendChild(elementoPai);
    elementoPai.classList.add(CLASSE_ELEMENTO_SELECIONADO);
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
  }

  private calcularPosicaoAbsoluta(
    elementoAlvo: HTMLElement,
    posicaoRelativa: PosicaoRelativaPontoExtensor,
  ): Ponto {
    let x: number = 0;
    let y: number = 0;

    let estiloElemento: CSSStyleDeclaration = getComputedStyle(elementoAlvo);

    switch (posicaoRelativa) {
      case PosicaoRelativaPontoExtensor.TOP:
        x =
          converterPixeisParaNumero(estiloElemento.left) +
          converterPixeisParaNumero(estiloElemento.width) / 2;
        y = converterPixeisParaNumero(estiloElemento.top);

        break;

      case PosicaoRelativaPontoExtensor.TOP_LEFT:
        x = converterPixeisParaNumero(estiloElemento.left);
        y = converterPixeisParaNumero(estiloElemento.top);

        break;

      case PosicaoRelativaPontoExtensor.TOP_RIGHT:
        x =
          converterPixeisParaNumero(estiloElemento.left) +
          converterPixeisParaNumero(estiloElemento.width);
        y = converterPixeisParaNumero(estiloElemento.top);

        break;

      case PosicaoRelativaPontoExtensor.CENTER_LEFT:
        x = converterPixeisParaNumero(estiloElemento.left);
        y =
          converterPixeisParaNumero(estiloElemento.top) +
          converterPixeisParaNumero(estiloElemento.height) / 2;

        break;

      case PosicaoRelativaPontoExtensor.CENTER_RIGHT:
        x =
          converterPixeisParaNumero(estiloElemento.left) +
          converterPixeisParaNumero(estiloElemento.width);
        y =
          converterPixeisParaNumero(estiloElemento.top) +
          converterPixeisParaNumero(estiloElemento.height) / 2;

        break;

      case PosicaoRelativaPontoExtensor.BOTTOM:
        x =
          converterPixeisParaNumero(estiloElemento.left) +
          converterPixeisParaNumero(estiloElemento.width) / 2;
        y =
          converterPixeisParaNumero(estiloElemento.top) +
          converterPixeisParaNumero(estiloElemento.height);

        break;

      case PosicaoRelativaPontoExtensor.BOTTOM_LEFT:
        x = converterPixeisParaNumero(estiloElemento.left);
        y =
          converterPixeisParaNumero(estiloElemento.top) +
          converterPixeisParaNumero(estiloElemento.height);

        break;

      case PosicaoRelativaPontoExtensor.BOTTOM_RIGHT:
        x =
          converterPixeisParaNumero(estiloElemento.left) +
          converterPixeisParaNumero(estiloElemento.width);
        y =
          converterPixeisParaNumero(estiloElemento.top) +
          converterPixeisParaNumero(estiloElemento.height);

        break;
    }

    return new Ponto(x, y);
  }
}

export class SelecionadorComponente {
  constructor() {
    this._componenteSelecionado = null;
    this._pontosExtensores = [];
    this._setas = document.querySelectorAll(".seta");
    this._setaSuperior = document.querySelector(".seta-superior") as HTMLElement;
    this._setaInferior = document.querySelector(".seta-inferior") as HTMLElement;
    this._setaDireita = document.querySelector(".seta-direita") as HTMLElement;
    this._setaEsquerda = document.querySelector(".seta-esquerda") as HTMLElement;
  }

  private _componenteSelecionado: ComponenteDiagrama | null;
  private readonly _pontosExtensores: PontoExtensor[];
  private readonly _setas: NodeListOf<HTMLElement>;
  private readonly _setaSuperior: HTMLElement;
  private readonly _setaInferior: HTMLElement;
  private readonly _setaDireita: HTMLElement;
  private readonly _setaEsquerda: HTMLElement;

  public selecionarElemento(componente: ComponenteDiagrama): void {
    if (this._componenteSelecionado !== null) {
      this._componenteSelecionado.htmlComponente.classList.remove(CLASSE_ELEMENTO_SELECIONADO);
    }
    this._componenteSelecionado = componente;
    this._componenteSelecionado.htmlComponente.classList.add(CLASSE_ELEMENTO_SELECIONADO);
    this.moverSetas(componente);
  }

  public adicionarElementoASelecao(componente: ComponenteDiagrama): void {}

  public removerSelecao(): void {
    if (this._componenteSelecionado !== null) {
      this._componenteSelecionado.htmlComponente.classList.remove(CLASSE_ELEMENTO_SELECIONADO);
      this._componenteSelecionado = null;
    }

    this._setas.forEach((s: HTMLElement): string => (s.style.display = "none"));
  }

  public moverSetas(componente: ComponenteDiagrama): void {
    if (!componente.recebeSetas) {
      return;
    }

    let estiloElemento: CSSStyleDeclaration = componente.pegarEstiloElemento();
    let estiloSeta: CSSStyleDeclaration = getComputedStyle(this._setas[0]);

    let alturaElemento: number = converterPixeisParaNumero(estiloElemento.height);
    let larguraElemento: number = converterPixeisParaNumero(estiloElemento.width);
    let topElemento: number = converterPixeisParaNumero(estiloElemento.top);
    let leftElemento: number = converterPixeisParaNumero(estiloElemento.left);
    let centroVertical: number = topElemento + alturaElemento / 2;
    let centroHorizontal: number = leftElemento + larguraElemento / 2;

    let alturaSeta: number = converterPixeisParaNumero(estiloSeta.height);
    let larguraSeta: number = converterPixeisParaNumero(estiloSeta.width);

    this._setaSuperior.style.top = `${centroVertical - alturaSeta * 2.5}px`;
    this._setaSuperior.style.left = `${centroHorizontal - larguraSeta / 2}px`;

    this._setaInferior.style.top = `${centroVertical + alturaSeta * 1.5}px`;
    this._setaInferior.style.left = `${centroHorizontal - larguraSeta / 2}px`;

    this._setaDireita.style.top = `${centroVertical - alturaSeta / 2}px`;
    this._setaDireita.style.left = `${centroHorizontal + larguraSeta * 2}px`;

    this._setaEsquerda.style.top = `${centroVertical - alturaSeta / 2}px`;
    this._setaEsquerda.style.left = `${centroHorizontal - larguraSeta * 3}px`;

    this._setas.forEach((s) => s.style.removeProperty("display"));
  }

  public moverSetasParaComponenteSelecionado(): void {
    if (this._componenteSelecionado !== null) {
      this.moverSetas(this._componenteSelecionado);
    }
  }

  public pegarHTMLElementoSelecionado(): HTMLElement | null {
    if (this._componenteSelecionado === null) {
      return null;
    }

    return this._componenteSelecionado.htmlComponente;
  }

  get componenteSelecionado(): ComponenteDiagrama | null {
    return this._componenteSelecionado;
  }
}
