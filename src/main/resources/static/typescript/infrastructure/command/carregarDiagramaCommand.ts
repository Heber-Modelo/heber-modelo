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

import ICommand from "../../model/command/iCommand.js";
import { ResponseDiagramaJSON } from "../../model/response/responseDiagramaJSON.js";
import { ResponseTraducaoJSON } from "../../model/response/responseTraducaoJSON.js";

export const ATRIBUTO_NOME_ELEMENTO = "data-nome-elemento";

export default class CarregarDiagramaCommand implements ICommand {
  private readonly _callbackCriarComponente: (event: Event) => void;
  private readonly _nomeDiagrama: string;
  private readonly _sectionComponentes: HTMLElement | null;

  private _fieldSetElementos: HTMLFieldSetElement | null = null;

  public constructor(
    callbackCriarComponente: (event: Event) => void,
    nomeDiagrama: string,
    sectionComponentes: HTMLElement | null,
  ) {
    this._callbackCriarComponente = callbackCriarComponente;
    this._nomeDiagrama = nomeDiagrama;
    this._sectionComponentes = sectionComponentes;
  }

  private async callbackMensagemTraducao(response: Response): Promise<string> {
    let responseTraducao: ResponseTraducaoJSON = await response.json();
    return responseTraducao.mensagem;
  }

  private criarBotaoElemento(nomeElemento: string, tipoElemento: string): HTMLButtonElement {
    let botao: HTMLButtonElement = document.createElement("button");
    botao.classList.add("btn-criar-elemento");
    botao.setAttribute(ATRIBUTO_NOME_ELEMENTO, tipoElemento);
    botao.title = nomeElemento;
    botao.innerText = nomeElemento.toUpperCase();
    botao.addEventListener("click", this._callbackCriarComponente);

    return botao;
  }

  execute(): Number {
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

          this._fieldSetElementos.append(this.criarBotaoElemento(nomeElemento, tipoElemento.tipo));
        }

        this._sectionComponentes?.append(this._fieldSetElementos);
        return;
      },
    );

    return 0;
  }

  undo(): Number {
    this._fieldSetElementos?.remove();

    return 0;
  }
}

export class CarregarDiagramaCommandBuilder {
  private _callbackCriarComponente: null | ((event: Event) => void) = null;
  private _nomeDiagrama: string | null = null;
  private _sectionComponentes: HTMLElement | null = null;

  definirCallCriarComponente(callbackCriarComponente: (event: Event) => void): this {
    this._callbackCriarComponente = callbackCriarComponente;

    return this;
  }

  definirNomeDiagrama(nomeDiagrama: string): this {
    this._nomeDiagrama = nomeDiagrama;

    return this;
  }

  definirSectionComponentes(sectionComponentes: HTMLElement): this {
    this._sectionComponentes = sectionComponentes;

    return this;
  }

  build(): CarregarDiagramaCommand {
    if (this._callbackCriarComponente === null) {
      throw new Error("CallbackCriarComponente não foi definido");
    }

    if (this._nomeDiagrama === null) {
      throw new Error("Nome do diagrama não foi definido");
    }

    if (this._sectionComponentes === null) {
      throw new Error("SectionComponentes não foi definida");
    }

    return new CarregarDiagramaCommand(
      this._callbackCriarComponente,
      this._nomeDiagrama,
      this._sectionComponentes,
    );
  }
}
