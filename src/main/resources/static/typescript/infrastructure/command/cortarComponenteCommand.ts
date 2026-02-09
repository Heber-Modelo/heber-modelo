import ICommand from "../../model/command/iCommand.js";
import { ComponenteDiagrama } from "../../model/componente/componenteDiagrama.js";
import { SelecionadorComponente } from "../../application/paginas/editor/selecionadorComponente.js";
import { RepositorioComponente } from "../repositorio/repositorioComponente.js";

class CortarComponenteCommand implements ICommand {
  private readonly _componente: ComponenteDiagrama;
  private _paiComponente: ParentNode | null;
  private _repositorio: RepositorioComponente;
  private _selecionadorComponente: SelecionadorComponente;

  constructor(
    componente: ComponenteDiagrama,
    repositorio: RepositorioComponente,
    selecionadorComponente: SelecionadorComponente,
  ) {
    this._componente = componente;
    this._paiComponente = componente.htmlComponente.parentNode;
    this._repositorio = repositorio;
    this._selecionadorComponente = selecionadorComponente;
  }

  execute(): Number {
    navigator.clipboard
      .writeText(this._componente.htmlComponente.outerHTML)
      .then((): void => {})
      .catch((): void => {});

    this._selecionadorComponente.removerSelecao();
    this._componente.htmlComponente.remove();
    this._repositorio.remover(this._componente);

    return 0;
  }

  undo(): Number {
    this._paiComponente?.append(this._componente.htmlComponente);
    this._selecionadorComponente.selecionarElemento(this._componente);
    this._repositorio.adicionar(this._componente);

    return 0;
  }
}

export class CortarComponenteCommandBuilder {
  private _componente: ComponenteDiagrama | null = null;
  private _repositorio: RepositorioComponente | null = null;
  private _selecionadorComponente: SelecionadorComponente | null = null;

  definirComponenteAlvo(componente: ComponenteDiagrama | null): this {
    this._componente = componente;
    return this;
  }

  definirRepositorioComponente(repositorio: RepositorioComponente): this {
    this._repositorio = repositorio;
    return this;
  }

  definirSelecionadorComponente(selecionadorComponente: SelecionadorComponente): this {
    this._selecionadorComponente = selecionadorComponente;
    return this;
  }

  build(): CortarComponenteCommand {
    if (this._componente === null) {
      throw new Error("Componente alvo não foi especificado");
    }

    if (this._repositorio === null) {
      throw new Error("Repositório de componentes não foi especificado");
    }

    if (this._selecionadorComponente === null) {
      throw new Error("Selecionador componente não foi especificado");
    }

    return new CortarComponenteCommand(
      this._componente,
      this._repositorio,
      this._selecionadorComponente,
    );
  }
}

export default CortarComponenteCommand;
