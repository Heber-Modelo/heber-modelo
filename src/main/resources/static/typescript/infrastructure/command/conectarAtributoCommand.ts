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

import ConectarComponentesCommand, {
  ConectarComponentesCommandBuilder,
} from "infrastructure/command/conectarComponentesCommand";
import CriarComponenteCommand, {
  CriarComponenteCommandBuilder,
} from "infrastructure/command/criarComponenteCommand";
import ComponenteConexaoFactory from "infrastructure/factory/componenteConexaoFactory";
import GeradorIDComponente from "infrastructure/gerador/geradorIDComponente";
import RegistradorEventosConexao from "infrastructure/registrador/registradorEventosConexao";
import RegistradorEventosElemento from "infrastructure/registrador/registradorEventosElemento";
import ComponenteFactory from "infrastructure/factory/componenteFactory";
import calcularPosicaoAtributo from "infrastructure/services/calcularPosicaoAtributo";
import colectarPosicoesAtributos from "infrastructure/services/colectarPosicoesAtributos";
import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import ComponenteDiagrama from "model/componente/componenteDiagrama";
import LateraisComponente from "model/componente/lateraisComponente";
import NomesComponente from "model/componente/nomesComponente";
import TiposConexao from "model/conexao/tiposConexao";
import CommandBuilderException from "model/exception/commandBuilderException";
import Ponto from "model/ponto";
import IRepositorioComponente from "model/repositorio/iRepositorioComponente";
import converterPixeisParaNumero from "model/services/converterPixeisParaNumero";
import calcularLateralComponente from "model/services/calcularLateralComponente";

export default class ConectarAtributoCommand implements ICommand {
  private readonly _componenteAlvo: ComponenteDiagrama;
  private readonly _diagrama: HTMLElement;
  private readonly _fabricaConexao: ComponenteConexaoFactory;
  private readonly _fabricaComponente: ComponenteFactory;
  private readonly _geradorID: GeradorIDComponente;
  private readonly _pontoAlvo: Ponto;
  private readonly _registradorEventosConexao: RegistradorEventosConexao;
  private readonly _registradorEventosElemento: RegistradorEventosElemento;
  private readonly _repositorioComponentes: IRepositorioComponente;
  private readonly _tipoConexao: TiposConexao;
  private _commandCriarComponenteAtributo: CriarComponenteCommand | undefined;
  private _commandConectarComponentes: ConectarComponentesCommand | undefined;
  private _componenteAtributo: ComponenteDiagrama | null = null;

  constructor(
    componenteAlvo: ComponenteDiagrama,
    diagrama: HTMLElement,
    fabricaConexao: ComponenteConexaoFactory,
    fabricaComponente: ComponenteFactory,
    geradorID: GeradorIDComponente,
    pontoAlvo: Ponto,
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
    this._pontoAlvo = pontoAlvo;
    this._registradorEventosConexao = registradorEventosConexao;
    this._registradorEventosElemento = registradorEventosElemento;
    this._repositorioComponentes = repositorioComponentes;
    this._tipoConexao = tipoConexao;
  }

  private ajustarPosicaoAtributo(lateralComponente: LateraisComponente): void {
    if (!this._componenteAtributo) {
      return;
    }

    let posicoesOcupadas: Ponto[] = colectarPosicoesAtributos(
      this._repositorioComponentes.listar(),
    );
    // A última posição da lista é do atributo atual
    posicoesOcupadas.pop();

    let realX: number = converterPixeisParaNumero(
      this._componenteAtributo.htmlComponente.style.getPropertyValue("left"),
    );
    let realY: number = converterPixeisParaNumero(
      this._componenteAtributo.htmlComponente.style.getPropertyValue("top"),
    );

    for (const ponto of posicoesOcupadas) {
      while (ponto.x === realX && ponto.y === realY) {
        if (lateralComponente === LateraisComponente.NORTE) {
          realY -= 25;
        } else {
          realY += 25;
        }

        this._componenteAtributo.htmlComponente.style.setProperty("left", `${realX}px`);
        this._componenteAtributo.htmlComponente.style.setProperty("top", `${realY}px`);
      }
    }
  }

  execute(): CommandResult {
    this._commandCriarComponenteAtributo = new CriarComponenteCommandBuilder()
      .definirDiagrama(this._diagrama)
      .definirFabricaComponente(this._fabricaComponente)
      .definirGeradorIDComponente(this._geradorID)
      .definirNomeElemento(NomesComponente.ATRIBUTO_DER)
      .definirRegistradorEventosElemento(this._registradorEventosElemento)
      .definirRepositorioComponentes(this._repositorioComponentes)
      .build();
    this._commandCriarComponenteAtributo.execute();

    setTimeout((): void => {
      let componentes: ComponenteDiagrama[] = this._repositorioComponentes.listar();
      this._componenteAtributo = componentes.at(componentes.length - 1) || null;

      let lateralComponente: LateraisComponente = calcularLateralComponente(
        this._componenteAlvo.htmlComponente,
        this._pontoAlvo,
      );
      let posicaoAtributo: Ponto = calcularPosicaoAtributo(
        this._componenteAlvo,
        this._componenteAtributo,
        lateralComponente,
      );

      this._componenteAtributo?.htmlComponente.style.setProperty("top", `${posicaoAtributo.y}px`);
      this._componenteAtributo?.htmlComponente.style.setProperty("left", `${posicaoAtributo.x}px`);

      this.ajustarPosicaoAtributo(lateralComponente);

      let lateralAtributo: LateraisComponente = LateraisComponente.OESTE;

      if (lateralComponente === LateraisComponente.OESTE) {
        lateralAtributo = LateraisComponente.LESTE;
      }

      this._commandConectarComponentes = new ConectarComponentesCommandBuilder()
        .definirDiagrama(this._diagrama)
        .definirFabricaConexao(this._fabricaConexao)
        .definirFabricaComponente(this._fabricaComponente)
        .definirGeradorID(this._geradorID)
        .definirPrimeiroComponente(this._componenteAlvo)
        .definirLateralPrimeiroComponente(lateralComponente)
        .definirSegundoComponente(this._componenteAtributo)
        .definirLateralSegundoComponente(lateralAtributo)
        .definirRegistradorEventosConexao(this._registradorEventosConexao)
        .definirRegistradorEventosElemento(this._registradorEventosElemento)
        .definirRepositorioComponentes(this._repositorioComponentes)
        .definirTipoConexao(this._tipoConexao)
        .build();

      this._commandConectarComponentes.execute();
    }, 200);

    return {
      ok: true,
      error: undefined,
    };
  }

  redo(): CommandResult {
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
    this._commandConectarComponentes?.undo();

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class ConectarAtributoCommandBuilder implements ICommandBuilder<ConectarAtributoCommand> {
  private static readonly _elementosPermitidos: string[] = [
    NomesComponente.ATRIBUTO_DER,
    NomesComponente.AGREGACAO,
    NomesComponente.ENTIDADE,
    NomesComponente.RELACIONAMENTO,
  ];
  private _componenteAlvo: ComponenteDiagrama | null = null;
  private _diagrama: HTMLElement | undefined | null;
  private _fabricaComponente: ComponenteFactory | null = null;
  private _fabricaConexao: ComponenteConexaoFactory | null = null;
  private _geradorID: GeradorIDComponente | null = null;
  private _pontoAlvo: Ponto | null = null;
  private _registradorEventosConexao: RegistradorEventosConexao | null = null;
  private _registradorEventosElemento: RegistradorEventosElemento | null = null;
  private _repositorioComponentes: IRepositorioComponente | null = null;
  private _tipoConexao: TiposConexao | null = null;

  public static verificarElementoPermitido(elemento: string): boolean {
    return this._elementosPermitidos.includes(elemento);
  }

  public definirComponenteAlvo(componenteAlvo: ComponenteDiagrama | null): this {
    this._componenteAlvo = componenteAlvo;

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

  public definirGeradorID(geradorID: GeradorIDComponente | null): this {
    this._geradorID = geradorID;

    return this;
  }

  public definirPontoAlvo(pontoAlvo: Ponto | null): this {
    this._pontoAlvo = pontoAlvo;

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

  public definirTipoConexao(tipoConexao: TiposConexao | null): this {
    this._tipoConexao = tipoConexao;

    return this;
  }

  public build(): ConectarAtributoCommand {
    if (this._componenteAlvo === null) {
      throw new CommandBuilderException("componente alvo");
    }

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

    if (this._pontoAlvo === null) {
      throw new CommandBuilderException("ponto alvo");
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

    if (this._tipoConexao === null) {
      throw new CommandBuilderException("tipo de conexão");
    }

    return new ConectarAtributoCommand(
      this._componenteAlvo,
      this._diagrama,
      this._fabricaConexao,
      this._fabricaComponente,
      this._geradorID,
      this._pontoAlvo,
      this._registradorEventosConexao,
      this._registradorEventosElemento,
      this._repositorioComponentes,
      this._tipoConexao,
    );
  }
}
