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

import { IFactory } from "../../model/factory/iFactory";
import { RepositorioComponente } from "../repositorio/repositorioComponente.js";

class RepositorioComponenteFactory implements IFactory<RepositorioComponente> {
  private _repositorio: RepositorioComponente | null = null;

  public build(): RepositorioComponente {
    if (this._repositorio === null) {
      this._repositorio = new RepositorioComponente();
    }

    return this._repositorio;
  }
}

export const repositorioComponenteFactory: RepositorioComponenteFactory =
  new RepositorioComponenteFactory();
