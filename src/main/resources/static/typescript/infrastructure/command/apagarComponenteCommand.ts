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
  private readonly _repositorioComponente: IRepositorioComponente;

  constructor(componente: ComponenteDiagrama, repositorioComponente: IRepositorioComponente) {
    this._componente = componente;
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
    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ApagarComponenteCommandBuilder implements ICommandBuilder<ApagarComponenteCommand> {
  private _componente: ComponenteDiagrama | null = null;
  private _repositorioComponente: IRepositorioComponente | null = null;

  public definirComponenteAlvo(componente: ComponenteDiagrama): this {
    this._componente = componente;

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

    if (this._repositorioComponente === null) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
    }

    return new ApagarComponenteCommand(this._componente, this._repositorioComponente);
  }
}
