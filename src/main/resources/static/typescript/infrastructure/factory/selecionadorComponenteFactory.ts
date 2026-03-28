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

import SelecionadorComponente from "application/paginas/editor/selecionadorComponente";
import PontoExtensor from "infrastructure/pontoExtensor";
import PontoExtensorFactory from "infrastructure/factory/pontoExtensorFactory";
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";

export default class SelecionadorComponenteFactory {
  private static _selecionador: SelecionadorComponente | null = null;

  public static build(): SelecionadorComponente {
    if (this._selecionador === null) {
      let diagrama: HTMLElement = document.querySelector("main") as HTMLElement;
      let pontoExtensorFactory: PontoExtensorFactory = new PontoExtensorFactory();
      let pontosExtensores: PontoExtensor[] = Object.keys(PosicoesRelativasPontoExtensor)
        .slice(
          Object.keys(PosicoesRelativasPontoExtensor).length / 2,
          Object.keys(PosicoesRelativasPontoExtensor).length,
        )
        .map(
          (posicao: string): PontoExtensor =>
            pontoExtensorFactory.build(
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
