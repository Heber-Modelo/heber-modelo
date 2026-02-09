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
