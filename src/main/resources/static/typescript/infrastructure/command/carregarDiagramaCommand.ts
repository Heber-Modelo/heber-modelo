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

import GeradorIDAba from "infrastructure/gerador/geradorIDAba";
import RepositorioAbas from "infrastructure/repositorio/repositorioAbas";
import criarAba from "infrastructure/services/criarAba";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import CommandBuilderException from "domain/exception/commandBuilderException";
import ResponseDiagramaJSON from "domain/json/responseDiagramaJSON";
import ICommand, { CommandResult } from "domain/model/command/iCommand";
import ICommandBuilder from "domain/model/command/iCommandBuilder";
import IRepositorioTiposDiagrama from "domain/model/repositorio/iRepositorioTiposDiagrama";
import Aba from "domain/model/aba";
import SelecionadorAba from "infrastructure/selecionador/selecionadorAba";
import ComponenteFactory from "infrastructure/factory/componenteFactory";

export default class CarregarDiagramaCommand implements ICommand {
  private readonly _callbackCriarComponente: (event: Event) => void;
  private readonly _callbackFecharAba: (event: MouseEvent) => void;
  private readonly _geradorIDAba: GeradorIDAba;
  private readonly _nomeDiagrama: string;
  private readonly _repositorioAbas: RepositorioAbas;
  private readonly _repositorioTiposDiagrama: IRepositorioTiposDiagrama;
  private readonly _sectionComponentes: HTMLElement;
  private readonly _selecionadorAba: SelecionadorAba;
  private readonly _seletorAbas: HTMLElement;

  private _fieldSetElementos: HTMLFieldSetElement | null = null;

  public constructor(
    callbackCriarComponente: (event: Event) => void,
    callbackFecharAba: (event: MouseEvent) => void,
    geradorIDAba: GeradorIDAba,
    nomeDiagrama: string,
    repositorioAbas: RepositorioAbas,
    repositorioTiposDiagrama: IRepositorioTiposDiagrama,
    sectionComponentes: HTMLElement,
    selecionadorAba: SelecionadorAba,
    seletorAba: HTMLElement,
  ) {
    this._callbackCriarComponente = callbackCriarComponente;
    this._callbackFecharAba = callbackFecharAba;
    this._geradorIDAba = geradorIDAba;
    this._nomeDiagrama = nomeDiagrama;
    this._repositorioAbas = repositorioAbas;
    this._repositorioTiposDiagrama = repositorioTiposDiagrama;
    this._sectionComponentes = sectionComponentes;
    this._selecionadorAba = selecionadorAba;
    this._seletorAbas = seletorAba;
  }

  private async criarBotaoElemento(
    nomeElemento: string,
    tipoElemento: string,
    exigeAbaExclusiva: boolean,
  ): Promise<HTMLButtonElement> {
    let botao: HTMLButtonElement = document.createElement("button");
    let responseSimbolo: Response = await fetch(`elementos/simbolos/${tipoElemento}.svg`);
    let textoSimboloSvg: string = await responseSimbolo.text();
    botao.classList.add("btn-criar-elemento");
    botao.setAttribute(ComponenteFactory.PROPRIEDADE_NOME_COMPONENTE, tipoElemento);
    botao.title = nomeElemento;
    botao.innerHTML = `${textoSimboloSvg} <h3>${nomeElemento.toUpperCase()}</h3>`;

    if (exigeAbaExclusiva) {
      botao.addEventListener("click", (event: MouseEvent): void => {
        criarAba(this._geradorIDAba.pegarProximoID(), this._callbackFecharAba).then(
          (novaAba: Aba): void => {
            this._repositorioAbas.adicionar(novaAba);
            this._selecionadorAba.selecionarAba(novaAba);

            this._seletorAbas.append(novaAba.htmlElement);

            novaAba.htmlElement.addEventListener("click", (): void => {
              this._selecionadorAba.selecionarAba(novaAba);
            });
          },
        );
        setTimeout((): void => this._callbackCriarComponente(event), 200);
      });
    } else {
      botao.addEventListener("click", this._callbackCriarComponente);
    }

    return botao;
  }

  execute(): CommandResult {
    fetch(`diagramas/${this._nomeDiagrama}.json`).then(
      async (response: Response): Promise<void> => {
        const diagramaJSON: ResponseDiagramaJSON = await response.json();

        let labelNomeDiagrama: string = diagramaJSON.nome;
        if (diagramaJSON.chaveI18N !== null && diagramaJSON.chaveI18N !== undefined) {
          labelNomeDiagrama = await traduzirChaveI18n(diagramaJSON.chaveI18N);
        }

        this._fieldSetElementos = document.createElement("fieldset");
        let legendNomeDiagrama: HTMLLegendElement = document.createElement("legend");
        legendNomeDiagrama.innerText = labelNomeDiagrama;
        this._fieldSetElementos.append(legendNomeDiagrama);
        this._fieldSetElementos.classList.add("componentes-diagrama");

        for (let tipoElemento of diagramaJSON.elementos) {
          let nomeElemento: string = tipoElemento.nome;

          if (tipoElemento.chaveI18N !== null && tipoElemento.chaveI18N !== undefined) {
            nomeElemento = await traduzirChaveI18n(tipoElemento.chaveI18N);
          }

          this._fieldSetElementos.append(
            await this.criarBotaoElemento(
              nomeElemento,
              tipoElemento.tipo,
              diagramaJSON.exigeAbaExclusiva,
            ),
          );
        }

        this._sectionComponentes?.append(this._fieldSetElementos);
        return;
      },
    );

    this._repositorioTiposDiagrama.adicionar(this._nomeDiagrama);

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
    this._fieldSetElementos?.remove();
    this._repositorioTiposDiagrama.remover(this._nomeDiagrama);

    return {
      ok: true,
      error: undefined,
    };
  }
}

export class CarregarDiagramaCommandBuilder implements ICommandBuilder<CarregarDiagramaCommand> {
  private _callbackCriarComponente: null | ((event: Event) => void) = null;
  private _callbackFecharAba: null | ((event: MouseEvent) => void) = null;
  private _geradorIDAba: GeradorIDAba | null = null;
  private _nomeDiagrama: string | null = null;
  private _repositorioAbas: RepositorioAbas | null = null;
  private _repositorioTiposDiagrama: IRepositorioTiposDiagrama | null = null;
  private _sectionComponentes: HTMLElement | null = null;
  private _selecionadorAba: SelecionadorAba | null = null;
  private _seletorAbas: HTMLElement | null = null;

  public definirCallbackCriarComponente(
    callbackCriarComponente: null | ((event: Event) => void),
  ): this {
    this._callbackCriarComponente = callbackCriarComponente;

    return this;
  }

  public definirCallbackFecharAba(callbackFecharAba: null | ((event: MouseEvent) => void)): this {
    this._callbackFecharAba = callbackFecharAba;

    return this;
  }

  public definirGeradorIDAba(geradorIDAba: GeradorIDAba | null): this {
    this._geradorIDAba = geradorIDAba;

    return this;
  }

  public definirNomeDiagrama(nomeDiagrama: string | null): this {
    this._nomeDiagrama = nomeDiagrama;

    return this;
  }

  public definirRepositorioAbas(repositorioAbas: RepositorioAbas | null): this {
    this._repositorioAbas = repositorioAbas;

    return this;
  }

  public definirRepositorioTiposDiagrama(
    repositorioTiposDiagrama: IRepositorioTiposDiagrama | null,
  ): this {
    this._repositorioTiposDiagrama = repositorioTiposDiagrama;

    return this;
  }

  public definirSectionComponentes(sectionComponentes: HTMLElement | null): this {
    this._sectionComponentes = sectionComponentes;

    return this;
  }

  public definirSelecionadorAba(selecionadorAba: SelecionadorAba | null): this {
    this._selecionadorAba = selecionadorAba;

    return this;
  }

  public definirSeletorAbas(seletorAba: HTMLElement | null): this {
    this._seletorAbas = seletorAba;

    return this;
  }

  public build(): CarregarDiagramaCommand {
    if (this._callbackCriarComponente === null) {
      throw new CommandBuilderException("CallbackCriarComponente");
    }

    if (this._callbackFecharAba === null) {
      throw new CommandBuilderException("CallbackFecharAba");
    }

    if (this._geradorIDAba === null) {
      throw new CommandBuilderException("gerador de id aba");
    }

    if (this._nomeDiagrama === null) {
      throw new CommandBuilderException("nome do diagrama");
    }

    if (this._repositorioAbas === null) {
      throw new CommandBuilderException("repositório de abas");
    }

    if (this._repositorioTiposDiagrama === null) {
      throw new CommandBuilderException("repositório de tipos de diagrama");
    }

    if (this._sectionComponentes === null) {
      throw new CommandBuilderException("SectionComponentes");
    }

    if (this._selecionadorAba === null) {
      throw new CommandBuilderException("selecionador de aba");
    }

    if (this._seletorAbas === null) {
      throw new CommandBuilderException("seletor de aba");
    }

    return new CarregarDiagramaCommand(
      this._callbackCriarComponente,
      this._callbackFecharAba,
      this._geradorIDAba,
      this._nomeDiagrama,
      this._repositorioAbas,
      this._repositorioTiposDiagrama,
      this._sectionComponentes,
      this._selecionadorAba,
      this._seletorAbas,
    );
  }
}
