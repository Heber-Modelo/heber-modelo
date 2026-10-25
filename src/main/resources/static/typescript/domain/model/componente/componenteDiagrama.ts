/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

import LateraisComponente from "domain/enum/lateraisComponente";
import ComponenteDiagramaOuvido from "domain/model/componente/componenteDiagramaOuvido";
import ComponenteDiagramaOuvinte from "domain/model/componente/componenteDiagramaOuvinte";
import PropriedadeComponente from "domain/model/propriedade/propriedadeComponente";
import Ponto from "domain/model/ponto";
import converterPixeisParaNumero from "domain/services/converterPixeisParaNumero";
import ComponenteJSON from "domain/json/componenteJSON";
import BaseJSONComponente from "domain/json/baseJSONComponente";

export default class ComponenteDiagrama implements ComponenteDiagramaOuvido {
  public static readonly CLASSE_BASE_COMPONENTE: string = "componente";
  public static readonly CLASSE_ELEMENTO_SELECIONADO: string = "selected";
  public static readonly PROPRIEDADE_CHAVE_I18N_DIAGRAMA: string = "data-chave-i18n-diagrama";
  public static readonly PROPRIEDADE_ID_ABA: string = "data-indice-aba";
  public static readonly PROPRIEDADE_ID_COMPONENTE: string = "data-id";
  public static readonly PROPRIEDADES_IDS_OUVINTES: string = "data-ids-ouvintes";
  public static readonly PROPRIEDADE_NOME_COMPONENTE: string = "data-nome-componente";
  public static readonly PROPRIEDADE_RECEBE_PONTOS_EXTENSORES: string =
    "data-recebe-pontos-extensores";
  public static readonly PROPRIEDADE_RECEBE_SETAS_CONECTORAS: string =
    "data-recebe-setas-conectoras";

  constructor(htmlComponente: HTMLDivElement, propriedades: PropriedadeComponente[] | null) {
    this._htmlComponente = htmlComponente;
    this._propriedades = propriedades ?? [];
  }

  private readonly _propriedades: PropriedadeComponente[];
  private _ouvintes: ComponenteDiagramaOuvinte[] = [];
  protected _htmlComponente: HTMLDivElement;
  protected _recebeSetas: boolean = true;

  public atualizarPropriedades(): void {
    this._propriedades.forEach((propriedade: PropriedadeComponente): void =>
      propriedade.atualizarInput(),
    );
  }

  public pegarEstiloElemento(): CSSStyleDeclaration {
    return getComputedStyle(this._htmlComponente);
  }

  public pegarIDElemento(): number {
    return Number(this._htmlComponente.getAttribute("data-id"));
  }

  public calcularPontoLateralComponente(lateralComponente: LateraisComponente): Ponto {
    let estiloComponente: CSSStyleDeclaration = this.pegarEstiloElemento();
    let x: number = 0;
    let y: number = 0;

    switch (lateralComponente) {
      case LateraisComponente.NORTE:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width) / 2;
        y = converterPixeisParaNumero(estiloComponente.top);
        break;

      case LateraisComponente.SUL:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width) / 2;
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height);
        break;

      case LateraisComponente.OESTE:
        x = converterPixeisParaNumero(estiloComponente.left);
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height) / 2;
        break;

      case LateraisComponente.LESTE:
        x =
          converterPixeisParaNumero(estiloComponente.left) +
          converterPixeisParaNumero(estiloComponente.width);
        y =
          converterPixeisParaNumero(estiloComponente.top) +
          converterPixeisParaNumero(estiloComponente.height) / 2;
        break;
    }

    return new Ponto(x, y);
  }

  private atualizarIdsOuvintes(): void {
    let ids: (number | null)[] = this._ouvintes.map(
      (ouvinte: ComponenteDiagramaOuvinte): number | null => {
        if (ouvinte instanceof ComponenteDiagrama) {
          return Number(
            ouvinte.htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE),
          );
        }

        return null;
      },
    );

    this._htmlComponente.setAttribute(ComponenteDiagrama.PROPRIEDADES_IDS_OUVINTES, `[${ids}]`);
  }

  adicionarOuvinte(ouvinte: ComponenteDiagramaOuvinte): void {
    this._ouvintes.push(ouvinte);
    this.atualizarIdsOuvintes();
  }

  removerOuvinte(
    ouvinte: ComponenteDiagramaOuvinte,
    alertar: boolean,
  ): ComponenteDiagramaOuvinte | null {
    let indexOuvinte: number = this._ouvintes.indexOf(ouvinte);

    if (alertar) {
      ouvinte.alertarRemovido();
    }

    if (indexOuvinte > -1) {
      this._ouvintes.splice(indexOuvinte, 1);
      this.atualizarIdsOuvintes();

      return ouvinte;
    }

    return null;
  }

  atualizarOuvintes(): void {
    this._ouvintes.forEach((ouvinte: ComponenteDiagramaOuvinte): void => {
      ouvinte.atualizar(this._htmlComponente);
    });
  }

  removerTodosOuvintes(): ComponenteDiagramaOuvinte[] {
    let ouvintesRemovidos: ComponenteDiagramaOuvinte[] = [];
    let ouvintesCopia: ComponenteDiagramaOuvinte[] = this._ouvintes.slice();
    ouvintesCopia.forEach((ouvinte: ComponenteDiagramaOuvinte): void => {
      let ouvinteRemovido: ComponenteDiagramaOuvinte | null = this.removerOuvinte(ouvinte, true);

      if (ouvinteRemovido !== null) {
        ouvintesRemovidos.push(ouvinteRemovido);
      }
    });

    this.atualizarIdsOuvintes();

    return ouvintesRemovidos;
  }

  private extrairElementosLista(tipos: string | null | undefined): string[] {
    if (!tipos) {
      return [];
    }

    return tipos
      .substring(1, tipos.length - 1)
      .split(",")
      .map((tipo: string): string => tipo.trim());
  }

  public toJSON(): BaseJSONComponente {
    let idAba: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_ABA),
    );
    let idComponente: number = Number(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_COMPONENTE),
    );
    let idsOuvintes: number[] = this.extrairElementosLista(
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADES_IDS_OUVINTES),
    ).map((id: string): number => Number(id));
    let nomeComponente: string =
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_NOME_COMPONENTE) || "";
    let classes: string[] = this._htmlComponente.classList.values().toArray();

    let recebePontosExtensores: boolean =
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_RECEBE_PONTOS_EXTENSORES) ==
      "true";
    let recebeSetasConectoras: boolean =
      this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_RECEBE_SETAS_CONECTORAS) ==
      "true";

    let estiloComponente: CSSStyleDeclaration = getComputedStyle(this._htmlComponente);
    let x: number = converterPixeisParaNumero(estiloComponente.left) || -1;
    let y: number = converterPixeisParaNumero(estiloComponente.top) || -1;
    let height: number = converterPixeisParaNumero(estiloComponente.height) || -1;
    let width: number = converterPixeisParaNumero(estiloComponente.width) || -1;
    let rotation: string = estiloComponente.rotate;

    return {
      idAba,
      idComponente,
      nomeComponente,
      classes,
      idsOuvintes,
      recebePontosExtensores,
      recebeSetasConectoras,
      innerHTML: this._htmlComponente.innerHTML,
      x,
      y,
      height,
      width,
      rotation,
    } as ComponenteJSON;
  }

  get htmlComponente(): HTMLDivElement {
    return this._htmlComponente;
  }

  set htmlComponente(novoHtmlComponente: HTMLDivElement) {
    this._htmlComponente = novoHtmlComponente;
  }

  get nome(): string {
    return this._htmlComponente.getAttribute(ComponenteDiagrama.PROPRIEDADE_NOME_COMPONENTE) ?? "";
  }

  get ouvintes(): ComponenteDiagramaOuvinte[] {
    return this._ouvintes;
  }

  set ouvintes(value: ComponenteDiagramaOuvinte[]) {
    this._ouvintes = value;
  }

  get propriedades(): PropriedadeComponente[] {
    return this._propriedades;
  }
}
