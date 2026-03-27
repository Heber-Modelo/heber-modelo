/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import ICommand from "model/command/iCommand";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import IRepositorioComponente from "model/repositorio/IRepositorioComponente";

export default class ApagarComponenteCommand implements ICommand {
  private readonly _componente: ComponenteDiagrama;
  private readonly _diagrama: HTMLElement;
  private readonly _repositorioComponente: IRepositorioComponente;

  constructor(
    componente: ComponenteDiagrama,
    diagrama: HTMLElement,
    repositorioComponente: IRepositorioComponente,
  ) {
    this._componente = componente;
    this._diagrama = diagrama;
    this._repositorioComponente = repositorioComponente;
  }

  execute(): Number {
    this._repositorioComponente.remover(this._componente);

    return 0;
  }

  undo(): Number {
    return 0;
  }
}

export class ApagarComponenteCommandBuilder {
  private _componente: ComponenteDiagrama | null = null;
  private _diagrama: HTMLElement | null = null;
  private _repositorioComponente: IRepositorioComponente | null = null;

  public definirComponenteAlvo(componente: ComponenteDiagrama): this {
    this._componente = componente;

    return this;
  }

  public definirDiagrama(diagrama: HTMLElement): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirRepositorioComponente(repositorio: IRepositorioComponente): this {
    this._repositorioComponente = repositorio;

    return this;
  }

  build(): ApagarComponenteCommand {
    if (this._componente === null) {
      throw new Error("O componente alvo não foi definido");
    }

    if (this._diagrama === null) {
      throw new Error("O diagrama não foi definido");
    }

    if (this._repositorioComponente === null) {
      throw new Error("O repositório de componentes não foi definido");
    }

    return new ApagarComponenteCommand(
      this._componente,
      this._diagrama,
      this._repositorioComponente,
    );
  }
}
