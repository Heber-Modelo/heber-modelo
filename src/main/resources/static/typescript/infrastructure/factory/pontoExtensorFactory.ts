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
import PontoExtensor from "infrastructure/pontoExtensor";
import Ponto from "model/ponto";
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";
import FormulaPosicaoAbsoluta from "model/formulaPosicaoAbsoluta";

export default class PontoExtensorFactory {
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
    let formulaPosicaoAbsoluta: FormulaPosicaoAbsoluta =
      this.decidirFormulaPosicaoAbsoluta(posicaoPontoExtensor);

    return new PontoExtensor(elementoPai, formulaPosicaoAbsoluta, posicaoPontoExtensor);
  }
}
