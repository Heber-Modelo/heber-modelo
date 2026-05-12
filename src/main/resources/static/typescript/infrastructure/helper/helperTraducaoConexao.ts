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

import TiposConexao from "model/conexao/tiposConexao";
import ResponseTraducaoJSON from "model/response/responseTraducaoJSON";

export default async function helperTraducaoConexao(tipoConexao: TiposConexao): Promise<string> {
  let chaveTraducao: string;

  switch (tipoConexao) {
    case TiposConexao.CONEXAO_ANGULADA:
      chaveTraducao = "web.page.editor.section.type-selector.angled-connection";
      break;

    case TiposConexao.CONEXAO_ENTIDADE_FRACA:
      chaveTraducao = "web.page.editor.section.type-selector.weak-entity-connection";
      break;

    case TiposConexao.CONEXAO_RETA:
      chaveTraducao = "web.page.editor.section.type-selector.straight-connection";
      break;

    case TiposConexao.CONEXAO_SETA:
      chaveTraducao = "web.page.editor.section.type-selector.arrow-connection";
      break;
  }

  let responseJson: ResponseTraducaoJSON = await (await fetch(`traducao/${chaveTraducao}`)).json();
  return responseJson.mensagem;
}
