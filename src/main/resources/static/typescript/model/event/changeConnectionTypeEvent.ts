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

import TiposConexao from "model/conexao/tiposConexao";

export default class ChangeConnectionTypeEvent extends Event {
  public static readonly CHANGE_CONNECTION_TYPE_EVENT: string = "changeConnectionType";
  private readonly _tipoConexao: TiposConexao;

  constructor(tipoConexao: TiposConexao) {
    super(ChangeConnectionTypeEvent.CHANGE_CONNECTION_TYPE_EVENT);
    this._tipoConexao = tipoConexao;
  }

  get tipoConexao(): TiposConexao {
    return this._tipoConexao;
  }
}
