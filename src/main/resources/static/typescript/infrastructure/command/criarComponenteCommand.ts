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

import CarregarCSSCommand, {
  CarregarCSSCommandBuilder,
} from "infrastructure/command/carregarCSSCommand";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import CommandBuilderException from "model/exception/commandBuilderException";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";

export default class CriarComponenteCommand implements ICommand {
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _geradorIDComponente: GeradorIDComponente;
  private readonly _nomeElemento: string;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private _carregarCSSCommand: CarregarCSSCommand | undefined;
  private _componenteCriado: ComponenteDiagrama | undefined;

  constructor(
    diagrama: HTMLElement,
    fabricaComponente: ComponenteFactory,
    geradorIDComponente: GeradorIDComponente,
    nomeElemento: string,
    registradorEventosElemento: RegistradorEventosElemento,
    repositorioComponentes: IRepositorioComponente,
  ) {
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._geradorIDComponente = geradorIDComponente;
    this._nomeElemento = nomeElemento;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioComponentes = repositorioComponentes;
  }

  execute(): CommandResult {
    this._fabricaComponente
      .criarComponente(this._nomeElemento)
      .then((componente: ComponenteDiagrama): void => {
        this._carregarCSSCommand = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(this._nomeElemento)
          .build();
        this._carregarCSSCommand.execute();
        this._registradorEventosElemento.registrarEventos(componente.htmlComponente);
        componente.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );
        this._repositorioComponentes.adicionar(componente);
        this._diagrama.appendChild(componente.htmlComponente);
        this._componenteCriado = componente;
      });

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    this._carregarCSSCommand?.redo();

    if (this._componenteCriado) {
      this._diagrama.append(this._componenteCriado.htmlComponente);
      this._repositorioComponentes.adicionar(this._componenteCriado);
    }

    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._carregarCSSCommand?.undo();

    if (this._componenteCriado) {
      this._componenteCriado.htmlComponente.remove();
      this._repositorioComponentes.remover(this._componenteCriado);
    }

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class CriarComponenteCommandBuilder implements ICommandBuilder<CriarComponenteCommand> {
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _geradorIDComponente: GeradorIDComponente | null = null;
  private _nomeElemento: string | undefined | null;
  private _registradorEventosElemento: RegistradorEventosElemento | null = null;
  private _repositorioComponente: IRepositorioComponente | null = null;

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirFabricaComponente(fabricaComponente: ComponenteFactory | null): this {
    this._fabricaComponente = fabricaComponente;

    return this;
  }

  public definirGeradorIDComponente(geradorIDComponente: GeradorIDComponente | null): this {
    this._geradorIDComponente = geradorIDComponente;

    return this;
  }

  public definirNomeElemento(nomeElemento: string | undefined | null): this {
    this._nomeElemento = nomeElemento;

    return this;
  }

  public definirRegistradorEventosElemento(
    registradorEventosElemento: RegistradorEventosElemento | null,
  ): this {
    this._registradorEventosElemento = registradorEventosElemento;

    return this;
  }

  public definirRepositorioComponentes(
    repositorioComponentes: IRepositorioComponente | null,
  ): this {
    this._repositorioComponente = repositorioComponentes;

    return this;
  }

  public build(): CriarComponenteCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("diagrama");
    }

    if (this._fabricaComponente === null) {
      throw new CommandBuilderException("fábrica de componentes");
    }

    if (this._geradorIDComponente === null) {
      throw new CommandBuilderException("gerador de ID");
    }

    if (this._nomeElemento === undefined || this._nomeElemento === null) {
      throw new CommandBuilderException("nome do elemento");
    }

    if (this._registradorEventosElemento === null) {
      throw new CommandBuilderException("registrador de eventos de componente");
    }

    if (this._repositorioComponente === null) {
      throw new CommandBuilderException("repositório de componentes");
    }

    return new CriarComponenteCommand(
      this._diagrama,
      this._fabricaComponente,
      this._geradorIDComponente,
      this._nomeElemento,
      this._registradorEventosElemento,
      this._repositorioComponente,
    );
  }
}
