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

import RepositorioComponenteFactory from "infrastructure/factory/repositorioComponenteFactory";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";

export default class SelecionadorAbaFactory {
  private static _selecionadorAba: SelecionadorAba | null = null;

  public static build(): SelecionadorAba {
    if (this._selecionadorAba === null) {
      this._selecionadorAba = new SelecionadorAba(RepositorioComponenteFactory.build());
    }

    return this._selecionadorAba;
  }
}
