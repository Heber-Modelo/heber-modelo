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

import LateraisComponente from "model/componente/lateraisComponente";
import FormulaPosicaoSeta from "model/formula/formulaPosicaoSeta";
import Ponto from "model/ponto";

export default class SetaConectora {
  public static readonly ATRIBUTO_LATERAL_COMPONENTE: string = "data-lateral-componente";
  private readonly _elemento: HTMLElement | null;
  private readonly _formulaPosicao: FormulaPosicaoSeta;

  constructor(
    classe: string,
    formulaPosicao: FormulaPosicaoSeta,
    lateralComponente: LateraisComponente,
  ) {
    this._elemento = document.querySelector(classe);
    this._formulaPosicao = formulaPosicao;

    this._elemento?.setAttribute(
      SetaConectora.ATRIBUTO_LATERAL_COMPONENTE,
      LateraisComponente[lateralComponente],
    );
  }

  public reposicionarSeta(elementoAtual: HTMLElement): void {
    if (this._elemento === null) {
      return;
    }

    let posicao: Ponto = this._formulaPosicao(
      getComputedStyle(elementoAtual),
      getComputedStyle(this._elemento),
    );
    this._elemento.style.left = `${posicao.x}px`;
    this._elemento.style.top = `${posicao.y}px`;
  }

  public mostrarSeta(): void {
    this._elemento?.style.removeProperty("display");
  }

  public esconderSeta(): void {
    this._elemento?.style.setProperty("display", "none");
  }

  set callback(callback: (event: MouseEvent) => void) {
    this._elemento?.addEventListener("mousedown", callback);
  }
}
