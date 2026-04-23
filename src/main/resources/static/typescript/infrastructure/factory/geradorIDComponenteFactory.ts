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

import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";

export default class GeradorIDComponenteFactory {
  private static _instance: GeradorIDComponente | null = null;

  static build(): GeradorIDComponente {
    if (this._instance === null) {
      this._instance = new GeradorIDComponente();
    }

    return this._instance;
  }
}
