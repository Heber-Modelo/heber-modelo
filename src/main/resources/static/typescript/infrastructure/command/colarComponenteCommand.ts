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

export class ColarComponenteDiagramaBuilder {
  private _paiComponente: ParentNode | null = null;
  private _geradorID: GeradorIDComponente | null = null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _registradorEventos: Function | null = null;
  private _repositorioComponente: RepositorioComponente | null = null;

  definirPaiComponente(paiComponente: ParentNode | null): this {
    this._paiComponente = paiComponente;
    return this;
  }

  definirGeradorID(geradorID: GeradorIDComponente | null): this {
    this._geradorID = geradorID;
    return this;
  }

  definirFabricaComponente(fabricaComponente: ComponenteFactory | null): this {
    this._fabricaComponente = fabricaComponente;
    return this;
  }

  definirRegistradorEventos(registradorEventos: Function | null): this {
    this._registradorEventos = registradorEventos;
    return this;
  }

  definirRepositorioComponente(repositorioComponente: RepositorioComponente | null): this {
    this._repositorioComponente = repositorioComponente;
    return this;
  }

  public build(): ColarComponenteCommand {
    if (this._paiComponente === null) {
      throw new Error("O pai do componente não foi especificado");
    }

    if (this._geradorID === null) {
      throw new Error("O gerador de ID não foi especificado");
    }

    if (this._fabricaComponente === null) {
      throw new Error("A fábrica de componentes não foi especificado");
    }

    if (this._registradorEventos === null) {
      throw new Error("O registrador de eventos não foi especificado");
    }

    if (this._repositorioComponente === null) {
      throw new Error("O repositório de componentes não foi especificado");
    }

    return new ColarComponenteCommand(
      this._paiComponente,
      this._geradorID,
      this._fabricaComponente,
      this._registradorEventos,
      this._repositorioComponente,
    );
  }
}

export default ColarComponenteCommand;
