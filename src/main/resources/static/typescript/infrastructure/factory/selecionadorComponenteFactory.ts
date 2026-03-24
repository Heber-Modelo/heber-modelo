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
import { SelecionadorComponente } from "../../application/paginas/editor/selecionadorComponente.js";
import PontoExtensor from "../../application/paginas/editor/pontoExtensor.js";
import PosicoesRelativasPontoExtensor from "../../model/posicoesRelativasPontoExtensor.js";

class SelecionadorComponenteFactory implements IFactory<SelecionadorComponente> {
  private _selecionador: SelecionadorComponente | null = null;

  public build(): SelecionadorComponente {
    if (this._selecionador === null) {
      let diagrama: HTMLElement = document.querySelector("main") as HTMLElement;
      let pontosExtensores: PontoExtensor[] = Object.keys(PosicoesRelativasPontoExtensor)
        .slice(
          Object.keys(PosicoesRelativasPontoExtensor).length / 2,
          Object.keys(PosicoesRelativasPontoExtensor).length,
        )
        .map(
          (posicao: string): PontoExtensor =>
            new PontoExtensor(
              diagrama,
              PosicoesRelativasPontoExtensor[
                posicao as keyof typeof PosicoesRelativasPontoExtensor
              ],
            ),
        );

      this._selecionador = new SelecionadorComponente(pontosExtensores);
    }

    return this._selecionador;
  }
}

export const selecionadorComponenteFactory: SelecionadorComponenteFactory =
  new SelecionadorComponenteFactory();
