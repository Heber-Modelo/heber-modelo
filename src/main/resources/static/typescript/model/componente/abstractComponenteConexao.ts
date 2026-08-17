/*
 * Copyright (c) 2025-2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

export default abstract class AbstractComponenteConexao
  extends ComponenteDiagrama
  implements ComponenteDiagramaOuvinte
{
  protected _ponto1: Ponto;
  protected _ponto2: Ponto;
  protected _lateralPrimeiroPonto: LateraisComponente;
  protected _lateralSegundoPonto: LateraisComponente;
  protected readonly _primeiroComponente: ComponenteDiagrama;
  protected readonly _segundoComponente: ComponenteDiagrama;

  constructor(
    htmlComponente: HTMLDivElement,
    propriedades: PropriedadeComponente[],
    ponto1: Ponto,
    ponto2: Ponto,
    lateralPrimeiroPonto: LateraisComponente,
    lateralSegundoPonto: LateraisComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
  ) {
    super(htmlComponente, propriedades);
    this._ponto1 = ponto1;
    this._ponto2 = ponto2;
    this._lateralPrimeiroPonto = lateralPrimeiroPonto;
    this._lateralSegundoPonto = lateralSegundoPonto;
    this._primeiroComponente = primeiroComponente;
    this._segundoComponente = segundoComponente;
    this._primeiroComponente.adicionarOuvinte(this);
    this._segundoComponente.adicionarOuvinte(this);
    this._recebeSetas = false;
    this.ajustarConexao();

    let elementoPontoNorteValor: HTMLDivElement | null =
      this.htmlComponente.querySelector(".ponto-norte-valor");

    if (elementoPontoNorteValor) {
      elementoPontoNorteValor.innerText = LateraisComponente[lateralPrimeiroPonto];
      elementoPontoNorteValor.addEventListener(
        PropriedadeComponente.PROPERTY_CHANGE_EVENT,
        (): void => {
          this._lateralPrimeiroPonto =
            LateraisComponente[
              elementoPontoNorteValor.innerText as keyof typeof LateraisComponente
            ];
          this.atualizar(this._primeiroComponente.htmlComponente);
        },
      );
    }

    let elementoPontoSulValor: HTMLDivElement | null =
      this._htmlComponente.querySelector(".ponto-sul-valor");

    if (elementoPontoSulValor) {
      elementoPontoSulValor.innerText = LateraisComponente[lateralSegundoPonto];
      elementoPontoSulValor.addEventListener(
        PropriedadeComponente.PROPERTY_CHANGE_EVENT,
        (): void => {
          this._lateralSegundoPonto =
            LateraisComponente[elementoPontoSulValor.innerText as keyof typeof LateraisComponente];
          this.atualizar(this._segundoComponente.htmlComponente);
        },
      );
    }
  }

  protected abstract ajustarConexao(): void;

  atualizar(htmlElemento: HTMLDivElement): void {
    if (this._primeiroComponente.htmlComponente === htmlElemento) {
      this._ponto1 = this._primeiroComponente.calcularPontoLateralComponente(
        this._lateralPrimeiroPonto,
      );
    } else {
      this._ponto2 = this._segundoComponente.calcularPontoLateralComponente(
        this._lateralSegundoPonto,
      );
    }
    this.ajustarConexao();
  }

  alertarRemovido(): void {
    this._htmlComponente.remove();
    this._primeiroComponente.removerOuvinte(this, false);
    this._segundoComponente.removerOuvinte(this, false);
  }

  isDependente(): boolean {
    return true;
  }

  get primeiroPonto(): Ponto {
    return this._ponto1;
  }

  get segundoPonto(): Ponto {
    return this._ponto2;
  }

  get lateralPrimeiroPonto(): LateraisComponente {
    return this._lateralPrimeiroPonto;
  }

  get lateralSegundoPonto(): LateraisComponente {
    return this._lateralSegundoPonto;
  }

  get primeiroComponente(): ComponenteDiagrama {
    return this._primeiroComponente;
  }

  get segundoComponente(): ComponenteDiagrama {
    return this._segundoComponente;
  }
}
