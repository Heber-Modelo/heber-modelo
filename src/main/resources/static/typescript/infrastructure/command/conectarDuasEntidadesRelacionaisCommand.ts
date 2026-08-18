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
import { ConectarComponentesCommandBuilder } from "infrastructure/command/conectarComponentesCommand";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";
import LateraisComponente from "domain/enum/lateraisComponente";
import NomesComponente from "domain/enum/nomesComponente";
import TiposConexao from "domain/enum/tiposConexao";
import CommandBuilderException from "domain/exception/commandBuilderException";
import ICommand, { CommandResult } from "domain/model/command/iCommand";
import ICommandBuilder from "domain/model/command/iCommandBuilder";
import AbstractComponenteConexao from "domain/model/componente/abstractComponenteConexao";
import ComponenteCardinalidadeRelacionamento from "domain/model/componente/componenteCardinalidadeRelacionamento";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import IRepositorioComponente from "domain/model/repositorio/iRepositorioComponente";
import Ponto from "domain/model/ponto";

// noinspection DuplicatedCode
export default class ConectarDuasEntidadesRelacionaisCommand implements ICommand {
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _geradorIDComponente: GeradorIDComponente;
  private readonly _primeiroComponente: ComponenteDiagrama;
  private readonly _segundoComponente: ComponenteDiagrama;
  private readonly _lateralPrimeiroComponente: LateraisComponente;
  private readonly _lateralSegundoComponente: LateraisComponente;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioComponente: IRepositorioComponente;
  private readonly _selecionadorAba: SelecionadorAba;
  private readonly _tipoConexao: TiposConexao;
  private _commandCarregarCSSCardinalidade: CarregarCSSCommand | undefined;
  private _commandCarregarCSSConexao: CarregarCSSCommand | undefined;
  private _componenteConexao: AbstractComponenteConexao | undefined;
  private _primeiroComponenteCardinalidade: ComponenteCardinalidadeRelacionamento | undefined;
  private _segundoComponenteCardinalidade: ComponenteCardinalidadeRelacionamento | undefined;

  constructor(
    diagrama: HTMLElement,
    fabricaComponente: ComponenteFactory,
    fabricaConexao: ComponenteConexaoFactory,
    geradorIDComponente: GeradorIDComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
    lateralPrimeiroComponente: LateraisComponente,
    lateralSegundoComponente: LateraisComponente,
    registradorEventosConexao: RegistradorEventosConexao,
    registradorEventosElemento: RegistradorEventosElemento,
    repositorioComponente: IRepositorioComponente,
    selecionadorAba: SelecionadorAba,
    tipoConexao: TiposConexao,
  ) {
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._fabricaConexao = fabricaConexao;
    this._geradorIDComponente = geradorIDComponente;
    this._primeiroComponente = primeiroComponente;
    this._segundoComponente = segundoComponente;
    this._lateralPrimeiroComponente = lateralPrimeiroComponente;
    this._lateralSegundoComponente = lateralSegundoComponente;
    this._registradorEventosConexao = registradorEventosConexao;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioComponente = repositorioComponente;
    this._selecionadorAba = selecionadorAba;
    this._tipoConexao = tipoConexao;
  }

  execute(): CommandResult {
    let primeiroPonto: Ponto = this._primeiroComponente.calcularPontoLateralComponente(
      this._lateralPrimeiroComponente,
    );
    let segundoPonto: Ponto = this._segundoComponente.calcularPontoLateralComponente(
      this._lateralSegundoComponente,
    );

    this._commandCarregarCSSCardinalidade = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(NomesComponente.CARDINALIDADE)
      .build();
    this._commandCarregarCSSConexao = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(this._tipoConexao)
      .build();

    this._commandCarregarCSSCardinalidade.execute();
    this._commandCarregarCSSConexao.execute();

    this._fabricaComponente
      .criarComponente(this._tipoConexao)
      .then(async (componente: ComponenteDiagrama): Promise<void> => {
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

        this._registradorEventosConexao.registrarEventos(this._componenteConexao.htmlComponente);
        this._componenteConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_ABA,
          String(this._selecionadorAba.abaSelecionada?.id),
        );
        this._componenteConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._repositorioComponente.adicionar(this._componenteConexao);
        this._diagrama.append(this._componenteConexao.htmlComponente);

        let primeiraCardinalidade: ComponenteDiagrama =
          await this._fabricaComponente.criarComponente(NomesComponente.CARDINALIDADE);

        this._diagrama.append(primeiraCardinalidade.htmlComponente);

        this._primeiroComponenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
          primeiraCardinalidade.htmlComponente,
          primeiraCardinalidade.propriedades,
          this._primeiroComponente,
          this._componenteConexao,
          this._segundoComponente,
          this._lateralPrimeiroComponente,
        );

        this._primeiroComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_ABA,
          String(this._selecionadorAba.abaSelecionada?.id),
        );
        this._primeiroComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );
        this._registradorEventosElemento.registrarEventos(
          this._primeiroComponenteCardinalidade.htmlComponente,
        );
        this._repositorioComponente.adicionar(this._primeiroComponenteCardinalidade);

        let segundaCardinalidade: ComponenteDiagrama =
          await this._fabricaComponente.criarComponente(NomesComponente.CARDINALIDADE);
        this._diagrama.append(segundaCardinalidade.htmlComponente);

        this._segundoComponenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
          segundaCardinalidade.htmlComponente,
          segundaCardinalidade.propriedades,
          this._segundoComponente,
          this._componenteConexao,
          this._primeiroComponente,
          this._lateralSegundoComponente,
        );

        this._segundoComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_ABA,
          String(this._selecionadorAba.abaSelecionada?.id),
        );
        this._segundoComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );
        this._registradorEventosElemento.registrarEventos(
          this._segundoComponenteCardinalidade.htmlComponente,
        );
        this._repositorioComponente.adicionar(this._segundoComponenteCardinalidade);
      });

    return {
      error: undefined,
      ok: true,
    };
  }

  redo(): CommandResult {
    this._commandCarregarCSSConexao?.redo();
    this._commandCarregarCSSCardinalidade?.redo();

    if (this._componenteConexao instanceof AbstractComponenteConexao) {
      this._primeiroComponente.adicionarOuvinte(this._componenteConexao);
      this._segundoComponente.adicionarOuvinte(this._componenteConexao);
      this._diagrama.append(this._componenteConexao.htmlComponente);
      this._repositorioComponente.adicionar(this._componenteConexao);
    }

    if (this._primeiroComponenteCardinalidade instanceof ComponenteCardinalidadeRelacionamento) {
      this._primeiroComponente.adicionarOuvinte(this._primeiroComponenteCardinalidade);
      this._componenteConexao?.adicionarOuvinte(this._primeiroComponenteCardinalidade);
      this._diagrama.append(this._primeiroComponenteCardinalidade.htmlComponente);
      this._repositorioComponente.adicionar(this._primeiroComponenteCardinalidade);
    }

    if (this._segundoComponenteCardinalidade instanceof ComponenteCardinalidadeRelacionamento) {
      this._segundoComponente.adicionarOuvinte(this._segundoComponenteCardinalidade);
      this._componenteConexao?.adicionarOuvinte(this._segundoComponenteCardinalidade);
      this._diagrama.append(this._segundoComponenteCardinalidade.htmlComponente);
      this._repositorioComponente.adicionar(this._segundoComponenteCardinalidade);
    }

    return {
      error: undefined,
      ok: true,
    };
  }

  undo(): CommandResult {
    this._commandCarregarCSSCardinalidade?.undo();
    this._commandCarregarCSSConexao?.undo();

    if (this._componenteConexao) {
      this._componenteConexao.htmlComponente.remove();
      this._repositorioComponente.remover(this._componenteConexao);
    }

    if (this._primeiroComponenteCardinalidade) {
      this._primeiroComponenteCardinalidade.htmlComponente.remove();
      this._repositorioComponente.remover(this._primeiroComponenteCardinalidade);
    }

    if (this._segundoComponenteCardinalidade) {
      this._segundoComponenteCardinalidade.htmlComponente.remove();
      this._repositorioComponente.remover(this._segundoComponenteCardinalidade);
    }

    return {
      error: undefined,
      ok: true,
    };
  }
}

// noinspection DuplicatedCode
export class ConectarDuasEntidadesRelacionaisCommandBuilder implements ICommandBuilder<ConectarDuasEntidadesRelacionaisCommand> {
  private _diagrama: HTMLElement | undefined | null = null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _fabricaConexao: ComponenteConexaoFactory | null = null;
  private _geradorID: GeradorIDComponente | null = null;
  private _registradorEventosConexao: RegistradorEventosConexao | null = null;
  private _registradorEventosElemento: RegistradorEventosElemento | null = null;
  private _repositorioComponentes: IRepositorioComponente | null = null;
  private _selecionadorAba: SelecionadorAba | null = null;
  private _primeiroComponente: ComponenteDiagrama | null = null;
  private _segundoComponente: ComponenteDiagrama | null = null;
  private _lateralPrimeiroComponente: LateraisComponente | null = null;
  private _lateralSegundoComponente: LateraisComponente | null = null;
  private _tipoConexao: TiposConexao | null = null;

  public copyAttributes(source: ConectarComponentesCommandBuilder): this {
    this._diagrama = source.diagrama;
    this._fabricaComponente = source.fabricaComponente;
    this._fabricaConexao = source.fabricaConexao;
    this._geradorID = source.geradorID;
    this._primeiroComponente = source.primeiroComponente;
    this._segundoComponente = source.segundoComponente;
    this._lateralPrimeiroComponente = source.lateralPrimeiroComponente;
    this._lateralSegundoComponente = source.lateralSegundoComponente;
    this._registradorEventosConexao = source.registradorEventosConexao;
    this._registradorEventosElemento = source.registradorEventosElemento;
    this._repositorioComponentes = source.repositorioComponentes;
    this._selecionadorAba = source.selecionadorAba;
    this._tipoConexao = source.tipoConexao;

    return this;
  }

  build(): ConectarDuasEntidadesRelacionaisCommand {
    if (this._diagrama === null || this._diagrama === undefined) {
      throw new CommandBuilderException("diagrama");
    }

    if (this._fabricaComponente === null) {
      throw new CommandBuilderException("fábrica de componentes");
    }

    if (this._fabricaConexao === null) {
      throw new CommandBuilderException("fábrica de conexões");
    }

    if (this._geradorID === null) {
      throw new CommandBuilderException("gerador de IDs de componentes");
    }

    if (this._primeiroComponente === null) {
      throw new CommandBuilderException("primeiro componente");
    }

    if (this._segundoComponente === null) {
      throw new CommandBuilderException("segundo componente");
    }

    if (this._lateralPrimeiroComponente === null) {
      throw new CommandBuilderException("lateral do primeiro componente");
    }

    if (this._lateralSegundoComponente === null) {
      throw new CommandBuilderException("lateral do segundo componente");
    }

    if (this._tipoConexao === null) {
      throw new CommandBuilderException("tipo de conexão");
    }

    if (this._registradorEventosConexao === null) {
      throw new CommandBuilderException("registrador de eventos de conexão");
    }

    if (this._registradorEventosElemento === null) {
      throw new CommandBuilderException("registrador de eventos de elemento");
    }

    if (this._repositorioComponentes === null) {
      throw new CommandBuilderException("repositório de componentes");
    }

    if (this._selecionadorAba === null) {
      throw new CommandBuilderException("selecionador de aba");
    }

    return new ConectarDuasEntidadesRelacionaisCommand(
      this._diagrama,
      this._fabricaComponente,
      this._fabricaConexao,
      this._geradorID,
      this._primeiroComponente,
      this._segundoComponente,
      this._lateralPrimeiroComponente,
      this._lateralSegundoComponente,
      this._registradorEventosConexao,
      this._registradorEventosElemento,
      this._repositorioComponentes,
      this._selecionadorAba,
      this._tipoConexao,
    );
  }
}
