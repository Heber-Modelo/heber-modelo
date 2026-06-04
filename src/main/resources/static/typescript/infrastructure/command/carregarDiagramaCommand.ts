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

import ICommand, { CommandResult } from "model/command/iCommand";
import ICommandBuilder from "model/command/iCommandBuilder";
import CommandBuilderException from "model/exception/commandBuilderException";
import IRepositorioTiposDiagrama from "model/repositorio/iRepositorioTiposDiagrama";
import ResponseDiagramaJSON from "model/response/responseDiagramaJSON";
import ResponseTraducaoJSON from "model/response/responseTraducaoJSON";

export const ATRIBUTO_NOME_ELEMENTO = "data-nome-elemento";

export default class CarregarDiagramaCommand implements ICommand {
  private readonly _callbackCriarComponente: (event: Event) => void;
  private readonly _nomeDiagrama: string;
  private readonly _repositorioTiposDiagrama: IRepositorioTiposDiagrama;
  private readonly _sectionComponentes: HTMLElement | null;

  private _fieldSetElementos: HTMLFieldSetElement | null = null;

  public constructor(
    callbackCriarComponente: (event: Event) => void,
    nomeDiagrama: string,
    repositorioTiposDiagrama: IRepositorioTiposDiagrama,
    sectionComponentes: HTMLElement | null,
  ) {
    this._callbackCriarComponente = callbackCriarComponente;
    this._nomeDiagrama = nomeDiagrama;
    this._repositorioTiposDiagrama = repositorioTiposDiagrama;
    this._sectionComponentes = sectionComponentes;
  }

  private async callbackMensagemTraducao(response: Response): Promise<string> {
    let responseTraducao: ResponseTraducaoJSON = await response.json();
    return responseTraducao.mensagem;
  }

  private async criarBotaoElemento(
    nomeElemento: string,
    tipoElemento: string,
  ): Promise<HTMLButtonElement> {
    let botao: HTMLButtonElement = document.createElement("button");
    let responseSimbolo: Response = await fetch(`elementos/simbolos/${tipoElemento}.svg`);
    let textoSimboloSvg: string = await responseSimbolo.text();
    botao.classList.add("btn-criar-elemento");
    botao.setAttribute(ATRIBUTO_NOME_ELEMENTO, tipoElemento);
    botao.title = nomeElemento;
    botao.innerHTML = `${textoSimboloSvg} <h3>${nomeElemento.toUpperCase()}</h3>`;
    botao.addEventListener("click", this._callbackCriarComponente);

    return botao;
  }

  execute(): CommandResult {
    fetch(`diagramas/${this._nomeDiagrama}.json`).then(
      async (response: Response): Promise<void> => {
        const diagramaJSON: ResponseDiagramaJSON = await response.json();

        let labelNomeDiagrama: string = diagramaJSON.nome;
        if (diagramaJSON.chaveI18N !== null && diagramaJSON.chaveI18N !== undefined) {
          labelNomeDiagrama = await fetch(`/traducao/${diagramaJSON.chaveI18N}`).then(
            this.callbackMensagemTraducao,
          );
        }

        this._fieldSetElementos = document.createElement("fieldset");
        let legendNomeDiagrama: HTMLLegendElement = document.createElement("legend");
        legendNomeDiagrama.innerText = labelNomeDiagrama;
        this._fieldSetElementos.append(legendNomeDiagrama);
        this._fieldSetElementos.classList.add("componentes-diagrama");

        for (let tipoElemento of diagramaJSON.elementos) {
          let nomeElemento: string = tipoElemento.nome;

          if (tipoElemento.chaveI18N !== null && tipoElemento.chaveI18N !== undefined) {
            nomeElemento = await fetch(`/traducao/${tipoElemento.chaveI18N}`).then(
              this.callbackMensagemTraducao,
            );
          }

          this._fieldSetElementos.append(
            await this.criarBotaoElemento(nomeElemento, tipoElemento.tipo),
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
  private _nomeDiagrama: string | null = null;
  private _repositorioTiposDiagrama: IRepositorioTiposDiagrama | null = null;
  private _sectionComponentes: HTMLElement | null = null;

  public definirCallCriarComponente(
    callbackCriarComponente: null | ((event: Event) => void),
  ): this {
    this._callbackCriarComponente = callbackCriarComponente;

    return this;
  }

  public definirNomeDiagrama(nomeDiagrama: string | null): this {
    this._nomeDiagrama = nomeDiagrama;

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

  public build(): CarregarDiagramaCommand {
    if (this._callbackCriarComponente === null) {
      throw new CommandBuilderException("CallbackCriarComponente");
    }

    if (this._nomeDiagrama === null) {
      throw new CommandBuilderException("nome do diagrama");
    }

    if (this._repositorioTiposDiagrama === null) {
      throw new CommandBuilderException("repositório de tipos de diagrama");
    }

    if (this._sectionComponentes === null) {
      throw new CommandBuilderException("SectionComponentes");
    }

    return new CarregarDiagramaCommand(
      this._callbackCriarComponente,
      this._nomeDiagrama,
      this._repositorioTiposDiagrama,
      this._sectionComponentes,
    );
  }
}
