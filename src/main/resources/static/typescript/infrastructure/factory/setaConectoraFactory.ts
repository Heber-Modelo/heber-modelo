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
import SetaConectora from "infrastructure/setaConectora";
import PosicoesRelativasSetasConectoras from "model/posicoes/posicoesRelativasSetasConectoras";
import FormulaPosicaoSeta from "model/formula/formulaPosicaoSeta";
import Ponto from "model/ponto";

export default class SetaConectoraFactory {
  private decidirFormulaPosicaoSeta(
    posicaoSeta: PosicoesRelativasSetasConectoras,
  ): FormulaPosicaoSeta {
    switch (posicaoSeta) {
      case PosicoesRelativasSetasConectoras.TOP:
        return (estiloComponente: CSSStyleDeclaration, estiloSeta: CSSStyleDeclaration): Ponto => {
          let componenteTop: number = converterPixeisParaNumero(estiloComponente.top);
          let componenteLeft: number = converterPixeisParaNumero(estiloComponente.left);
          let componenteWidth: number = converterPixeisParaNumero(estiloComponente.width);
          let centroHorizontal: number = componenteLeft + componenteWidth / 2;

          let setaHeight: number = converterPixeisParaNumero(estiloSeta.height);
          let setaWidth: number = converterPixeisParaNumero(estiloSeta.width);

          let x: number = centroHorizontal - setaWidth / 2;
          let y: number = componenteTop - setaHeight * 1.5;

          return new Ponto(x, y);
        };

      case PosicoesRelativasSetasConectoras.BOTTOM:
        return (estiloComponente: CSSStyleDeclaration, estiloSeta: CSSStyleDeclaration): Ponto => {
          let componenteTop: number = converterPixeisParaNumero(estiloComponente.top);
          let componenteLeft: number = converterPixeisParaNumero(estiloComponente.left);
          let componenteHeight: number = converterPixeisParaNumero(estiloComponente.height);
          let componenteWidth: number = converterPixeisParaNumero(estiloComponente.width);
          let centroHorizontal: number = componenteLeft + componenteWidth / 2;

          let setaHeight: number = converterPixeisParaNumero(estiloSeta.height);
          let setaWidth: number = converterPixeisParaNumero(estiloSeta.width);

          let x: number = centroHorizontal - setaWidth / 2;
          let y: number = componenteTop + componenteHeight + setaHeight * 0.5;

          return new Ponto(x, y);
        };

      case PosicoesRelativasSetasConectoras.LEFT:
        return (estiloComponente: CSSStyleDeclaration, estiloSeta: CSSStyleDeclaration): Ponto => {
          let componenteTop: number = converterPixeisParaNumero(estiloComponente.top);
          let componenteLeft: number = converterPixeisParaNumero(estiloComponente.left);
          let componenteHeight: number = converterPixeisParaNumero(estiloComponente.height);
          let centroVertical: number = componenteTop + componenteHeight / 2;

          let setaHeight: number = converterPixeisParaNumero(estiloSeta.height);
          let setaWidth: number = converterPixeisParaNumero(estiloSeta.width);

          let x: number = componenteLeft - setaWidth * 1.5;
          let y: number = centroVertical - setaHeight / 2;

          return new Ponto(x, y);
        };

      case PosicoesRelativasSetasConectoras.RIGHT:
        return (estiloComponente: CSSStyleDeclaration, estiloSeta: CSSStyleDeclaration): Ponto => {
          let componenteTop: number = converterPixeisParaNumero(estiloComponente.top);
          let componenteLeft: number = converterPixeisParaNumero(estiloComponente.left);
          let componenteHeight: number = converterPixeisParaNumero(estiloComponente.height);
          let componenteWidth: number = converterPixeisParaNumero(estiloComponente.width);
          let centroVertical: number = componenteTop + componenteHeight / 2;

          let setaHeight: number = converterPixeisParaNumero(estiloSeta.height);

          let x: number = componenteLeft + componenteWidth + setaHeight * 0.5;
          let y: number = centroVertical - setaHeight / 2;

          return new Ponto(x, y);
        };
    }
  }

  public build(posicaoSeta: PosicoesRelativasSetasConectoras): SetaConectora {
    let formulaPosicao: FormulaPosicaoSeta = this.decidirFormulaPosicaoSeta(posicaoSeta);

    return new SetaConectora(posicaoSeta, formulaPosicao);
  }
}
