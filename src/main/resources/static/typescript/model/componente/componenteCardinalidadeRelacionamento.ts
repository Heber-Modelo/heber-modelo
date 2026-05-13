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

import ComponenteDiagrama from "model/componente/componenteDiagrama";
import ComponenteDiagramaOuvinte from "model/componente/componenteDiagramaOuvinte";
import LateraisComponente from "model/componente/lateraisComponente";
import PropriedadeComponente from "model/propriedade/propriedadeComponente";
import Ponto from "model/ponto";

export default class ComponenteCardinalidadeRelacionamento
  extends ComponenteDiagrama
  implements ComponenteDiagramaOuvinte
{
  protected readonly _componente: ComponenteDiagrama;
  protected readonly _componenteConexao: ComponenteDiagrama;
  protected readonly _lateralComponente: LateraisComponente;

  constructor(
    htmlComponente: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    componente: ComponenteDiagrama,
    componenteConexao: ComponenteDiagrama,
    lateralComponente: LateraisComponente,
  ) {
    super(htmlComponente, propriedades);
    this._componente = componente;
    this._componenteConexao = componenteConexao;
    this._lateralComponente = lateralComponente;
    this._componente.adicionarOuvinte(this);

    htmlComponente.innerText = "(1, N)";
    this.ajustarPosicao();
  }

  private ajustarPosicao(): void {
    let novaPosicao: Ponto = this._componente.calcularPontoLateralComponente(
      this._lateralComponente,
    );
    this._htmlComponente.style.setProperty("top", `${novaPosicao.y}px`);
    this._htmlComponente.style.setProperty("left", `${novaPosicao.x}px`);
  }

  alertarRemovido(): void {
    this._htmlComponente.remove();
    this._componente.removerOuvinte(this, false);
  }

  atualizar(htmlElemento: HTMLDivElement): void {
    this.ajustarPosicao();
  }

  isDependente(): boolean {
    return true;
  }
}
