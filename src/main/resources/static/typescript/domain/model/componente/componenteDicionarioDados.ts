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
import DicionarioDadosJSON from "domain/json/dicionarioDadosJSON";

export default class ComponenteDicionarioDados extends ComponenteDiagrama {
  constructor(htmlComponente: HTMLDivElement) {
    super(htmlComponente, []);
  }

  public toJSON(): BaseJSONComponente {
    let tabelaDicionario: HTMLTableElement | null = this._htmlComponente.querySelector("table");

    if (!tabelaDicionario) {
      throw new Error();
    }

    let tbody: HTMLTableSectionElement = tabelaDicionario.tBodies[0];

    let idAba: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_ABA),
    );
    let idComponente: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE),
    );
    let nomeComponente: string =
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_NOME_COMPONENTE) || "";
    let nomeEntidade: string = this._htmlComponente.querySelector("caption")?.innerHTML || "";

    let atributos: string[] = [];
    let descricoes: string[] = [];
    let tipos: string[] = [];
    let tamanhos: string[] = [];
    let nulos: string[] = [];
    let regras: string[] = [];
    let chaves: string[] = [];
    let defaults: string[] = [];
    let unicos: string[] = [];

    for (const row of tbody.rows) {
      atributos.push(row.cells[0].children[0].innerHTML);
      descricoes.push(row.cells[1].children[0].innerHTML);
      tipos.push(row.cells[2].children[0].innerHTML);
      tamanhos.push(row.cells[3].children[0].innerHTML);
      nulos.push(row.cells[4].children[0].innerHTML);
      regras.push(row.cells[5].children[0].innerHTML);
      chaves.push(row.cells[6].children[0].innerHTML);
      defaults.push(row.cells[7].children[0].innerHTML);
      unicos.push(row.cells[8].children[0].innerHTML);
    }

    return {
      idAba,
      idComponente,
      nomeComponente,
      nomeEntidade,
      atributos,
      descricoes,
      tipos,
      tamanhos,
      nulos,
      regras,
      chaves,
      defaults,
      unicos,
    } as DicionarioDadosJSON;
  }
}
