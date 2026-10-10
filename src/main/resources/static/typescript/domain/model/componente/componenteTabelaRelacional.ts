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
import TabelaRelacionalChangeEvent from "domain/event/tabelaRelacionalChangeEvent";
import { JSONPropriedade } from "domain/json/valoresJSONComponente";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";
import PropriedadeFilho from "domain/model/propriedade/propriedadeFilho";
import PropriedadeFilhoChaveAtributo from "domain/model/propriedade/propriedadeFilhoChaveAtributo";

export default class ComponenteTabelaRelacional extends ComponenteDiagrama {
  public static readonly CLASSE_ATRIBUTO: string = "atributo";
  public static readonly HTML_ATRIBUTO: string =
    '<div class="atributo"><span class="chave"><span class="desc-chave"></span></span><span contenteditable="true" spellcheck="true" class="texto">atributo: tipo</span></div>';
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
  }

  private criarAtributo = async (): Promise<void> => {
    let novoAtributo: HTMLDivElement = document.createElement("div");
    this.htmlComponente.append(novoAtributo);
    novoAtributo.outerHTML = ComponenteTabelaRelacional.HTML_ATRIBUTO;

    let alturaTabela: number = this.htmlComponente.getBoundingClientRect().height;
    this.htmlComponente.style.setProperty("height", `${alturaTabela + 32}px`);

    let novoAtributoChavePropriedadeJSON: JSONPropriedade = {
      chaveI18nLabel: "element.property.attribute.key.label",
      classeElemento: "chave",
      nomePropriedade: "child.attribute-key",
      sufixo: "",
      chavesI18nLabelsValoresPermitidos: [
        "element.property-value.attribute.key.none",
        "element.property-value.attribute.key.primary",
        "element.property-value.attribute.key.foreign",
      ],
      valoresPermitidos: ["NONE", "PRIMARY", "FOREIGN"],
      chaveI18nValorInicial: undefined,
    };

    let labelChave: string = await traduzirChaveI18n(
      novoAtributoChavePropriedadeJSON.chaveI18nLabel,
    );
    let propriedadeChave: PropriedadeComponente | null = this._fabricaPropriedade.criarPropriedade(
      novoAtributoChavePropriedadeJSON.nomePropriedade,
      novoAtributoChavePropriedadeJSON.sufixo,
      this,
      labelChave,
      novoAtributoChavePropriedadeJSON.classeElemento,
      novoAtributoChavePropriedadeJSON.chavesI18nLabelsValoresPermitidos,
      novoAtributoChavePropriedadeJSON.valoresPermitidos,
    );

    if (propriedadeChave instanceof PropriedadeFilhoChaveAtributo) {
      this.propriedades.push(propriedadeChave);
      propriedadeChave.indiceComponente = this._quantidadeAtributos;
    }

    let novoAtributoNomePropriedadeJSON: JSONPropriedade = {
      chaveI18nLabel: "element.property.attribute.name.label",
      chaveI18nValorInicial: "element.property.default-name.attribute-name",
      classeElemento: "texto",
      nomePropriedade: "child.innerText",
      sufixo: "",
      chavesI18nLabelsValoresPermitidos: undefined,
      valoresPermitidos: undefined,
    };

    let labelNome: string = await traduzirChaveI18n(novoAtributoNomePropriedadeJSON.chaveI18nLabel);
    let propriedadeNome: PropriedadeComponente | null = this._fabricaPropriedade.criarPropriedade(
      novoAtributoNomePropriedadeJSON.nomePropriedade,
      novoAtributoNomePropriedadeJSON.sufixo,
      this,
      labelNome,
      novoAtributoNomePropriedadeJSON.classeElemento,
      novoAtributoNomePropriedadeJSON.chavesI18nLabelsValoresPermitidos,
      novoAtributoNomePropriedadeJSON.valoresPermitidos,
    );

    if (propriedadeNome instanceof PropriedadeFilho) {
      this.propriedades.push(propriedadeNome);
      propriedadeNome.indiceComponente = this._quantidadeAtributos;
    }

    this._elementoDiagrama?.dispatchEvent(new TabelaRelacionalChangeEvent());
    this._quantidadeAtributos++;
  };

  private apagarUltimoAtributo = (): void => {
    let atributos: NodeListOf<HTMLElement> = this.htmlComponente.querySelectorAll(
      `.${ComponenteTabelaRelacional.CLASSE_ATRIBUTO}`,
    );

    if (atributos.length > 0) {
      atributos.item(atributos.length - 1).remove();
      let alturaTabela: number = this.htmlComponente.getBoundingClientRect().height;
      this.htmlComponente.style.setProperty("height", `${alturaTabela - 32}px`);
      this._quantidadeAtributos--;
      this.propriedades.pop();
      this.propriedades.pop();

      this._elementoDiagrama?.dispatchEvent(new TabelaRelacionalChangeEvent());
    }
  };
}
