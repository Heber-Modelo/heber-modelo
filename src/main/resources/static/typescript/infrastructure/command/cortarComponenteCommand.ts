import ICommand from "../../model/command/iCommand";
import { ComponenteDiagrama } from "../../model/componente/componenteDiagrama.js";
import { SelecionadorComponente } from "../../application/paginas/editor/selecionadorComponente.js";

class CortarComponenteCommand implements ICommand {
  private readonly _componente: ComponenteDiagrama;
  private _paiComponente: ParentNode | null;
  private _selecionadorComponente: SelecionadorComponente;

  constructor(componente: ComponenteDiagrama, selecionadorComponente: SelecionadorComponente) {
    this._componente = componente;
    this._paiComponente = componente.htmlComponente.parentNode;
    this._selecionadorComponente = selecionadorComponente;
  }

  execute(): Number {
    navigator.clipboard
      .writeText(this._componente.htmlComponente.outerHTML)
      .then((): void => {})
      .catch((): void => {});

    this._selecionadorComponente.removerSelecao();
    this._componente.htmlComponente.remove();

    return 0;
  }

  undo(): Number {
    this._paiComponente?.append(this._componente.htmlComponente);
    this._selecionadorComponente.selecionarElemento(this._componente);

    return 0;
  }
}

export default CortarComponenteCommand;
