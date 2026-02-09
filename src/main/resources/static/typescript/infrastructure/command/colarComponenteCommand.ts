import ICommand from "../../model/command/iCommand";
import { ComponenteFactory } from "../factory/componenteFactory.js";
import { GeradorIDComponente } from "../gerador/geradorIDComponente.js";
import { ComponenteDiagrama } from "../../model/componente/componenteDiagrama.js";
import { RepositorioComponente } from "../repositorio/repositorioComponente.js";

class ColarComponenteCommand implements ICommand {
  private readonly _paiComponente: ParentNode;
  private _geradorID: GeradorIDComponente;
  private _fabricaComponente: ComponenteFactory;
  private _registradorEventos: Function;
  private _repositorioComponentes: RepositorioComponente;

  private _componenteColado: ComponenteDiagrama | null = null;

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

  execute(): Number {
    navigator.clipboard.readText().then((conteudo: string): void => {
      let novoElemento: HTMLDivElement = document.createElement("div");

      setTimeout((): void => {
        let ultimoElemento: HTMLDivElement = this._paiComponente.lastElementChild as HTMLDivElement;
        let nomeNovoComponente: string | null = ultimoElemento.getAttribute(
          ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
        );
        if (nomeNovoComponente !== null) {
          this._registradorEventos.call(this, ultimoElemento);
          this._fabricaComponente
            .criarComponente(nomeNovoComponente)
            .then((componente: ComponenteDiagrama): void => {
              componente.htmlComponente = ultimoElemento;
              this._repositorioComponentes.adicionar(componente);
              this._componenteColado = componente;
            });
        }

        ultimoElemento.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorID.pegarProximoID()),
        );
      }, 200);

      this._paiComponente.append(novoElemento);
      novoElemento.outerHTML = conteudo;
    });

    return 0;
  }

  undo(): Number {
    this._componenteColado?.htmlComponente.remove();

    return 0;
  }
}

export default ColarComponenteCommand;
