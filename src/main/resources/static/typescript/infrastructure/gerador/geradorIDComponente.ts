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

export default class GeradorIDComponente {
  private constructor() {
    this._id = 0;
  }

  private static _instance: GeradorIDComponente;
  private _id: number;

  public static pegarInstance(): GeradorIDComponente {
    if (this._instance === undefined) {
      this._instance = new GeradorIDComponente();
    }

    return this._instance;
  }

  public pegarProximoID(): number {
    this._id++;
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
