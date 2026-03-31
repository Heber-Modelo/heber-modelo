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

import SelecionadorComponente from "application/paginas/editor/selecionadorComponente";
import converterPixeisParaNumero from "infrastructure/conversor/conversor";
import SelecionadorComponenteFactory from "infrastructure/factory/selecionadorComponenteFactory";
import PontoExtensor from "infrastructure/pontoExtensor";
import Ponto from "model/ponto";
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";
import FormulaPosicaoAbsoluta from "model/formulaPosicaoAbsoluta";

export class PontoAnterior {
  static x: number = 0;
  static y: number = 0;
}

export default class PontoExtensorFactory {
  private decidirCallbackPontoExtensor(
    posicao: PosicoesRelativasPontoExtensor,
  ): (event: MouseEvent) => void {
    switch (posicao) {
      case PosicoesRelativasPontoExtensor.TOP:
        return function callback(event: MouseEvent): void {
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.y === 0) {
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let newTop: number = boundingRectangle.top - deltaY;
          let newHeight: number = boundingRectangle.height + deltaY;

          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;

          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.TOP_LEFT:
        return function callback(event: MouseEvent): void {
          // noinspection DuplicatedCode
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0 || PontoAnterior.y === 0) {
            PontoAnterior.x = event.clientX;
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let newLeft: number = boundingRectangle.left - deltaX;
          let newTop: number = boundingRectangle.top - deltaY;
          let newHeight: number = boundingRectangle.height + deltaY;
          let newWidth: number = boundingRectangle.width + deltaX;

          elementoAtual.style.left = `${newLeft}px`;
          // noinspection DuplicatedCode
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.TOP_RIGHT:
        return function callback(event: MouseEvent): void {
          // noinspection DuplicatedCode
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0 || PontoAnterior.y === 0) {
            PontoAnterior.x = event.clientX;
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = event.clientX - PontoAnterior.x;
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let oldLeft: number = boundingRectangle.left;
          let newTop: number = boundingRectangle.top - deltaY;
          let newHeight: number = boundingRectangle.height + deltaY;
          let newWidth: number = boundingRectangle.width + deltaX;

          elementoAtual.style.left = `${oldLeft}px`;
          // noinspection DuplicatedCode
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.CENTER_LEFT:
        return function callback(event: MouseEvent): void {
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0) {
            PontoAnterior.x = event.clientX;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let newLeft: number = boundingRectangle.left - deltaX;
          let newWidth: number = boundingRectangle.width + deltaX;

          elementoAtual.style.left = `${newLeft}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.CENTER_RIGHT:
        return function callback(event: MouseEvent): void {
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0) {
            PontoAnterior.x = event.clientX;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = event.clientX - PontoAnterior.x;
          let newWidth: number = boundingRectangle.width + deltaX;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.BOTTOM:
        return function callback(event: MouseEvent): void {
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.y === 0) {
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaY: number = event.clientY - PontoAnterior.y;
          let newHeight: number = boundingRectangle.height + deltaY;
          elementoAtual.style.height = `${newHeight}px`;

          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.BOTTOM_LEFT:
        return function callback(event: MouseEvent): void {
          // noinspection DuplicatedCode
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0 || PontoAnterior.y === 0) {
            PontoAnterior.x = event.clientX;
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let deltaY: number = event.clientY - PontoAnterior.y;
          let oldTop: number = boundingRectangle.top;
          let newLeft: number = boundingRectangle.left - deltaX;
          let newHeight: number = boundingRectangle.height + deltaY;
          let newWidth: number = boundingRectangle.width + deltaX;
          elementoAtual.style.top = `${oldTop}px`;
          elementoAtual.style.left = `${newLeft}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };

      case PosicoesRelativasPontoExtensor.BOTTOM_RIGHT:
        return function callback(event: MouseEvent): void {
          // noinspection DuplicatedCode
          let selecionadorComponente: SelecionadorComponente =
            SelecionadorComponenteFactory.build();
          let elementoAtual: HTMLDivElement | undefined =
            selecionadorComponente.componenteSelecionado?.htmlComponente;

          if (elementoAtual === undefined) {
            return;
          }

          if (PontoAnterior.x === 0 || PontoAnterior.y === 0) {
            PontoAnterior.x = event.clientX;
            PontoAnterior.y = event.clientY;
            return;
          }

          let boundingRectangle: DOMRect = elementoAtual.getBoundingClientRect();
          let deltaX: number = event.clientX - PontoAnterior.x;
          let deltaY: number = event.clientY - PontoAnterior.y;
          let oldTop: number = boundingRectangle.top;
          let oldLeft: number = boundingRectangle.left;
          let newHeight: number = boundingRectangle.height + deltaY;
          let newWidth: number = boundingRectangle.width + deltaX;
          elementoAtual.style.top = `${oldTop}px`;
          elementoAtual.style.left = `${oldLeft}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.reposicionarPontosExtensores();
          selecionadorComponente.moverSetasParaComponenteSelecionado();
        };
    }
  }

  private decidirFormulaPosicaoAbsoluta(
    posicao: PosicoesRelativasPontoExtensor,
  ): FormulaPosicaoAbsoluta {
    switch (posicao) {
      case PosicoesRelativasPontoExtensor.TOP:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) +
              converterPixeisParaNumero(estiloElementoAtual.width) / 2 -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.TOP_LEFT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.TOP_RIGHT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) +
              converterPixeisParaNumero(estiloElementoAtual.width) -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.CENTER_LEFT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) +
              converterPixeisParaNumero(estiloElementoAtual.height) / 2 -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.CENTER_RIGHT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) +
              converterPixeisParaNumero(estiloElementoAtual.width) -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) +
              converterPixeisParaNumero(estiloElementoAtual.height) / 2 -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.BOTTOM:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) +
              converterPixeisParaNumero(estiloElementoAtual.width) / 2 -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) +
              converterPixeisParaNumero(estiloElementoAtual.height) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.BOTTOM_LEFT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) +
              converterPixeisParaNumero(estiloElementoAtual.height) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.BOTTOM_RIGHT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) +
              converterPixeisParaNumero(estiloElementoAtual.width) -
              converterPixeisParaNumero(estiloPonto.width) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top) +
              converterPixeisParaNumero(estiloElementoAtual.height) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
          );
    }
  }

  public build(
    elementoPai: HTMLElement,
    posicaoPontoExtensor: PosicoesRelativasPontoExtensor,
  ): PontoExtensor {
    let callbackPontoExtensor: (event: MouseEvent) => void =
      this.decidirCallbackPontoExtensor(posicaoPontoExtensor);
    let formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta =
      this.decidirFormulaPosicaoAbsoluta(posicaoPontoExtensor);

    return new PontoExtensor(elementoPai, callbackPontoExtensor, formulaPosicaoAbsoluta);
  }
}
