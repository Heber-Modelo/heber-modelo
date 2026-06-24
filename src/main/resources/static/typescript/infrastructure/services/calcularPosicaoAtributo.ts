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

import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import Ponto from "model/ponto";

export default function calcularPosicaoAtributo(
  componenteAlvo: ComponenteDiagrama,
  componenteAtributo: ComponenteDiagrama | null,
  lateralComponente: LateraisComponente,
): Ponto {
  let pontoInicial = componenteAlvo.calcularPontoLateralComponente(lateralComponente);

  let offsetX: number = 0;

  if (lateralComponente === LateraisComponente.LESTE) {
    offsetX = 50;
  } else if (lateralComponente === LateraisComponente.OESTE) {
    offsetX = -125;
  }

  let offsetY: number = 0;

  if (lateralComponente === LateraisComponente.NORTE) {
    offsetY = -75;
  } else if (lateralComponente === LateraisComponente.SUL) {
    offsetY = 25;
  } else if (componenteAtributo) {
    offsetY = -componenteAtributo.htmlComponente.getBoundingClientRect().height / 2;
  }

  return new Ponto(pontoInicial.x + offsetX, pontoInicial.y + offsetY);
}
