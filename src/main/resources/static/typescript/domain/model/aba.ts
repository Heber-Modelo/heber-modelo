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

export default class Aba {
  public static readonly ATRIBUTO_INDICE_ABA: string = "data-indice-aba";
  public static readonly CLASSE_ABA: string = "aba";
  public static readonly CLASSE_NUMERO_ABA: string = "numero-aba";

  private readonly _id: number;
  private readonly _htmlElement: HTMLDivElement;

  constructor(id: number, htmlElement: HTMLDivElement) {
    this._id = id;
    this._htmlElement = htmlElement;
  }

  get id(): number {
    return this._id;
  }

  get htmlElement(): HTMLDivElement {
    return this._htmlElement;
  }
}
