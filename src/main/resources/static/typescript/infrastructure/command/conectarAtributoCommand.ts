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
import ConectarComponentesCommand, {
  ConectarComponentesCommandBuilder,
} from "infrastructure/command/conectarComponentesCommand";
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import TiposConexao from "model/conexao/tiposConexao";
import CommandBuilderException from "model/exception/commandBuilderException";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";

export default class ConectarAtributoCommand implements ICommand {
  public static readonly NOME_ELEMENTO_ATRIBUTO: string = "atributo";
  private readonly _componenteAlvo: ComponenteDiagrama;
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _geradorID: GeradorIDComponente;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private readonly _tipoConexao: TiposConexao;
  private _commandCarregarCSSAtributo: CarregarCSSCommand | undefined;
  private _commandConectarComponentes: ConectarComponentesCommand | undefined;
  private _componenteAtributo: ComponenteDiagrama | undefined;

  constructor(
    componenteAlvo: ComponenteDiagrama,
    diagrama: HTMLElement,
    fabricaConexao: ComponenteConexaoFactory,
    fabricaComponente: ComponenteFactory,
    geradorID: GeradorIDComponente,
    registradorEventosConexao: RegistradorEventosConexao,
    registradorEventosElemento: RegistradorEventosElemento,
    repositorioComponentes: IRepositorioComponente,
    tipoConexao: TiposConexao,
  ) {
    this._componenteAlvo = componenteAlvo;
    this._diagrama = diagrama;
    this._fabricaConexao = fabricaConexao;
    this._fabricaComponente = fabricaComponente;
    this._geradorID = geradorID;
    this._registradorEventosConexao = registradorEventosConexao;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioComponentes = repositorioComponentes;
    this._tipoConexao = tipoConexao;
  }

  execute(): CommandResult {
    this._commandCarregarCSSAtributo = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(ConectarAtributoCommand.NOME_ELEMENTO_ATRIBUTO)
      .build();

    this._fabricaComponente
      .criarComponente(ConectarAtributoCommand.NOME_ELEMENTO_ATRIBUTO)
      .then((componente: ComponenteDiagrama): void => {
        this._componenteAtributo = componente;
        this._diagrama.append(componente.htmlComponente);
      });

    this._commandConectarComponentes = new ConectarComponentesCommandBuilder()
      .definirDiagrama(this._diagrama)
      .definirFabricaConexao(this._fabricaConexao)
      .definirFabricaComponente(this._fabricaComponente)
      .definirGeradorID(this._geradorID)
      .definirPrimeiroComponente(this._componenteAlvo)
      .definirLateralPrimeiroComponente(LateraisComponente.NORTE)
      .definirSegundoComponente(this._componenteAtributo)
      .definirLateralSegundoComponente(LateraisComponente.SUL)
      .definirRegistradorEventosConexao(this._registradorEventosConexao)
      .definirRegistradorEventosElemento(this._registradorEventosElemento)
      .definirRepositorioComponentes(this._repositorioComponentes)
      .definirTipoConexao(this._tipoConexao)
      .build();

    this._commandConectarComponentes.execute();

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    this._commandCarregarCSSAtributo?.redo();
    this._commandConectarComponentes?.redo();

    if (this._componenteAtributo) {
      this._diagrama.append(this._componenteAtributo.htmlComponente);
    }

    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._componenteAtributo?.htmlComponente.remove();
    this._commandCarregarCSSAtributo?.undo();
    this._commandConectarComponentes?.undo();

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ConectarAtributoCommandBuilder implements ICommandBuilder<ConectarAtributoCommand> {
  private _componenteAlvo: ComponenteDiagrama | undefined;
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | undefined;
  private _fabricaConexao: ComponenteConexaoFactory | undefined;
  private _geradorID: GeradorIDComponente | undefined;
  private _registradorEventosConexao: RegistradorEventosConexao | undefined;
  private _registradorEventosElemento: RegistradorEventosElemento | undefined;
  private _repositorioComponentes: IRepositorioComponente | undefined;
  private _tipoConexao: TiposConexao | undefined;

  definirComponenteAlvo(componenteAlvo: ComponenteDiagrama | undefined): this {
    this._componenteAlvo = componenteAlvo;

    return this;
  }

  definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  definirFabricaComponente(fabricaComponente: ComponenteFactory | undefined): this {
    this._fabricaComponente = fabricaComponente;

    return this;
  }

  definirFabricaConexao(fabricaConexao: ComponenteConexaoFactory | undefined): this {
    this._fabricaConexao = fabricaConexao;

    return this;
  }

  definirGeradorID(geradorID: GeradorIDComponente | undefined): this {
    this._geradorID = geradorID;

    return this;
  }

  definirRegistradorEventosConexao(
    registradorEventosConexao: RegistradorEventosConexao | undefined,
  ): this {
    this._registradorEventosConexao = registradorEventosConexao;

    return this;
  }

  definirRegistradorEventosElemento(
    registradorEventosElemento: RegistradorEventosElemento | undefined,
  ): this {
    this._registradorEventosElemento = registradorEventosElemento;

    return this;
  }

  definirRepositorioComponentes(repositorioComponentes: IRepositorioComponente | undefined): this {
    this._repositorioComponentes = repositorioComponentes;

    return this;
  }

  definirTipoConexao(tipoConexao: TiposConexao | undefined): this {
    this._tipoConexao = tipoConexao;

    return this;
  }

  public build(): ConectarAtributoCommand {
    if (this._componenteAlvo === undefined) {
      throw new CommandBuilderException("O Componente Alvo não foi definido");
    }

    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._fabricaComponente === undefined) {
      throw new CommandBuilderException("A Fábrica de Componentes não foi definida");
    }

    if (this._fabricaConexao === undefined) {
      throw new CommandBuilderException("A fábrica de conexões não foi definida");
    }

    if (this._geradorID === undefined) {
      throw new CommandBuilderException("O gerador de IDs de componentes não foi definido");
    }

    if (this._registradorEventosConexao === undefined) {
      throw new CommandBuilderException("O registrador de eventos de conexão não foi definido");
    }

    if (this._registradorEventosElemento === undefined) {
      throw new CommandBuilderException("O registrador de eventos de elemento não foi definido");
    }

    if (this._repositorioComponentes === undefined) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
    }

    if (this._tipoConexao === undefined) {
      throw new CommandBuilderException("O tipo de conexão não foi definido");
    }

    return new ConectarAtributoCommand(
      this._componenteAlvo,
      this._diagrama,
      this._fabricaConexao,
      this._fabricaComponente,
      this._geradorID,
      this._registradorEventosConexao,
      this._registradorEventosElemento,
      this._repositorioComponentes,
      this._tipoConexao,
    );
  }
}
