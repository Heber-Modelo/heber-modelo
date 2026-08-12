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
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import Aba from "model/aba";

export default class SelecionadorAba {
  public static readonly CLASSE_ABA_SELECIONADA: string = "selected";
  private _abaSelecionada: Aba | null = null;
  private readonly _iRepositorioComponente: IRepositorioComponente;

  constructor(iRepositorioComponente: IRepositorioComponente) {
    this._iRepositorioComponente = iRepositorioComponente;
  }

  private mostrarApenasComponentesAba(): void {
    let idAba: number = this._abaSelecionada?.id || 1;

    for (const componente of this._iRepositorioComponente.listar()) {
      if (
        Number(componente.htmlComponente.getAttribute(ComponenteFactory.PROPRIEDADE_ID_ABA)) ===
        idAba
      ) {
        componente.htmlComponente.style.removeProperty("display");
      } else {
        componente.htmlComponente.style.setProperty("display", "none");
      }
    }
  }

  public selecionarAba(aba: Aba): void {
    this._abaSelecionada?.htmlElement.classList.remove(SelecionadorAba.CLASSE_ABA_SELECIONADA);
    this._abaSelecionada = aba;
    this._abaSelecionada.htmlElement.classList.add(SelecionadorAba.CLASSE_ABA_SELECIONADA);

    this.mostrarApenasComponentesAba();
  }

  public removerSelecao(): void {
    this._abaSelecionada?.htmlElement.classList.remove(SelecionadorAba.CLASSE_ABA_SELECIONADA);
    this._abaSelecionada = null;
  }

  get abaSelecionada(): Aba | null {
    return this._abaSelecionada;
  }
}
