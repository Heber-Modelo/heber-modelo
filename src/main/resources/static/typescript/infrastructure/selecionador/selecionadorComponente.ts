/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PontoExtensor from "domain/model/pontoExtensor";
import SetaConectora from "domain/model/setaConectora";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";

export default class SelecionadorComponente {
  private _componenteSelecionado: ComponenteDiagrama | null;
  private readonly _pontosExtensores: PontoExtensor[];
  private readonly _setasConectoras: SetaConectora[];

  constructor(pontosExtensores: PontoExtensor[], setasConectoras: SetaConectora[]) {
    this._componenteSelecionado = null;
    this._pontosExtensores = pontosExtensores;
    this._setasConectoras = setasConectoras;
  }

  public atualizar(): void {
    this.reposicionarPontosExtensores();
    this.moverSetasParaComponenteSelecionado();
    this.componenteSelecionado?.atualizarOuvintes();
    this.componenteSelecionado?.atualizarPropriedades();
  }

  public selecionarElemento(componente: ComponenteDiagrama): void {
    if (this._componenteSelecionado !== null) {
      this._componenteSelecionado.htmlComponente.classList.remove(
        ComponenteDiagrama.CLASSE_ELEMENTO_SELECIONADO,
      );
    }
    this._componenteSelecionado = componente;
    this._componenteSelecionado.htmlComponente.classList.add(
      ComponenteDiagrama.CLASSE_ELEMENTO_SELECIONADO,
    );

    this.limparPropriedades();
    this.reposicionarPontosExtensores();
    this.reposicionarSetasConectoras(componente);
  }

  public esconderPontosExtensores(): void {
    this._pontosExtensores.forEach((ponto: PontoExtensor): void => ponto.esconderPonto());
  }

  public mostrarPontosExtensores(): void {
    if (this._componenteSelecionado) {
      this._pontosExtensores.forEach((ponto: PontoExtensor): void => ponto.mostrarPonto());
    }
  }

  public esconderSetasConectoras(): void {
    this._setasConectoras.forEach((seta: SetaConectora): void => seta.esconderSeta());
  }

  public mostrarSetasConectoras(): void {
    this._setasConectoras.forEach((seta: SetaConectora): void => seta.mostrarSeta());
  }

  public reposicionarPontosExtensores(): void {
    let recebePontosExtensores: string | null | undefined =
      this._componenteSelecionado?.htmlComponente.getAttribute(
        ComponenteDiagrama.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES,
      );

    if (recebePontosExtensores === "false") {
      this.esconderPontosExtensores();
      return;
    }

    let elementoAtual: HTMLElement | undefined = this.componenteSelecionado?.htmlComponente;

    if (elementoAtual) {
      this._pontosExtensores.forEach((ponto: PontoExtensor): void =>
        ponto.trocarElementoAtual(elementoAtual),
      );
    }
  }

  public reposicionarSetasConectoras(componente: ComponenteDiagrama): void {
    let recebeSetasConectoras: string | null | undefined =
      this._componenteSelecionado?.htmlComponente.getAttribute(
        ComponenteDiagrama.PROPRIEDADE_RECEBE_SETAS_CONECTORAS,
      );

    if (recebeSetasConectoras === "false") {
      this.esconderSetasConectoras();
      return;
    }

    this._setasConectoras.forEach((seta: SetaConectora): void => {
      seta.reposicionarSeta(componente.htmlComponente);
      seta.mostrarSeta();
    });
  }

  private limparPropriedades(): void {
    const abaPropriedades: HTMLDivElement | null = document.querySelector("section#propriedades");
    if (abaPropriedades === null) return;

    let nomesComponentes: NodeListOf<HTMLHeadingElement> = abaPropriedades.querySelectorAll("h3");
    nomesComponentes.forEach((nomeComponente: HTMLHeadingElement): void => nomeComponente.remove());

    let propriedades: NodeListOf<HTMLElement> = abaPropriedades.querySelectorAll(
      `.${PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA}`,
    );
    propriedades.forEach((propriedade: HTMLElement): void => propriedade.remove());
  }

  public removerSelecao(): void {
    if (this._componenteSelecionado !== null) {
      this._componenteSelecionado.htmlComponente.classList.remove(
        ComponenteDiagrama.CLASSE_ELEMENTO_SELECIONADO,
      );
      this._componenteSelecionado = null;
    }

    this.limparPropriedades();
    this.esconderPontosExtensores();
    this.esconderSetasConectoras();
  }

  public moverSetasParaComponenteSelecionado(): void {
    if (this._componenteSelecionado !== null) {
      this.reposicionarSetasConectoras(this._componenteSelecionado);
    }
  }

  get componenteSelecionado(): ComponenteDiagrama | null {
    return this._componenteSelecionado;
  }

  get setasConectoras(): SetaConectora[] {
    return this._setasConectoras;
  }
}
