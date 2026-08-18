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

import ICommand from "domain/model/command/iCommand";

export default class CommandHistory {
  private _commands: ICommand[] = [];
  private _undoHistory: ICommand[] = [];

  public saveAndExecuteCommand(command: ICommand): void {
    this._commands.push(command);
    command.execute();
  }

  public redoLastCommand(): void {
    let lastCommand: ICommand | undefined = this._undoHistory.pop();

    if (lastCommand !== undefined) {
      lastCommand.redo();
      this._commands.push(lastCommand);
    }
  }

  public undoLastCommand(): void {
    let lastCommand: ICommand | undefined = this._commands.pop();

    if (lastCommand !== undefined) {
      lastCommand.undo();
      this._undoHistory.push(lastCommand);
    }
  }
}
