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

import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import BaseJSONComponente from "domain/json/baseJSONComponente";
import DescricaoRelacionalJSON from "domain/json/descricaoRelacionalJSON";

export default class ComponenteDescricaoRelacional extends ComponenteDiagrama {
  public static readonly CLASSE_AREA_EDICAO: string = ".ql-editor";

  constructor(htmlComponente: HTMLDivElement) {
    super(htmlComponente, []);
  }

  public toJSON(): BaseJSONComponente {
    let idAba: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_ABA),
    );
    let idComponente: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE),
    );
    let areaEdicao: HTMLElement | null = this._htmlComponente.querySelector(
      ComponenteDescricaoRelacional.CLASSE_AREA_EDICAO,
    );
    let descricaoHTML: string = areaEdicao?.innerHTML || "";

    return {
      idAba,
      idComponente,
      nomeComponente: this.nome,
      descricaoHTML,
    } as DescricaoRelacionalJSON;
  }
}
