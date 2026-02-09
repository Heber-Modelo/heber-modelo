import { IFactory } from "../../../model/factory/iFactory";
import ColarComponenteCommand from "../../command/colarComponenteCommand.js";
import { GeradorIDComponente } from "../../gerador/geradorIDComponente.js";
import { ComponenteFactory } from "../componenteFactory.js";
import { RepositorioComponente } from "../../repositorio/repositorioComponente.js";

class ColarComponenteCommandFactory implements IFactory<ColarComponenteCommand> {
  private readonly _paiComponente: ParentNode;
  private readonly _geradorID: GeradorIDComponente;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _registradorEventos: Function;
  private readonly _repositorioComponentes: RepositorioComponente;

  constructor(
    paiComponente: ParentNode,
    geradorID: GeradorIDComponente,
    fabricaComponente: ComponenteFactory,
    registradorEventos: Function,
    repositorioComponente: RepositorioComponente,
  ) {
    this._paiComponente = paiComponente;
    this._geradorID = geradorID;
    this._fabricaComponente = fabricaComponente;
    this._registradorEventos = registradorEventos;
    this._repositorioComponentes = repositorioComponente;
  }

  build(): ColarComponenteCommand {
    return new ColarComponenteCommand(
      this._paiComponente,
      this._geradorID,
      this._fabricaComponente,
      this._registradorEventos,
      this._repositorioComponentes,
    );
  }
}

export default ColarComponenteCommandFactory;
