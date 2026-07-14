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

import ComponenteFactory from "infrastructure/factory/componenteFactory";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import PontoExtensor from "model/pontoExtensor";
import SetaConectora from "model/setaConectora";

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
    this.reposicionarPontosExtensores();
    this.reposicionarSetasConectoras(componente);
  }

  public esconderPontosExtensores(): void {
    this._pontosExtensores.forEach((ponto: PontoExtensor): void => ponto.esconderPonto());
  }

  public mostrarPontosExtensores(): void {
    this._pontosExtensores.forEach((ponto: PontoExtensor): void => ponto.mostrarPonto());
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
        ComponenteFactory.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES,
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
        ComponenteFactory.PROPRIEDADE_RECEBE_SETAS_CONECTORAS,
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

  public removerSelecao(): void {
    if (this._componenteSelecionado !== null) {
      this._componenteSelecionado.htmlComponente.classList.remove(
        ComponenteDiagrama.CLASSE_ELEMENTO_SELECIONADO,
      );
      this._componenteSelecionado = null;
    }

    this._setasConectoras.forEach((seta: SetaConectora): void => seta.esconderSeta());
    this.esconderPontosExtensores();
  }

  public moverSetasParaComponenteSelecionado(): void {
    if (this._componenteSelecionado !== null) {
      this.reposicionarSetasConectoras(this._componenteSelecionado);
    }
  }

  public pegarHTMLElementoSelecionado(): HTMLElement | null {
    if (this._componenteSelecionado === null) {
      return null;
    }

    return this._componenteSelecionado.htmlComponente;
  }

  get componenteSelecionado(): ComponenteDiagrama | null {
    return this._componenteSelecionado;
  }

  get setasConectoras(): SetaConectora[] {
    return this._setasConectoras;
  }
}
