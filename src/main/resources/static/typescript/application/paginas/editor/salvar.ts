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

import ComponenteJSON from "domain/json/componenteJSON";
import converterPixeisParaNumero from "domain/services/converterPixeisParaNumero";

const NOMES_COMPONENTES_ESPECIAIS: string[] = ["editor_descricao_relacional", "tabela_dicionario"];

const PROPRIEDADE_ID_ABA: string = "data-indice-aba";
const PROPRIEDADE_ID_COMPONENTE: string = "data-id";
const PROPRIEDADES_IDS_OUVINTES: string = "data-ids-ouvintes";
const PROPRIEDADE_NOME_COMPONENTE: string = "data-nome-componente";
const PROPRIEDADE_RECEBE_PONTOS_EXTENSORES: string = "data-recebe-pontos-extensores";
const PROPRIEDADE_RECEBE_SETAS_CONECTORAS: string = "data-recebe-setas-conectoras";

let buttonSalvarArquivo: HTMLButtonElement | null = document.querySelector("#btn-salvar-arquivo");
let seletorTipoDiagrama: HTMLElement | null = document.querySelector("#tipos-diagrama");

function extrairElementosLista(tipos: string | null | undefined): string[] {
  if (!tipos) {
    return [];
  }

  return tipos
    .substring(1, tipos.length - 1)
    .split(",")
    .map((tipo: string): string => tipo.trim());
}

function fecharTagDetails(elementoInicial: HTMLElement): void {
  let elemento: HTMLElement | null | undefined = elementoInicial;

  while (!(elemento instanceof HTMLDetailsElement)) {
    elemento = elemento?.parentElement;
  }

  elemento.open = false;
}

function salvar(event: Event): void {
  let dataCriado: Date = new Date();
  let tiposDiagrama: string[] = extrairElementosLista(seletorTipoDiagrama?.innerText);
  let componentes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".componente");

  let requestComponentes: ComponenteJSON[] = [];

  for (const componente of componentes) {
    let idAba: string | null = componente.getAttribute(PROPRIEDADE_ID_ABA);
    let idComponente: string | null = componente.getAttribute(PROPRIEDADE_ID_COMPONENTE);
    let idsOuvintes: number[] = extrairElementosLista(
      componente.getAttribute(PROPRIEDADES_IDS_OUVINTES),
    ).map((id: string): number => Number(id));
    let nomeComponente: string | null = componente.getAttribute(PROPRIEDADE_NOME_COMPONENTE);

    if (nomeComponente && NOMES_COMPONENTES_ESPECIAIS.includes(nomeComponente)) {
      continue;
    }

    let recebePontosExtensores: boolean =
      componente.getAttribute(PROPRIEDADE_RECEBE_PONTOS_EXTENSORES) == "true";
    let recebeSetasConectoras: boolean =
      componente.getAttribute(PROPRIEDADE_RECEBE_SETAS_CONECTORAS) == "true";

    let estiloComponente: CSSStyleDeclaration = getComputedStyle(componente);
    let x: number = converterPixeisParaNumero(estiloComponente.left);
    let y: number = converterPixeisParaNumero(estiloComponente.top);
    let height: number = converterPixeisParaNumero(estiloComponente.height);
    let width: number = converterPixeisParaNumero(estiloComponente.width);

    requestComponentes.push({
      idAba: Number(idAba),
      idComponente: Number(idComponente),
      nomeComponente: nomeComponente || "",
      idsOuvintes,
      recebePontosExtensores,
      recebeSetasConectoras,
      innerHTML: componente.innerHTML,
      x,
      y,
      height,
      width,
    });
  }

  let requestBody = {
    creationDate: dataCriado,
    types: tiposDiagrama,
    components: requestComponentes,
  };

  fecharTagDetails(event.target as HTMLElement);
}

buttonSalvarArquivo?.addEventListener("click", salvar);
