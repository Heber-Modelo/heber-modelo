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
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteCardinalidadeRelacionamento from "model/componente/componenteCardinalidadeRelacionamento";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import TiposConexao from "model/conexao/tiposConexao";
import Ponto from "model/ponto";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import CommandBuilderException from "model/exception/commandBuilderException";
import AbstractComponenteConexao from "model/componente/abstractComponenteConexao";

export default class ConectarDuasEntidadesCommand implements ICommand {
  public static readonly NOME_ELEMENTO_RELACIONAMENTO: string = "relacionamento";
  public static readonly NOME_ELEMENTO_TEXTO: string = "texto";
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
  private readonly _tipoConexao: TiposConexao;
  private _commandCarregarCSSConexao: CarregarCSSCommand | undefined;
  private _commandCarregarCSSRelacionamento: CarregarCSSCommand | undefined;
  private _commandCarregarCSSTexto: CarregarCSSCommand | undefined;
  private _componenteRelacionamento: ComponenteDiagrama | undefined;
  private _primeiroComponenteConexao: ComponenteDiagrama | undefined;
  private _segundoComponenteConexao: ComponenteDiagrama | undefined;
  private _primeiroComponenteCardinalidade: ComponenteDiagrama | undefined;
  private _segundoComponenteCardinalidade: ComponenteDiagrama | undefined;

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
    this._tipoConexao = tipoConexao;
  }

  private pegarLateralOposta(lateralComponente: LateraisComponente): LateraisComponente {
    switch (lateralComponente) {
      case LateraisComponente.NORTE:
        return LateraisComponente.SUL;

      case LateraisComponente.SUL:
        return LateraisComponente.NORTE;

      case LateraisComponente.LESTE:
        return LateraisComponente.OESTE;

      case LateraisComponente.OESTE:
        return LateraisComponente.LESTE;
    }
  }

  execute(): CommandResult {
    let primeiroPonto: Ponto = this._primeiroComponente.calcularPontoLateralComponente(
      this._lateralPrimeiroComponente,
    );
    let segundoPonto: Ponto = this._segundoComponente.calcularPontoLateralComponente(
      this._lateralSegundoComponente,
    );

    this._commandCarregarCSSConexao = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(this._tipoConexao)
      .build();
    this._commandCarregarCSSRelacionamento = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(ConectarDuasEntidadesCommand.NOME_ELEMENTO_RELACIONAMENTO)
      .build();
    this._commandCarregarCSSTexto = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(ConectarDuasEntidadesCommand.NOME_ELEMENTO_TEXTO)
      .build();

    this._commandCarregarCSSConexao.execute();
    this._commandCarregarCSSRelacionamento.execute();
    this._commandCarregarCSSTexto.execute();

    this._fabricaComponente
      .criarComponente(ConectarDuasEntidadesCommand.NOME_ELEMENTO_RELACIONAMENTO)
      .then(async (componente: ComponenteDiagrama): Promise<void> => {
        this._diagrama.append(componente.htmlComponente);
        this._registradorEventosElemento.registrarEventos(componente.htmlComponente);
        this._repositorioComponente.adicionar(componente);

        let componenteBoundingRect: DOMRect = componente.htmlComponente.getBoundingClientRect();
        componente.htmlComponente.style.setProperty(
          "left",
          `${(primeiroPonto.x + segundoPonto.x) / 2 - componenteBoundingRect.width / 2}px`,
        );
        componente.htmlComponente.style.setProperty(
          "top",
          `${(primeiroPonto.y + segundoPonto.y) / 2 - componenteBoundingRect.height / 2}px`,
        );
        componente.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._componenteRelacionamento = componente;

        let primeiraLateralRelacionamento: LateraisComponente = this.pegarLateralOposta(
          this._lateralPrimeiroComponente,
        );
        let primeiroPontoAuxiliar: Ponto = componente.calcularPontoLateralComponente(
          primeiraLateralRelacionamento,
        );
        let primeiraConexao: ComponenteDiagrama = await this._fabricaComponente.criarComponente(
          this._tipoConexao,
        );
        this._primeiroComponenteConexao = this._fabricaConexao.criarConexao(
          this._tipoConexao,
          primeiraConexao.htmlComponente,
          primeiraConexao.propriedades,
          primeiroPonto,
          primeiroPontoAuxiliar,
          this._lateralPrimeiroComponente,
          primeiraLateralRelacionamento,
          this._primeiroComponente,
          this._componenteRelacionamento,
        );

        this._registradorEventosConexao.registrarEventos(primeiraConexao.htmlComponente);
        primeiraConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._repositorioComponente.adicionar(this._primeiroComponenteConexao);
        this._diagrama.append(this._primeiroComponenteConexao.htmlComponente);

        let primeiraCardinalidade: ComponenteDiagrama =
          await this._fabricaComponente.criarComponente(
            ConectarDuasEntidadesCommand.NOME_ELEMENTO_TEXTO,
          );
        this._primeiroComponenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
          primeiraCardinalidade.htmlComponente,
          primeiraCardinalidade.propriedades,
          this._primeiroComponente,
          this._primeiroComponenteConexao,
          this._lateralPrimeiroComponente,
        );
        this._primeiroComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._registradorEventosElemento.registrarEventos(
          this._primeiroComponenteCardinalidade.htmlComponente,
        );
        this._repositorioComponente.adicionar(this._primeiroComponenteCardinalidade);
        this._diagrama.append(this._primeiroComponenteCardinalidade.htmlComponente);

        let segundaLateralRelacionamento: LateraisComponente = this.pegarLateralOposta(
          this._lateralSegundoComponente,
        );
        let segundoPontoAuxiliar: Ponto =
          this._componenteRelacionamento.calcularPontoLateralComponente(
            segundaLateralRelacionamento,
          );

        let segundaConexao: ComponenteDiagrama = await this._fabricaComponente.criarComponente(
          this._tipoConexao,
        );
        this._segundoComponenteConexao = this._fabricaConexao.criarConexao(
          this._tipoConexao,
          segundaConexao.htmlComponente,
          segundaConexao.propriedades,
          segundoPontoAuxiliar,
          segundoPonto,
          segundaLateralRelacionamento,
          this._lateralSegundoComponente,
          this._componenteRelacionamento,
          this._segundoComponente,
        );

        this._registradorEventosConexao.registrarEventos(segundaConexao.htmlComponente);
        segundaConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._repositorioComponente.adicionar(this._segundoComponenteConexao);
        this._diagrama.append(this._segundoComponenteConexao.htmlComponente);

        let segundaCardinalidade: ComponenteDiagrama =
          await this._fabricaComponente.criarComponente(
            ConectarDuasEntidadesCommand.NOME_ELEMENTO_TEXTO,
          );
        this._segundoComponenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
          segundaCardinalidade.htmlComponente,
          segundaCardinalidade.propriedades,
          this._segundoComponente,
          this._segundoComponenteConexao,
          this._lateralSegundoComponente,
        );
        this._segundoComponenteCardinalidade.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        this._registradorEventosElemento.registrarEventos(
          this._segundoComponenteCardinalidade.htmlComponente,
        );
        this._repositorioComponente.adicionar(this._segundoComponenteCardinalidade);
        this._diagrama.append(this._segundoComponenteCardinalidade.htmlComponente);
      });

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    this._commandCarregarCSSConexao?.redo();
    this._commandCarregarCSSRelacionamento?.redo();
    this._commandCarregarCSSTexto?.redo();

    if (this._componenteRelacionamento) {
      this._diagrama.append(this._componenteRelacionamento.htmlComponente);
      this._repositorioComponente.adicionar(this._componenteRelacionamento);
    }

    if (this._primeiroComponenteConexao instanceof AbstractComponenteConexao) {
      this._primeiroComponente.adicionarOuvinte(this._primeiroComponenteConexao);
      this._componenteRelacionamento?.adicionarOuvinte(this._primeiroComponenteConexao);
      this._diagrama.append(this._primeiroComponenteConexao.htmlComponente);
      this._repositorioComponente.adicionar(this._primeiroComponenteConexao);
    }

    if (this._segundoComponenteConexao instanceof AbstractComponenteConexao) {
      this._segundoComponente.adicionarOuvinte(this._segundoComponenteConexao);
      this._componenteRelacionamento?.adicionarOuvinte(this._segundoComponenteConexao);
      this._diagrama.append(this._segundoComponenteConexao.htmlComponente);
      this._repositorioComponente.adicionar(this._segundoComponenteConexao);
    }

    if (this._primeiroComponenteCardinalidade instanceof ComponenteCardinalidadeRelacionamento) {
      this._primeiroComponente.adicionarOuvinte(this._primeiroComponenteCardinalidade);
      this._primeiroComponenteConexao?.adicionarOuvinte(this._primeiroComponenteCardinalidade);
      this._diagrama.append(this._primeiroComponenteCardinalidade.htmlComponente);
      this._repositorioComponente.adicionar(this._primeiroComponenteCardinalidade);
    }

    if (this._segundoComponenteCardinalidade instanceof ComponenteCardinalidadeRelacionamento) {
      this._segundoComponente.adicionarOuvinte(this._segundoComponenteCardinalidade);
      this._segundoComponenteConexao?.adicionarOuvinte(this._segundoComponenteCardinalidade);
      this._diagrama.append(this._segundoComponenteCardinalidade.htmlComponente);
      this._repositorioComponente.adicionar(this._segundoComponenteCardinalidade);
    }

    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._commandCarregarCSSConexao?.undo();
    this._commandCarregarCSSRelacionamento?.undo();
    this._commandCarregarCSSTexto?.undo();

    if (this._componenteRelacionamento) {
      this._componenteRelacionamento.htmlComponente.remove();
      this._repositorioComponente.remover(this._componenteRelacionamento);
    }

    if (this._primeiroComponenteConexao) {
      this._primeiroComponenteConexao.htmlComponente.remove();
      this._repositorioComponente.remover(this._primeiroComponenteConexao);
    }

    if (this._segundoComponenteConexao) {
      this._segundoComponenteConexao.htmlComponente.remove();
      this._repositorioComponente.remover(this._segundoComponenteConexao);
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
      ok: true,
      error: undefined,
    };
  }
}

export class ConectarDuasEntidadesCommandBuilder implements ICommandBuilder<ConectarDuasEntidadesCommand> {
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | undefined;
  private _fabricaConexao: ComponenteConexaoFactory | undefined;
  private _geradorID: GeradorIDComponente | undefined;
  private _registradorEventosConexao: RegistradorEventosConexao | undefined;
  private _registradorEventosElemento: RegistradorEventosElemento | undefined;
  private _repositorioComponentes: IRepositorioComponente | undefined;
  private _primeiroComponente: ComponenteDiagrama | undefined;
  private _segundoComponente: ComponenteDiagrama | undefined;
  private _lateralPrimeiroComponente: LateraisComponente | undefined;
  private _lateralSegundoComponente: LateraisComponente | undefined;
  private _tipoConexao: TiposConexao | undefined;

  validate(): boolean {
    return [
      this._diagrama,
      this._fabricaComponente,
      this._fabricaConexao,
      this._geradorID,
      this._registradorEventosElemento,
      this._repositorioComponentes,
      this._primeiroComponente,
      this._segundoComponente,
      this._lateralPrimeiroComponente,
      this._lateralSegundoComponente,
      this._tipoConexao,
    ].every((item: any): boolean => !!item);
  }

  copyAttributes(source: ConectarComponentesCommandBuilder): this {
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
    this._tipoConexao = source.tipoConexao;

    return this;
  }

  build(): ConectarDuasEntidadesCommand {
    if (this._diagrama === null || this._diagrama === undefined) {
      throw new CommandBuilderException("O diagrama não foi definido");
    }

    if (this._fabricaComponente === undefined) {
      throw new CommandBuilderException("A fábrica de componentes não foi definida");
    }

    if (this._fabricaConexao === undefined) {
      throw new CommandBuilderException("A fábrica de conexões não foi definida");
    }

    if (this._geradorID === undefined) {
      throw new CommandBuilderException("O gerador de IDs de componentes não foi definido");
    }

    if (this._primeiroComponente === undefined) {
      throw new CommandBuilderException("O primeiro componente não foi definido");
    }

    if (this._segundoComponente === undefined) {
      throw new CommandBuilderException("O segundo componente não foi definido");
    }

    if (this._lateralPrimeiroComponente === undefined) {
      throw new CommandBuilderException("A lateral do primeiro componente não foi definida");
    }

    if (this._lateralSegundoComponente === undefined) {
      throw new CommandBuilderException("A lateral do segundo componente não foi definida");
    }

    if (this._tipoConexao === undefined) {
      throw new CommandBuilderException("O tipo de conexão não foi definido");
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

    return new ConectarDuasEntidadesCommand(
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
      this._tipoConexao,
    );
  }
}
