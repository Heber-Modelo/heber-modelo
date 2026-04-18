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

import CommandHistory from "infrastructure/history/commandHistory";

export default class CommandHistoryFactory {
  private static _commandHistory: CommandHistory | null = null;

  public static build(): CommandHistory {
    if (this._commandHistory === null) {
      this._commandHistory = new CommandHistory();
    }

    return this._commandHistory;
  }
}
