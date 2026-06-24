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

import LateraisComponente from "model/componente/lateraisComponente";
import Ponto from "model/ponto";

const LIMITE_MINIMO_ALTURA: number = 0.4;
const LIMITE_MAXIMO_ALTURA: number = 0.6;
const LIMITE_MINIMO_LARGURA: number = 0.2;
const LIMITE_MAXIMO_LARGURA: number = 0.8;

export default function calcularLateralComponente(
  elementoAlvo: HTMLElement,
  ponto: Ponto,
): LateraisComponente {
  let dimensoesElemento: DOMRect = elementoAlvo.getBoundingClientRect();

  let esquerda: boolean = false;
  let direita: boolean = false;
  let centroX: boolean = false;

  if (
    ponto.x > dimensoesElemento.width * LIMITE_MINIMO_LARGURA &&
    ponto.x < dimensoesElemento.width * LIMITE_MAXIMO_LARGURA
  ) {
    centroX = true;
  } else if (ponto.x <= dimensoesElemento.width * LIMITE_MINIMO_LARGURA) {
    esquerda = true;
  } else {
    direita = true;
  }

  let cima: boolean = false;
  let baixo: boolean = false;
  let centroY: boolean = false;

  if (
    ponto.y > dimensoesElemento.height * LIMITE_MINIMO_ALTURA &&
    ponto.y < dimensoesElemento.height * LIMITE_MAXIMO_ALTURA
  ) {
    centroY = true;
  } else if (ponto.y <= dimensoesElemento.height * LIMITE_MINIMO_ALTURA) {
    cima = true;
  } else {
    baixo = true;
  }

  if ((centroY || baixo || cima) && esquerda) {
    return LateraisComponente.OESTE;
  } else if ((centroY || baixo || cima) && direita) {
    return LateraisComponente.LESTE;
  } else if ((centroX && centroY) || cima) {
    return LateraisComponente.NORTE;
  } else {
    return LateraisComponente.SUL;
  }
}
