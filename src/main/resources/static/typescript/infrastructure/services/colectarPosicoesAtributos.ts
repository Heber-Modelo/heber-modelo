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

import ComponenteFactory from "infrastructure/factory/componenteFactory";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import NomesComponente from "model/componente/nomesComponente";
import Ponto from "model/ponto";
import converterPixeisParaNumero from "model/services/converterPixeisParaNumero";

export default function colectarPosicoesAtributos(componentes: ComponenteDiagrama[]): Ponto[] {
  let pontos: Ponto[] = [];

  for (const componente of componentes) {
    if (
      componente.htmlComponente.getAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE) ===
      NomesComponente.ATRIBUTO_DER
    ) {
      let x: number = converterPixeisParaNumero(
        componente.htmlComponente.style.getPropertyValue("left"),
      );
      let y: number = converterPixeisParaNumero(
        componente.htmlComponente.style.getPropertyValue("top"),
      );
      pontos.push(new Ponto(x, y));
    }
  }

  return pontos;
}
