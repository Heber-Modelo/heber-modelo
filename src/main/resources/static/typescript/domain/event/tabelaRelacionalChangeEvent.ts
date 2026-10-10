/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

export default class TabelaRelacionalChangeEvent extends Event {
  public static readonly TABELA_RELACIONAL_CHANGE_EVENT: string = "tabelaRelacionalChangeEvent";

  constructor() {
    super(TabelaRelacionalChangeEvent.TABELA_RELACIONAL_CHANGE_EVENT);
  }
}
