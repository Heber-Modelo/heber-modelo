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

import Aba from "model/aba";
import IRepositorioAbas from "model/repositorio/iRepositorioAbas";

export default class RepositorioAbas implements IRepositorioAbas {
  private _abas: Aba[] = [];

  adicionar(aba: Aba): void {
    this._abas.push(aba);
  }

  atualizar(aba: Aba): void {
    for (let i: number = 0; i < this._abas.length; i++) {
      if (this._abas[i] === aba) {
        this._abas[i] = aba;
      }
    }
  }

  limparMemoria(): void {
    this._abas = [];
  }

  listar(): Aba[] {
    return this._abas;
  }

  pegar(id: number): Aba | null {
    for (let aba of this._abas) {
      if (aba.id === id) {
        return aba;
      }
    }

    return null;
  }

  remover(aba: Aba): void {
    this.removerPorID(aba.id);
  }

  removerPorID(id: number): void {
    for (let i: number = 0; i < this._abas.length; i++) {
      if (this._abas[i].id === id) {
        this._abas.splice(i, 1);
      }
    }
  }
}
