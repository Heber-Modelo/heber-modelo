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
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import TiposConexao from "model/conexao/tiposConexao";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteCardinalidadeRelacionamento from "model/componente/componenteCardinalidadeRelacionamento";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import CommandBuilderException from "model/exception/commandBuilderException";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import Ponto from "model/ponto";

export default class ConectarComponentesCommand implements ICommand {
  public static readonly NOME_ELEMENTO_ENTIDADE: string = "entidade";
  public static readonly NOME_ELEMENTO_RELACIONAMENTO: string = "relacionamento";
  public static readonly NOME_ELEMENTO_TEXTO: string = "texto";
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _geradorIDComponente: GeradorIDComponente;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioComponente: IRepositorioComponente;
  private readonly _primeiroComponente: ComponenteDiagrama;
  private readonly _segundoComponente: ComponenteDiagrama;
  private readonly _lateralPrimeiroComponente: LateraisComponente;
  private readonly _lateralSegundoComponente: LateraisComponente;
  private readonly _tipoConexao: TiposConexao;
  private _commandCarregarCSSTexto: CarregarCSSCommand | undefined;
  private _commandCarregarCSSTipoConexao: CarregarCSSCommand | undefined;
  private _componenteCardinalidade: ComponenteDiagrama | undefined;
  private _componenteConexao: ComponenteDiagrama | undefined;

  constructor(
    diagrama: HTMLElement,
    fabricaComponente: ComponenteFactory,
    fabricaConexao: ComponenteConexaoFactory,
    geradorIDComponente: GeradorIDComponente,
    registradorEventosConexao: RegistradorEventosConexao,
    registradorEventosElemento: RegistradorEventosElemento,
    repositorioComponente: IRepositorioComponente,
    primeiroComponente: ComponenteDiagrama,
    segundoComponente: ComponenteDiagrama,
    lateralPrimeiroComponente: LateraisComponente,
    lateralSegundoComponente: LateraisComponente,
    tipoConexao: TiposConexao,
  ) {
    this._diagrama = diagrama;
    this._fabricaComponente = fabricaComponente;
    this._fabricaConexao = fabricaConexao;
    this._geradorIDComponente = geradorIDComponente;
    this._registradorEventosConexao = registradorEventosConexao;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioComponente = repositorioComponente;
    this._primeiroComponente = primeiroComponente;
    this._segundoComponente = segundoComponente;
    this._lateralPrimeiroComponente = lateralPrimeiroComponente;
    this._lateralSegundoComponente = lateralSegundoComponente;
    this._tipoConexao = tipoConexao;
  }

  execute(): CommandResult {
    let primeiroPonto: Ponto = this._primeiroComponente.calcularPontoLateralComponente(
      this._lateralPrimeiroComponente,
    );
    let segundoPonto: Ponto = this._segundoComponente.calcularPontoLateralComponente(
      this._lateralSegundoComponente,
    );

    this._fabricaComponente
      .criarComponente(this._tipoConexao)
      .then((componente: ComponenteDiagrama): void => {
        this._commandCarregarCSSTipoConexao = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(this._tipoConexao)
          .build();
        this._commandCarregarCSSTipoConexao.execute();

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

        this._componenteConexao.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );
        this._registradorEventosConexao.registrarEventos(this._componenteConexao.htmlComponente);
        this._repositorioComponente.adicionar(this._componenteConexao);
        this._diagrama.append(this._componenteConexao.htmlComponente);
      });

    if (
      this._primeiroComponente.htmlComponente.getAttribute(
        ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
      ) !== ConectarComponentesCommand.NOME_ELEMENTO_RELACIONAMENTO &&
      this._segundoComponente.htmlComponente.getAttribute(
        ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
      ) !== ConectarComponentesCommand.NOME_ELEMENTO_RELACIONAMENTO
    ) {
      return {
        ok: true,
        error: undefined,
      };
    }

    this._fabricaComponente
      .criarComponente(ConectarComponentesCommand.NOME_ELEMENTO_TEXTO)
      .then((componente: ComponenteDiagrama): void => {
        this._commandCarregarCSSTexto = new CarregarCSSCommandBuilder()
          .definirNomeArquivo(ConectarComponentesCommand.NOME_ELEMENTO_TEXTO)
          .build();
        this._commandCarregarCSSTexto.execute();

        this._diagrama.append(componente.htmlComponente);
        this._registradorEventosElemento.registrarEventos(componente.htmlComponente);
        this._repositorioComponente.adicionar(componente);
        componente.htmlComponente.setAttribute(
          ComponenteFactory.PROPRIEDADE_ID_COMPONENTE,
          String(this._geradorIDComponente.pegarProximoID()),
        );

        if (this._componenteConexao === undefined) {
          return;
        }

        if (
          this._primeiroComponente.htmlComponente.getAttribute(
            ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
          ) === ConectarComponentesCommand.NOME_ELEMENTO_RELACIONAMENTO
        ) {
          this._componenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
            componente.htmlComponente,
            componente.propriedades,
            this._segundoComponente,
            this._componenteConexao,
            this._primeiroComponente,
            this._lateralSegundoComponente,
          );
        } else {
          this._componenteCardinalidade = new ComponenteCardinalidadeRelacionamento(
            componente.htmlComponente,
            componente.propriedades,
            this._primeiroComponente,
            this._componenteConexao,
            this._segundoComponente,
            this._lateralPrimeiroComponente,
          );
        }
      });
    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
    this._commandCarregarCSSTexto?.redo();
    this._commandCarregarCSSTipoConexao?.redo();

    if (this._componenteConexao) {
      this._diagrama.append(this._componenteConexao.htmlComponente);
      this._repositorioComponente.adicionar(this._componenteConexao);
    }

    if (this._componenteCardinalidade instanceof ComponenteCardinalidadeRelacionamento) {
      this._componenteConexao?.adicionarOuvinte(this._componenteCardinalidade);
      this._diagrama.append(this._componenteCardinalidade.htmlComponente);
      this._repositorioComponente.adicionar(this._componenteCardinalidade);

      if (
        this._primeiroComponente.htmlComponente.getAttribute(
          ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE,
        ) === ConectarComponentesCommand.NOME_ELEMENTO_RELACIONAMENTO
      ) {
        this._segundoComponente.adicionarOuvinte(this._componenteCardinalidade);
      } else {
        this._primeiroComponente.adicionarOuvinte(this._componenteCardinalidade);
      }
    }

    return {
      ok: true,
      error: undefined,
    };
  }

  undo(): CommandResult {
    this._commandCarregarCSSTexto?.undo();
    this._commandCarregarCSSTipoConexao?.undo();

    if (this._componenteCardinalidade) {
      this._componenteCardinalidade.htmlComponente.remove();
      this._repositorioComponente.remover(this._componenteCardinalidade);
    }

    if (this._componenteConexao) {
      this._componenteConexao.htmlComponente.remove();
      this._repositorioComponente.remover(this._componenteConexao);
    }

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ConectarComponentesCommandBuilder implements ICommandBuilder<ConectarComponentesCommand> {
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _fabricaConexao: ComponenteConexaoFactory | null = null;
  private _geradorID: GeradorIDComponente | null = null;
  private _registradorEventosConexao: RegistradorEventosConexao | null = null;
  private _registradorEventosElemento: RegistradorEventosElemento | null = null;
  private _repositorioComponentes: IRepositorioComponente | null = null;
  private _primeiroComponente: ComponenteDiagrama | null = null;
  private _segundoComponente: ComponenteDiagrama | null = null;
  private _lateralPrimeiroComponente: LateraisComponente | null = null;
  private _lateralSegundoComponente: LateraisComponente | null = null;
  private _tipoConexao: TiposConexao | null = null;

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

  public definirGeradorID(geradorID: GeradorIDComponente | null): this {
    this._geradorID = geradorID;

    return this;
  }

  public definirRegistradorEventosConexao(
    registradorEventosConexao: RegistradorEventosConexao | null,
  ): this {
    this._registradorEventosConexao = registradorEventosConexao;

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
    this._repositorioComponentes = repositorioComponentes;

    return this;
  }

  public definirPrimeiroComponente(primeiroComponente: ComponenteDiagrama | null): this {
    this._primeiroComponente = primeiroComponente;

    return this;
  }

  public definirLateralPrimeiroComponente(
    lateralPrimeiroComponente: LateraisComponente | null,
  ): this {
    this._lateralPrimeiroComponente = lateralPrimeiroComponente;

    return this;
  }

  public definirSegundoComponente(segundoComponente: ComponenteDiagrama | null): this {
    this._segundoComponente = segundoComponente;

    return this;
  }

  public definirLateralSegundoComponente(
    lateralSegundoComponente: LateraisComponente | null,
  ): this {
    this._lateralSegundoComponente = lateralSegundoComponente;

    return this;
  }

  public definirTipoConexao(tipoConexao: TiposConexao | null): this {
    this._tipoConexao = tipoConexao;

    return this;
  }

  public validate(): boolean {
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

  public build(): ConectarComponentesCommand {
    if (this._diagrama === undefined || this._diagrama === null) {
      throw new CommandBuilderException("diagrama");
    }

    if (this._fabricaComponente === null) {
      throw new CommandBuilderException("fábrica de componentes");
    }

    if (this._fabricaConexao === null) {
      throw new CommandBuilderException("fábrica de conexões");
    }

    if (this._geradorID === null) {
      throw new CommandBuilderException("gerador de ID");
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

    if (this._primeiroComponente === null) {
      throw new CommandBuilderException("primeiro componente");
    }

    if (this._lateralPrimeiroComponente === null) {
      throw new CommandBuilderException("lateral do primeiro componente");
    }

    if (this._segundoComponente === null) {
      throw new CommandBuilderException("segundo componente");
    }

    if (this._lateralSegundoComponente === null) {
      throw new CommandBuilderException("lateral do segundo componente");
    }

    if (this._tipoConexao === null) {
      throw new CommandBuilderException("tipo de conexão");
    }

    return new ConectarComponentesCommand(
      this._diagrama,
      this._fabricaComponente,
      this._fabricaConexao,
      this._geradorID,
      this._registradorEventosConexao,
      this._registradorEventosElemento,
      this._repositorioComponentes,
      this._primeiroComponente,
      this._segundoComponente,
      this._lateralPrimeiroComponente,
      this._lateralSegundoComponente,
      this._tipoConexao,
    );
  }

  get diagrama(): HTMLElement | undefined | null {
    return this._diagrama;
  }

  get fabricaComponente(): ComponenteFactory | null {
    return this._fabricaComponente;
  }

  get fabricaConexao(): ComponenteConexaoFactory | null {
    return this._fabricaConexao;
  }

  get geradorID(): GeradorIDComponente | null {
    return this._geradorID;
  }

  get registradorEventosConexao(): RegistradorEventosConexao | null {
    return this._registradorEventosConexao;
  }

  get registradorEventosElemento(): RegistradorEventosElemento | null {
    return this._registradorEventosElemento;
  }

  get repositorioComponentes(): IRepositorioComponente | null {
    return this._repositorioComponentes;
  }

  get primeiroComponente(): ComponenteDiagrama | null {
    return this._primeiroComponente;
  }

  get segundoComponente(): ComponenteDiagrama | null {
    return this._segundoComponente;
  }

  get lateralPrimeiroComponente(): LateraisComponente | null {
    return this._lateralPrimeiroComponente;
  }

  get lateralSegundoComponente(): LateraisComponente | null {
    return this._lateralSegundoComponente;
  }

  get tipoConexao(): TiposConexao | null {
    return this._tipoConexao;
  }
}
