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

import AbstractComponenteConexao from "model/conexao/abstractComponenteConexao";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import ComponenteDiagramaOuvinte from "model/componente/componenteDiagramaOuvinte";
import IRepositorioComponente from "model/repositorio/IRepositorioComponente";

export default class RepositorioComponente implements IRepositorioComponente {
  private _componentesDiagrama: ComponenteDiagrama[] = [];

  public adicionar(componenteDiagrama: ComponenteDiagrama): void {
    this._componentesDiagrama.push(componenteDiagrama);
  }

  public atualizar(componenteDiagrama: ComponenteDiagrama): void {
    for (let i: number = 0; i < this._componentesDiagrama.length; i++) {
      if (this._componentesDiagrama[i] === componenteDiagrama) {
        this._componentesDiagrama[i] = componenteDiagrama;
      }
    }
  }

  public remover(componente: ComponenteDiagrama): void {
    let id: number = componente.pegarIDElemento();
    this.removerPorID(id);
  }

  public removerPorID(id: number): void {
    let componenteAlvo: ComponenteDiagrama | null = this.pegar(id);

    if (componenteAlvo === null) {
      return;
    }

    componenteAlvo.htmlComponente.remove();
    let componentes: ComponenteDiagramaOuvinte[] = componenteAlvo.removerTodosOuvintes();
    this.removerComponenteArray(componenteAlvo);

    componentes.forEach((componente: ComponenteDiagramaOuvinte): void => {
      if (componente.isDependente()) {
        if (componente instanceof AbstractComponenteConexao) {
          this.removerComponenteArray(componente);
        }
      }
    });
  }

  private removerComponenteArray(componente: ComponenteDiagrama): void {
    let indexComponente: number = this._componentesDiagrama.indexOf(componente);

    if (indexComponente > -1) {
      this._componentesDiagrama.splice(indexComponente, 1);
    }
  }

  public pegar(id: number): ComponenteDiagrama | null {
    for (const componente of this._componentesDiagrama) {
      if (componente.pegarIDElemento() === id) {
        return componente;
      }
    }

    return null;
  }

  public pegarPorHTML(htmlElemento: HTMLElement): ComponenteDiagrama | null {
    for (const componente of this._componentesDiagrama) {
      if (componente.htmlComponente === htmlElemento) {
        return componente;
      }
    }

    return null;
  }

  public listar(): ComponenteDiagrama[] {
    return this._componentesDiagrama;
  }
}
