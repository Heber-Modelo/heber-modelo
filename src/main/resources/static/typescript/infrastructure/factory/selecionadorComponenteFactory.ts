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
import SetaConectoraFactory from "infrastructure/factory/setaConectoraFactory";
import SetaConectora from "infrastructure/conexao/setaConectora";
import LateraisComponente from "model/componente/lateraisComponente";
import PosicoesRelativasPontoExtensor from "model/posicoes/posicoesRelativasPontoExtensor";
import PosicoesRelativasSetasConectoras from "model/posicoes/posicoesRelativasSetasConectoras";

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

      let setaConectoraFactory: SetaConectoraFactory = new SetaConectoraFactory();
      let zippedEnums: string[][] = Object.keys(PosicoesRelativasSetasConectoras).map(
        (posicao: string, index: number): string[] => [posicao, LateraisComponente[index]],
      );

      let setasConectoras: SetaConectora[] = zippedEnums.map(
        (zippedValue: string[]): SetaConectora =>
          setaConectoraFactory.build(
            PosicoesRelativasSetasConectoras[
              zippedValue[0] as keyof typeof PosicoesRelativasSetasConectoras
            ],
            LateraisComponente[zippedValue[1] as keyof typeof LateraisComponente],
          ),
      );

      this._selecionador = new SelecionadorComponente(pontosExtensores, setasConectoras);
    }

    return this._selecionador;
  }
}
