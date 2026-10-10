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

import TiposConexao from "domain/enum/tiposConexao";
import PropriedadeSelecionavel from "domain/model/propriedade/propriedadeSelecionavel";

export default class PropriedadeSelecionavelTipoConexao extends PropriedadeSelecionavel {
  public definirValorPropriedade(_: string): void {}

  protected pegarValorPropriedade(): string {
    if (this._componente.htmlComponente.classList.contains("elemento-conexao-entidade-fraca")) {
      return TiposConexao.CONEXAO_ENTIDADE_FRACA.toUpperCase();
    }

    if (this._componente.htmlComponente.classList.contains("elemento-conexao-seta")) {
      return TiposConexao.CONEXAO_SETA.toUpperCase();
    }

    return TiposConexao.CONEXAO_ANGULADA.toUpperCase();
  }
}
