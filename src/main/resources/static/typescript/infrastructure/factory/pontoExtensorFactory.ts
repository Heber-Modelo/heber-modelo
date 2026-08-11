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

import SelecionadorComponenteFactory from "infrastructure/factory/selecionadorComponenteFactory";
import FormulaPosicaoAbsoluta from "model/formula/formulaPosicaoAbsoluta";
import SelecionadorComponente from "infrastructure/selecionador/selecionadorComponente";
import Ponto from "model/ponto";
import PontoExtensor from "model/pontoExtensor";
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";
import converterPixeisParaNumero from "model/services/converterPixeisParaNumero";

export class PontoAnterior {
  static x: number = 0;
  static y: number = 0;
}

// noinspection DuplicatedCode
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) - deltaY / 2;
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;

          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;

          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let newLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left) - deltaX;
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) - deltaY / 2;
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;

          elementoAtual.style.left = `${newLeft}px`;
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = event.clientX - PontoAnterior.x;
          let deltaY: number = (event.clientY - PontoAnterior.y) * -1;
          let oldLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left);
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) - deltaY / 2;
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;

          elementoAtual.style.left = `${oldLeft}px`;
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let newLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left) - deltaX;
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;

          elementoAtual.style.left = `${newLeft}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          selecionadorComponente.atualizar();
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = event.clientX - PontoAnterior.x;
          let oldLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left);
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;
          elementoAtual.style.left = `${oldLeft}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          selecionadorComponente.atualizar();
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaY: number = event.clientY - PontoAnterior.y;
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) + deltaY / 2;
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.height = `${newHeight}px`;

          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
        };

      case PosicoesRelativasPontoExtensor.BOTTOM_LEFT:
        return function callback(event: MouseEvent): void {
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = (event.clientX - PontoAnterior.x) * -1;
          let deltaY: number = event.clientY - PontoAnterior.y;
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) + deltaY / 2;
          let newLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left) - deltaX;
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.left = `${newLeft}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
        };

      case PosicoesRelativasPontoExtensor.BOTTOM_RIGHT:
        return function callback(event: MouseEvent): void {
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

          let cssStyleDeclaration: CSSStyleDeclaration = getComputedStyle(elementoAtual);
          let deltaX: number = event.clientX - PontoAnterior.x;
          let deltaY: number = event.clientY - PontoAnterior.y;
          let newTop: number = converterPixeisParaNumero(cssStyleDeclaration.top) + deltaY / 2;
          let oldLeft: number = converterPixeisParaNumero(cssStyleDeclaration.left);
          let newHeight: number = converterPixeisParaNumero(cssStyleDeclaration.height) + deltaY;
          let newWidth: number = converterPixeisParaNumero(cssStyleDeclaration.width) + deltaX;
          elementoAtual.style.top = `${newTop}px`;
          elementoAtual.style.left = `${oldLeft}px`;
          elementoAtual.style.height = `${newHeight}px`;
          elementoAtual.style.width = `${newWidth}px`;

          PontoAnterior.x = event.clientX;
          PontoAnterior.y = event.clientY;
          selecionadorComponente.atualizar();
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
          );

      case PosicoesRelativasPontoExtensor.CENTER_LEFT:
        return (
          estiloElementoAtual: CSSStyleDeclaration,
          estiloPonto: CSSStyleDeclaration,
        ): Ponto =>
          new Ponto(
            converterPixeisParaNumero(estiloElementoAtual.left) -
              converterPixeisParaNumero(estiloPonto.height) / 2,
            converterPixeisParaNumero(estiloElementoAtual.top),
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
            converterPixeisParaNumero(estiloElementoAtual.top),
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
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
              converterPixeisParaNumero(estiloElementoAtual.height) / 2,
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
