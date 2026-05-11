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
  private carregarCSSCommand: CarregarCSSCommand | undefined;
  private componenteCriado: ComponenteDiagrama | undefined;

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
        this.carregarCSSCommand = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(this._nomeElemento)
          .build();
        this.carregarCSSCommand.execute();
        this._registradorEventosElemento.registrarEventos(componente.htmlComponente);
        componente.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );
        this._repositorioComponentes.adicionar(componente);
        this._diagrama.appendChild(componente.htmlComponente);
        this.componenteCriado = componente;
      });

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    return this.execute();
  }

  undo(): CommandResult {
    if (this.componenteCriado) {
      this.componenteCriado.htmlComponente.remove();
      this._repositorioComponentes.remover(this.componenteCriado);
      this.carregarCSSCommand?.undo();
    }

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class CriarComponenteCommandBuilder implements ICommandBuilder<CriarComponenteCommand> {
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | undefined;
  private _geradorIDComponente: GeradorIDComponente | undefined;
  private _nomeElemento: string | undefined | null;
  private _registradorEventosElemento: RegistradorEventosElemento | undefined;
  private _repositorioComponente: IRepositorioComponente | undefined;

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirFabricaComponente(fabricaComponente: ComponenteFactory | undefined): this {
    this._fabricaComponente = fabricaComponente;

    return this;
  }

  public definirGeradorIDComponente(geradorIDComponente: GeradorIDComponente | undefined): this {
    this._geradorIDComponente = geradorIDComponente;

    return this;
  }

  public definirNomeElemento(nomeElemento: string | undefined | null): this {
    this._nomeElemento = nomeElemento;

    return this;
  }

  public definirRegistradorEventosElemento(
    registradorEventosElemento: RegistradorEventosElemento | undefined,
  ): this {
    this._registradorEventosElemento = registradorEventosElemento;

    return this;
  }

  public definirRepositorioComponentes(
    repositorioComponentes: IRepositorioComponente | undefined,
  ): this {
    this._repositorioComponente = repositorioComponentes;

    return this;
  }

  build(): CriarComponenteCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._fabricaComponente === undefined) {
      throw new CommandBuilderException("A fábrica de componentes não foi definida");
    }

    if (this._geradorIDComponente === undefined) {
      throw new CommandBuilderException("O gerador de id de componente não foi definido");
    }

    if (this._nomeElemento === undefined || this._nomeElemento === null) {
      throw new CommandBuilderException("O nome do elemento não foi definido");
    }

    if (this._registradorEventosElemento === undefined) {
      throw new CommandBuilderException("O registrador de eventos de componente não foi definido");
    }

    if (this._repositorioComponente === undefined) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
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
