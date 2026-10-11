/*
 * Copyright (c) 2026. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import PropriedadeFactory from "infrastructure/factory/propriedadeFactory";
import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import NomesComponente from "domain/enum/nomesComponente";
import TabelaRelacionalChangeEvent from "domain/event/tabelaRelacionalChangeEvent";
import ValoresJSONComponente, { JSONPropriedade } from "domain/json/valoresJSONComponente";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";
import PropriedadeFilho from "domain/model/propriedade/propriedadeFilho";
import PropriedadeFilhoChaveAtributo from "domain/model/propriedade/propriedadeFilhoChaveAtributo";

const ALTURA_INICIAL_ATRIBUTO: number = 32;
const ATRIBUTO_CHAVE_PROPRIEDADE_NOME: string = "child.attribute-key";
const ATRIBUTO_NOME_PROPRIEDADE_NOME: string = "child.innerText";
const CLASSE_ATRIBUTO: string = "atributo";
const HTML_ATRIBUTO: string =
  '<div class="atributo"><span class="chave"><span class="desc-chave"></span></span><span contenteditable="true" spellcheck="true" class="texto">atributo: tipo</span></div>';

export default class ComponenteTabelaRelacional extends ComponenteDiagrama {
  public static atributoChavePropriedadeJSON: JSONPropriedade;
  public static atributoNomePropriedadeJSON: JSONPropriedade;
  private readonly _elementoDiagrama: HTMLElement | null;
  private readonly _fabricaPropriedade: PropriedadeFactory;
  private _quantidadeAtributos: number;

  constructor(htmlComponente: HTMLDivElement, propriedades: PropriedadeComponente[] | null) {
    super(htmlComponente, propriedades);
    let buttonAdicionarAtributo: HTMLButtonElement | null =
      htmlComponente.querySelector(".adicionar-atributo");
    let buttonRemoverAtributo: HTMLButtonElement | null =
      htmlComponente.querySelector(".remover-atributo");

    this._elementoDiagrama = document.querySelector("main");
    this._fabricaPropriedade = new PropriedadeFactory();
    this._quantidadeAtributos = 1;
    buttonAdicionarAtributo?.addEventListener("click", this.criarAtributo);
    buttonRemoverAtributo?.addEventListener("click", this.apagarUltimoAtributo);

    if (
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON === undefined ||
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON === undefined
    ) {
      ComponenteTabelaRelacional.inicializarJsonPropriedades().then();
    }

    setTimeout((): void => {
      let quantidadeAtributos: number = htmlComponente.querySelectorAll(
        `.${CLASSE_ATRIBUTO}`,
      ).length;
      this.adicionarPropriedadesAtributos(quantidadeAtributos - 1).then();
    }, 500);
  }

  private static async inicializarJsonPropriedades(): Promise<void> {
    let response: Response = await fetch(
      `/elementos/${NomesComponente.TABELA_RELACIONAL.toLowerCase()}.json`,
    );
    let valoresJSON: ValoresJSONComponente = await response.json();

    for (const propriedade of valoresJSON.propriedades) {
      if (
        ComponenteTabelaRelacional.atributoChavePropriedadeJSON &&
        ComponenteTabelaRelacional.atributoNomePropriedadeJSON
      ) {
        break;
      }

      if (propriedade.nomePropriedade === ATRIBUTO_CHAVE_PROPRIEDADE_NOME) {
        ComponenteTabelaRelacional.atributoChavePropriedadeJSON = propriedade;
        continue;
      }

      if (propriedade.nomePropriedade === ATRIBUTO_NOME_PROPRIEDADE_NOME) {
        ComponenteTabelaRelacional.atributoNomePropriedadeJSON = propriedade;
      }
    }
  }

  private async adicionarPropriedadesAtributos(quantidadeAtributos: number = 1): Promise<void> {
    let labelPropriedadeChave: string = await traduzirChaveI18n(
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.chaveI18nLabel,
    );
    let propriedadeChave: PropriedadeComponente | null = this._fabricaPropriedade.criarPropriedade(
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.nomePropriedade,
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.sufixo,
      this,
      labelPropriedadeChave,
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.classeElemento,
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.chavesI18nLabelsValoresPermitidos,
      ComponenteTabelaRelacional.atributoChavePropriedadeJSON.valoresPermitidos,
    );

    let labelPropriedadeNome: string = await traduzirChaveI18n(
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.chaveI18nLabel,
    );
    let propriedadeNome: PropriedadeComponente | null = this._fabricaPropriedade.criarPropriedade(
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.nomePropriedade,
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.sufixo,
      this,
      labelPropriedadeNome,
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.classeElemento,
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.chavesI18nLabelsValoresPermitidos,
      ComponenteTabelaRelacional.atributoNomePropriedadeJSON.valoresPermitidos,
    );

    if (
      propriedadeChave instanceof PropriedadeFilhoChaveAtributo &&
      propriedadeNome instanceof PropriedadeFilho
    ) {
      for (let i: number = 0; i < quantidadeAtributos; i++) {
        this.propriedades.push(propriedadeChave);
        propriedadeChave.indiceComponente = this._quantidadeAtributos;

        this.propriedades.push(propriedadeNome);
        propriedadeNome.indiceComponente = this._quantidadeAtributos;

        this._quantidadeAtributos++;
      }
    }
  }

  private criarAtributo = async (): Promise<void> => {
    let novoAtributo: HTMLDivElement = document.createElement("div");
    this.htmlComponente.append(novoAtributo);
    novoAtributo.outerHTML = HTML_ATRIBUTO;

    let alturaTabela: number = this.htmlComponente.getBoundingClientRect().height;
    this.htmlComponente.style.setProperty("height", `${alturaTabela + ALTURA_INICIAL_ATRIBUTO}px`);
    await this.adicionarPropriedadesAtributos();

    this._elementoDiagrama?.dispatchEvent(new TabelaRelacionalChangeEvent());
  };

  private apagarUltimoAtributo = (): void => {
    let atributos: NodeListOf<HTMLElement> = this.htmlComponente.querySelectorAll(
      `.${CLASSE_ATRIBUTO}`,
    );

    if (atributos.length > 0) {
      atributos.item(atributos.length - 1).remove();
      let alturaTabela: number = this.htmlComponente.getBoundingClientRect().height;
      this.htmlComponente.style.setProperty(
        "height",
        `${alturaTabela - ALTURA_INICIAL_ATRIBUTO}px`,
      );
      this._quantidadeAtributos--;
      this.propriedades.pop();
      this.propriedades.pop();

      this._elementoDiagrama?.dispatchEvent(new TabelaRelacionalChangeEvent());
    }
  };
}
