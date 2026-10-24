/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import TiposAtributo from "domain/enum/tiposAtributo";
import PropriedadeSelecionavel from "domain/model/propriedade/propriedadeSelecionavel";

export default class PropriedadeSelecionavelTipoAtributo extends PropriedadeSelecionavel {
  public definirValorPropriedade(_: string): void {}

  protected pegarValorPropriedade(): string {
    let marcadorAtributo: HTMLElement | undefined | null =
      this._componente.htmlComponente.querySelector(".marcador-atributo");

    if (marcadorAtributo === undefined || marcadorAtributo === null) {
      return TiposAtributo.NORMAL.toUpperCase();
    }

    if (marcadorAtributo.classList.contains("primary-key")) {
      return TiposAtributo.CHAVE_PRIMARIA.toUpperCase();
    }

    if (marcadorAtributo.classList.contains("derivado")) {
      return TiposAtributo.DERIVADO.toUpperCase();
    }

    return TiposAtributo.NORMAL.toUpperCase();
  }
}
