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

import { CLASSE_ELEMENTO_SELECIONADO } from "application/paginas/editor/selecionadorComponente";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import CommandBuilderException from "model/exception/commandBuilderException";
import ComponenteDiagrama from "model/componente/componenteDiagrama";

export default class CopiarComponenteCommand implements ICommand {
  private _componente: ComponenteDiagrama;

  constructor(componente: ComponenteDiagrama) {
    this._componente = componente;
  }

  execute(): CommandResult {
    this._componente.htmlComponente.classList.remove(CLASSE_ELEMENTO_SELECIONADO);
    navigator.clipboard
      .writeText(this._componente.htmlComponente.outerHTML)
      .then((): void => {})
      .catch((): void => {});
    this._componente.htmlComponente.classList.add(CLASSE_ELEMENTO_SELECIONADO);

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

export class CopiarComponenteCommandBuilder implements ICommandBuilder<CopiarComponenteCommand> {
  private _componente: ComponenteDiagrama | null = null;

  public definirComponenteAlvo(componente: ComponenteDiagrama | null): this {
    this._componente = componente;
    return this;
  }

  build(): CopiarComponenteCommand {
    if (this._componente === null) {
      throw new CommandBuilderException("O componente alvo não foi especificado");
    }

    return new CopiarComponenteCommand(this._componente);
  }
}
