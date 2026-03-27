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

import ComponenteDiagrama from "model/componente/componenteDiagrama.js";
import converterPixeisParaNumero from "infrastructure/conversor/conversor.js";

export enum DirecoesMovimento {
  CIMA,
  BAIXO,
  ESQUERDA,
  DIREITA,
}

export function moverComponente(
  componenteAlvo: ComponenteDiagrama | null,
  direcao: DirecoesMovimento,
  incremento: number,
): void {
  if (componenteAlvo === null) {
    return;
  }

  let estiloComponente: CSSStyleDeclaration = componenteAlvo.pegarEstiloElemento();
  let valorAnterior: string;
  let novoValor: number;
  switch (direcao) {
    case DirecoesMovimento.CIMA:
      valorAnterior = estiloComponente.getPropertyValue("top");
      novoValor = converterPixeisParaNumero(valorAnterior) - incremento;
      componenteAlvo.htmlComponente.style.setProperty("top", `${novoValor}px`);
      break;

    case DirecoesMovimento.BAIXO:
      valorAnterior = estiloComponente.getPropertyValue("top");
      novoValor = converterPixeisParaNumero(valorAnterior) + incremento;
      componenteAlvo.htmlComponente.style.setProperty("top", `${novoValor}px`);
      break;

    case DirecoesMovimento.DIREITA:
      valorAnterior = estiloComponente.getPropertyValue("left");
      novoValor = converterPixeisParaNumero(valorAnterior) + incremento;
      componenteAlvo.htmlComponente.style.setProperty("left", `${novoValor}px`);
      break;

    case DirecoesMovimento.ESQUERDA:
      valorAnterior = estiloComponente.getPropertyValue("left");
      novoValor = converterPixeisParaNumero(valorAnterior) - incremento;
      componenteAlvo.htmlComponente.style.setProperty("left", `${novoValor}px`);
      break;
  }

  componenteAlvo.atualizarOuvintes();
}
