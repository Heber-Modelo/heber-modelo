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

import TiposChave from "domain/enum/tiposChave";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import PropriedadeSelecionavel from "domain/model/propriedade/propriedadeSelecionavel";

export default class PropriedadeFilhoChaveAtributo extends PropriedadeSelecionavel {
  public static readonly CLASSE_CHAVE_ESCONDIDA: string = "chave-escondida";
  public static readonly CLASSE_CHAVE_ESTRANGEIRA: string = "chave-estrangeira";
  public static readonly CLASSE_CHAVE_PRIMARIA: string = "chave-primaria";
  public static readonly SVG_CHAVE: string =
    "<svg width='10px' height='20px' viewBox='0 0 90 221' xmlns='http://www.w3.org/2000/svg'>" +
    "<rect x='30' y='71' width='30' height='125' fill='currentColor'/>" +
    "<path d='M45 221L60.2169 195.779L54.4046 154.971H35.5954L29.7831 195.779L45 221Z' fill='currentColor'/>" +
    "<rect x='30' y='194' width='30' height='1' fill='currentColor'/>" +
    "<path d='M41 175.5L60.05 164.675V186.325L41 175.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<path d='M41 151.5L60.05 140.675V162.325L41 151.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<path d='M41 127.5L60.05 116.675V138.325L41 127.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<circle cx='45' cy='45' r='45' fill='currentColor'/>" +
    "<circle cx='45' cy='45' r='25' fill='currentColor' class='svg-cor-fill'/></svg>";
  private _indiceComponente: number;

  constructor(
    nome: string,
    componente: ComponenteDiagrama,
    sufixo: string,
    label: string,
    classeElemento: string,
    chavesI18nLabelsValoresPermitidos: string[] | undefined,
    valoresPermitidos: string[],
  ) {
    super(
      nome,
      componente,
      sufixo,
      label,
      classeElemento,
      chavesI18nLabelsValoresPermitidos,
      valoresPermitidos,
    );
    this._indiceComponente = 0;
  }

  definirValorPropriedade(valor: string): void {
    let elementos: NodeListOf<HTMLElement> = this._componente.htmlComponente.querySelectorAll(
      this._classeElemento,
    );
    let elementoAlvo: HTMLElement | null = elementos.item(this._indiceComponente);
    let tipoChave: TiposChave = TiposChave[valor.toUpperCase() as keyof typeof TiposChave];

    if (elementoAlvo === null) {
      return;
    }

    elementoAlvo.innerHTML = PropriedadeFilhoChaveAtributo.SVG_CHAVE;
    let elementoSvg: SVGSVGElement | null = elementoAlvo.querySelector("svg");

    if (elementoSvg === null) {
      return;
    }

    switch (tipoChave) {
      case TiposChave.NONE:
        elementoSvg.classList.value = PropriedadeFilhoChaveAtributo.CLASSE_CHAVE_ESCONDIDA;
        break;

      case TiposChave.PRIMARY:
        elementoSvg.classList.value = PropriedadeFilhoChaveAtributo.CLASSE_CHAVE_PRIMARIA;
        break;

      case TiposChave.FOREIGN:
        elementoSvg.classList.value = PropriedadeFilhoChaveAtributo.CLASSE_CHAVE_ESTRANGEIRA;
        break;
    }
  }

  protected pegarValorPropriedade(): string {
    let elementosSvg: NodeListOf<SVGSVGElement> =
      this._componente.htmlComponente.querySelectorAll("svg");
    let elementoSvg: SVGSVGElement | null = elementosSvg.item(this._indiceComponente);

    if (elementoSvg === null) {
      return TiposChave.NONE.toString().toUpperCase();
    }

    if (elementoSvg.classList.contains(PropriedadeFilhoChaveAtributo.CLASSE_CHAVE_PRIMARIA)) {
      return TiposChave.PRIMARY.toString().toUpperCase();
    } else if (
      elementoSvg.classList.contains(PropriedadeFilhoChaveAtributo.CLASSE_CHAVE_ESTRANGEIRA)
    ) {
      return TiposChave.FOREIGN.toString().toUpperCase();
    } else {
      return TiposChave.NONE.toString().toUpperCase();
    }
  }

  get indiceComponente(): number {
    return this._indiceComponente;
  }

  set indiceComponente(value: number) {
    this._indiceComponente = value;
  }
}
