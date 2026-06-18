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

import IRepositorioTiposDiagrama from "model/repositorio/iRepositorioTiposDiagrama";

export default class RepositorioTiposDiagrama implements IRepositorioTiposDiagrama {
  private readonly _tiposDiagramaElemento: HTMLElement | null =
    document.querySelector("#tipos-diagrama");
  private _tipos: string[] = [];

  adicionar(tipoDiagrama: string): void {
    if (this._tipos.includes(tipoDiagrama)) {
      return;
    }

    this._tipos.push(tipoDiagrama);

    if (this._tiposDiagramaElemento) {
      this._tiposDiagramaElemento.innerHTML = `[${this._tipos.join(", ")}]`;
    }

  }

  listar(): string[] {
    return this._tipos;
  }

  remover(tipoDiagrama: string): void {
    this._tipos = this._tipos.filter((tipo: string): boolean => tipo !== tipoDiagrama);

    if (this._tiposDiagramaElemento) {
      this._tiposDiagramaElemento.innerHTML = `[${this._tipos.join(", ")}]`;
    }
  }

}
