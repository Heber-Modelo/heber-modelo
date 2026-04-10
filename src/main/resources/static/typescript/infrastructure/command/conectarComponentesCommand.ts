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
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import TiposConexao from "model/conexao/tiposConexao";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import LateraisComponente from "model/componente/lateraisComponente";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import CommandBuilderException from "model/exception/commandBuilderException";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import Ponto from "model/ponto";

export default class ConectarComponentesCommand implements ICommand {
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private readonly _primeiroComponente: ComponenteDiagrama;
  private readonly _segundoComponente: ComponenteDiagrama;
  private readonly _lateralPrimeiroComponente: LateraisComponente;
  private readonly _lateralSegundoComponente: LateraisComponente;
  private readonly _tipoConexao: TiposConexao;
  private _componenteConexao: ComponenteDiagrama | undefined;

  constructor(
    diagrama: HTMLElement,
    fabricaComponente: ComponenteFactory,
    fabricaConexao: ComponenteConexaoFactory,
    repositorioComponentes: IRepositorioComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
    lateralPrimeiroComponente: LateraisComponente,
    lateralSegundoComponente: LateraisComponente,
    tipoConexao: TiposConexao,
  ) {
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._fabricaConexao = fabricaConexao;
    this._repositorioComponentes = repositorioComponentes;
    this._primeiroComponente = primeiroComponente;
    this._segundoComponente = segundoComponente;
    this._lateralPrimeiroComponente = lateralPrimeiroComponente;
    this._lateralSegundoComponente = lateralSegundoComponente;
    this._tipoConexao = tipoConexao;
  }

  execute(): CommandResult {
    this._fabricaComponente
      .criarComponente(this._tipoConexao)
      .then((componente: ComponenteDiagrama): void => {
        let commandCarregarCSS: CarregarCSSCommand = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(this._tipoConexao)
          .build();
        commandCarregarCSS.execute();

        let primeiroPonto: Ponto = this._primeiroComponente.calcularPontoLateralComponente(
          this._lateralPrimeiroComponente,
        );
        let segundoPonto: Ponto = this._segundoComponente.calcularPontoLateralComponente(
          this._lateralSegundoComponente,
        );

        this._componenteConexao = this._fabricaConexao.criarConexao(
          this._tipoConexao,
          componente.htmlComponente,
          componente.propriedades,
          primeiroPonto,
          segundoPonto,
          this._lateralPrimeiroComponente,
          this._lateralSegundoComponente,
          this._primeiroComponente,
          this._segundoComponente,
        );

        this._repositorioComponentes.adicionar(this._componenteConexao);
        this._diagrama.append(this._componenteConexao.htmlComponente);
      });

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    if (this._componenteConexao) {
      this._componenteConexao?.htmlComponente.remove();
      this._repositorioComponentes.remover(this._componenteConexao);
    }

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ConectarComponentesCommandBuilder implements ICommandBuilder<ConectarComponentesCommand> {
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | undefined;
  private _fabricaConexao: ComponenteConexaoFactory | undefined;
  private _repositorioComponentes: IRepositorioComponente | undefined;
  private _primeiroComponente: ComponenteDiagrama | undefined;
  private _segundoComponente: ComponenteDiagrama | undefined;
  private _lateralPrimeiroComponente: LateraisComponente | undefined;
  private _lateralSegundoComponente: LateraisComponente | undefined;
  private _tipoConexao: TiposConexao | undefined;

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

  definirRepositorioComponentes(repositorioComponentes: IRepositorioComponente | undefined): this {
    this._repositorioComponentes = repositorioComponentes;

    return this;
  }

  definirPrimeiroComponente(primeiroComponente: ComponenteDiagrama | undefined): this {
    this._primeiroComponente = primeiroComponente;

    return this;
  }

  definirLateralPrimeiroComponente(
    lateralPrimeiroComponente: LateraisComponente | undefined,
  ): this {
    this._lateralPrimeiroComponente = lateralPrimeiroComponente;

    return this;
  }

  definirSegundoComponente(segundoComponente: ComponenteDiagrama | undefined): this {
    this._segundoComponente = segundoComponente;

    return this;
  }

  definirLateralSegundoComponente(lateralSegundoComponente: LateraisComponente | undefined): this {
    this._lateralSegundoComponente = lateralSegundoComponente;

    return this;
  }

  definirTipoConexao(tipoConexao: TiposConexao | undefined): this {
    this._tipoConexao = tipoConexao;

    return this;
  }

  build(): ConectarComponentesCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._fabricaComponente === undefined) {
      throw new CommandBuilderException("A fábrica de componentes não foi definida");
    }

    if (this._fabricaConexao === undefined) {
      throw new CommandBuilderException("A fábrica de conexões não foi definida");
    }

    if (this._repositorioComponentes === undefined) {
      throw new CommandBuilderException("O repositório de componentes não foi definido");
    }

    if (this._primeiroComponente === undefined) {
      throw new CommandBuilderException("O primeiro componente não foi definido");
    }

    if (this._lateralPrimeiroComponente === undefined) {
      throw new CommandBuilderException("A lateral do primeiro componente não foi definida");
    }

    if (this._segundoComponente === undefined) {
      throw new CommandBuilderException("O segundo componente não foi definido");
    }

    if (this._lateralSegundoComponente === undefined) {
      throw new CommandBuilderException("A lateral do segundo componente não foi definida");
    }

    if (this._tipoConexao === undefined) {
      throw new CommandBuilderException("O tipo de conexão não foi definido");
    }

    return new ConectarComponentesCommand(
      this._diagrama,
      this._fabricaComponente,
      this._fabricaConexao,
      this._repositorioComponentes,
      this._primeiroComponente,
      this._segundoComponente,
      this._lateralPrimeiroComponente,
      this._lateralSegundoComponente,
      this._tipoConexao,
    );
  }
}
