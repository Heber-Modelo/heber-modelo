import ICommand from "../../model/command/iCommand";
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

export default CopiarComponenteCommand;
