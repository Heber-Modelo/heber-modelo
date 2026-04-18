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

import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import CommandBuilderException from "model/exception/commandBuilderException";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";

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

  execute(): CommandResult {
    this._repositorioComponente.remover(this._componente);

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    this._repositorioComponente.remover(this._componente);

    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._diagrama.append(this._componente.htmlComponente);
    this._repositorioComponente.adicionar(this._componente);

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ApagarComponenteCommandBuilder implements ICommandBuilder<ApagarComponenteCommand> {
  private _componente: ComponenteDiagrama | null = null;
  private _diagrama: HTMLElement | null | undefined = null;
  private _repositorioComponente: IRepositorioComponente | null = null;

  public definirComponenteAlvo(componente: ComponenteDiagrama | null): this {
    this._componente = componente;

    return this;
  }

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirRepositorioComponente(repositorio: IRepositorioComponente): this {
    this._repositorioComponente = repositorio;

    return this;
  }

  build(): ApagarComponenteCommand {
    if (this._componente === null) {
      throw new CommandBuilderException("O componente alvo não foi definido");
    }

    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._repositorioComponente === null) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
    }

    return new ApagarComponenteCommand(
      this._componente,
      this._diagrama,
      this._repositorioComponente,
    );
  }
}
