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
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import TiposConexao from "domain/enum/tiposConexao";
import CommandBuilderException from "domain/exception/commandBuilderException";
import ICommand, { CommandResult } from "domain/model/command/iCommand";
import ICommandBuilder from "domain/model/command/iCommandBuilder";
import AbstractComponenteConexao from "domain/model/componente/abstractComponenteConexao";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import ComponenteDiagramaOuvinte from "domain/model/componente/componenteDiagramaOuvinte";
import IRepositorioComponente from "domain/model/repositorio/iRepositorioComponente";

export default class TrocarTipoConexaoCommand implements ICommand {
  private readonly _conexaoAlvo: AbstractComponenteConexao;
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private readonly _tipoConexao: TiposConexao;
  private _commandCarregarCSSConexao: CarregarCSSCommand | undefined;
  private _novoComponenteConexao: AbstractComponenteConexao | undefined;

  constructor(
    conexaoAlvo: AbstractComponenteConexao,
    diagrama: HTMLElement,
    fabricaComponente: ComponenteFactory,
    fabricaConexao: ComponenteConexaoFactory,
    registradorEventosConexao: RegistradorEventosConexao,
    repositorioComponentes: IRepositorioComponente,
    tipoConexao: TiposConexao,
  ) {
    this._conexaoAlvo = conexaoAlvo;
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._fabricaConexao = fabricaConexao;
    this._registradorEventosConexao = registradorEventosConexao;
    this._repositorioComponentes = repositorioComponentes;
    this._tipoConexao = tipoConexao;
  }

  execute(): CommandResult {
    this._commandCarregarCSSConexao = new CarregarCSSCommandBuilder()
      .definirNomeArquivo(this._tipoConexao)
      .build();
    this._commandCarregarCSSConexao.execute();

    this._fabricaComponente
      .criarComponente(this._tipoConexao)
      .then(async (componente: ComponenteDiagrama): Promise<void> => {
        this._novoComponenteConexao = this._fabricaConexao.criarConexao(
          this._tipoConexao,
          componente.htmlComponente,
          componente.propriedades,
          this._conexaoAlvo.primeiroPonto,
          this._conexaoAlvo.segundoPonto,
          this._conexaoAlvo.lateralPrimeiroPonto,
          this._conexaoAlvo.lateralSegundoPonto,
          this._conexaoAlvo.primeiroComponente,
          this._conexaoAlvo.segundoComponente,
        );

        let idAba: string | null = this._conexaoAlvo.htmlComponente.getAttribute(
          ComponenteFactory.PROPRIEDADE_ID_ABA,
        );
        let idConexao: string | null = this._conexaoAlvo.htmlComponente.getAttribute(
          ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE,
        );

        this._novoComponenteConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_ABA,
          `${idAba}`,
        );
        this._novoComponenteConexao.htmlComponente.setAttribute(
          ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE,
          `${idConexao}`,
        );

        let ouvintes: ComponenteDiagramaOuvinte[] = this._conexaoAlvo.ouvintes;

        for (const ouvinte of ouvintes) {
          this._conexaoAlvo.removerOuvinte(ouvinte, false);
          this._novoComponenteConexao.adicionarOuvinte(ouvinte);
        }

        this._conexaoAlvo.htmlComponente.remove();
        this._repositorioComponentes.remover(this._conexaoAlvo);

        this._diagrama.append(this._novoComponenteConexao.htmlComponente);
        this._registradorEventosConexao.registrarEventos(
          this._novoComponenteConexao.htmlComponente,
        );
        this._repositorioComponentes.adicionar(this._novoComponenteConexao);
      });

    return {
      error: undefined,
      ok: true,
    };
  }

  redo(): CommandResult {
    this._commandCarregarCSSConexao?.redo();

    if (this._novoComponenteConexao) {
      this._diagrama.append(this._novoComponenteConexao.htmlComponente);
      this._repositorioComponentes.adicionar(this._novoComponenteConexao);
    }

    return {
      error: undefined,
      ok: true,
    };
  }

  undo(): CommandResult {
    this._commandCarregarCSSConexao?.undo();

    if (this._novoComponenteConexao) {
      this._novoComponenteConexao.htmlComponente.remove();
      this._repositorioComponentes.remover(this._novoComponenteConexao);
    }

    this._diagrama.append(this._conexaoAlvo.htmlComponente);
    this._repositorioComponentes.adicionar(this._conexaoAlvo);

    return {
      error: undefined,
      ok: true,
    };
  }
}

export class TrocarTipoConexaoCommandBuilder implements ICommandBuilder<TrocarTipoConexaoCommand> {
  private _conexaoAlvo: AbstractComponenteConexao | null = null;
  private _diagrama: HTMLElement | undefined | null = null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _fabricaConexao: ComponenteConexaoFactory | null = null;
  private _registradorEventosConexao: RegistradorEventosConexao | null = null;
  private _repositorioComponentes: IRepositorioComponente | null = null;
  private _tipoConexao: TiposConexao | null = null;

  public definirConexaoAlvo(conexaoAlvo: AbstractComponenteConexao | null): this {
    this._conexaoAlvo = conexaoAlvo;

    return this;
  }

  public definirDiagrama(diagrama: HTMLElement | undefined | null): this {
    this._diagrama = diagrama;

    return this;
  }

  public definirFabricaComponente(fabricaComponente: ComponenteFactory | null): this {
    this._fabricaComponente = fabricaComponente;

    return this;
  }

  public definirFabricaConexao(fabricaConexao: ComponenteConexaoFactory | null): this {
    this._fabricaConexao = fabricaConexao;

    return this;
  }

  public definirRegistradorEventosConexao(
    registradorEventosConexao: RegistradorEventosConexao | null,
  ): this {
    this._registradorEventosConexao = registradorEventosConexao;

    return this;
  }

  public definirRepositorioComponentes(
    repositorioComponentes: IRepositorioComponente | null,
  ): this {
    this._repositorioComponentes = repositorioComponentes;

    return this;
  }

  public definirTipoConexao(tipoConexao: TiposConexao): this {
    this._tipoConexao = tipoConexao;

    return this;
  }

  build(): TrocarTipoConexaoCommand {
    if (this._conexaoAlvo === null) {
      throw new CommandBuilderException("conexão alvo");
    }

    if (this._diagrama === null || this._diagrama === undefined) {
      throw new CommandBuilderException("diagrama");
    }

    if (this._fabricaComponente === null) {
      throw new CommandBuilderException("fábrica de componente");
    }

    if (this._fabricaConexao === null) {
      throw new CommandBuilderException("fábrica de conexão");
    }

    if (this._registradorEventosConexao === null) {
      throw new CommandBuilderException("registrador de eventos de conexão");
    }

    if (this._repositorioComponentes === null) {
      throw new CommandBuilderException("repositório de componentes");
    }

    if (this._tipoConexao === null) {
      throw new CommandBuilderException("tipo de conexão");
    }

    return new TrocarTipoConexaoCommand(
      this._conexaoAlvo,
      this._diagrama,
      this._fabricaComponente,
      this._fabricaConexao,
      this._registradorEventosConexao,
      this._repositorioComponentes,
      this._tipoConexao,
    );
  }
}
