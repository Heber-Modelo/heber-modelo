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

import ICommand from "../../model/command/iCommand.js";
import { CLASSE_ELEMENTO_SELECIONADO } from "../../application/paginas/editor/classesCSSElementos.js";
import { ComponenteDiagrama } from "../../model/componente/componenteDiagrama.js";

class CopiarComponenteCommand implements ICommand {
  private _componente: ComponenteDiagrama;

  constructor(componente: ComponenteDiagrama) {
    this._componente = componente;
  }

  execute(): Number {
    this._componente.htmlComponente.classList.remove(CLASSE_ELEMENTO_SELECIONADO);
    navigator.clipboard
      .writeText(this._componente.htmlComponente.outerHTML)
      .then((): void => {})
      .catch((): void => {});
    this._componente.htmlComponente.classList.add(CLASSE_ELEMENTO_SELECIONADO);
    return 0;
  }

  undo(): Number {
    return 0;
  }
}

export class CopiarComponenteCommandBuilder {
  private _componente: ComponenteDiagrama | null = null;

  public definirComponenteAlvo(componente: ComponenteDiagrama | null): this {
    this._componente = componente;
    return this;
  }

  build(): CopiarComponenteCommand {
    if (this._componente === null) {
      throw new Error("O componente alvo não foi especificado");
    }

    return new CopiarComponenteCommand(this._componente);
  }
}

export default CopiarComponenteCommand;
