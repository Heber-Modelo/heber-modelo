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
import calcularAnguloDoisPontos from "model/services/calcularAnguloDoisPontos";
import converterRadianosParaGraus from "model/services/converterRadianosParaGraus";

export default class ComponenteCardinalidadeRelacionamento
  extends ComponenteDiagrama
  implements ComponenteDiagramaOuvinte
{
  private readonly _componente: ComponenteDiagrama;
  private readonly _componenteConexao: ComponenteDiagrama;
  private readonly _componenteRelacionamento: ComponenteDiagrama;
  private readonly _lateralComponente: LateraisComponente;

  constructor(
    htmlComponente: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    componente: ComponenteDiagrama,
    componenteConexao: ComponenteDiagrama,
    componenteRelacionamento: ComponenteDiagrama,
    lateralComponente: LateraisComponente,
  ) {
    super(htmlComponente, propriedades);
    this._componente = componente;
    this._componenteConexao = componenteConexao;
    this._componenteRelacionamento = componenteRelacionamento;
    this._lateralComponente = lateralComponente;
    this._componente.adicionarOuvinte(this);
    this._componenteConexao.adicionarOuvinte(this);
    this._componenteRelacionamento.adicionarOuvinte(this);

    htmlComponente.innerText = "(1, N)";
    this.ajustarPosicao();
  }

  private ajustarPosicao(): void {
    let novaPosicao: Ponto = this._componente.calcularPontoLateralComponente(
      this._lateralComponente,
    );

    let componenteBoundingClientRect: DOMRect =
      this._componente.htmlComponente.getBoundingClientRect();
    let posicaoComponente: Ponto = new Ponto(
      componenteBoundingClientRect.left,
      componenteBoundingClientRect.top,
    );

    let relacionamentoBoundingClientRect: DOMRect =
      this._componenteRelacionamento.htmlComponente.getBoundingClientRect();
    let posicaoRelacionamento: Ponto = new Ponto(
      relacionamentoBoundingClientRect.left,
      relacionamentoBoundingClientRect.top,
    );

    let anguloEntreComponentes: number = converterRadianosParaGraus(
      calcularAnguloDoisPontos(posicaoComponente, posicaoRelacionamento),
    );

    if (anguloEntreComponentes > 165 || anguloEntreComponentes < -165) {
      novaPosicao.x -= this._htmlComponente.getBoundingClientRect().width;
    }

    if (anguloEntreComponentes > 75 && anguloEntreComponentes < 105) {
      novaPosicao.y += this._htmlComponente.getBoundingClientRect().height;
    }

    if (
      anguloEntreComponentes < -75 ||
      anguloEntreComponentes > -105 ||
      (anguloEntreComponentes < 15 && anguloEntreComponentes > -15)
    ) {
      novaPosicao.y -= this._htmlComponente.getBoundingClientRect().height;
    }

    this._htmlComponente.style.setProperty("top", `${novaPosicao.y}px`);
    this._htmlComponente.style.setProperty("left", `${novaPosicao.x}px`);
  }

  alertarRemovido(): void {
    this._htmlComponente.remove();
    this._componente.removerOuvinte(this, false);
  }

  atualizar(_: HTMLDivElement): void {
    this.ajustarPosicao();
  }

  isDependente(): boolean {
    return true;
  }
}
