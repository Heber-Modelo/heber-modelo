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
import DescricaoRelacionalJSON from "domain/json/descricaoRelacionalJSON";
import DicionarioDadosJSON from "domain/json/dicionarioDadosJSON";
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

function coletarDadosComponentes(componentes: NodeListOf<HTMLDivElement>): ComponenteJSON[] {
  let requestComponentes: ComponenteJSON[] = [];

  for (const componente of componentes) {
    let idAba: number = Number(componente.getAttribute(PROPRIEDADE_ID_ABA));
    let idComponente: number = Number(componente.getAttribute(PROPRIEDADE_ID_COMPONENTE));
    let idsOuvintes: number[] = extrairElementosLista(
      componente.getAttribute(PROPRIEDADES_IDS_OUVINTES),
    ).map((id: string): number => Number(id));
    let nomeComponente: string = componente.getAttribute(PROPRIEDADE_NOME_COMPONENTE) || "";

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
      idAba,
      idComponente,
      nomeComponente,
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

  return requestComponentes;
}

function coletarDescricoesRelacionais(
  editores: NodeListOf<HTMLDivElement>,
): DescricaoRelacionalJSON[] {
  const CLASSE_AREA_EDICAO: string = ".ql-editor";
  let descricoesRelacionais: DescricaoRelacionalJSON[] = [];

  for (const editor of editores) {
    let idAba: number = Number(editor.getAttribute(PROPRIEDADE_ID_ABA));
    let idComponente: number = Number(editor.getAttribute(PROPRIEDADE_ID_COMPONENTE));
    let nomeComponente: string = editor.getAttribute(PROPRIEDADE_NOME_COMPONENTE) || "";
    let areaEdicao: HTMLElement | null = editor.querySelector(CLASSE_AREA_EDICAO);
    let descricaoHTML: string = areaEdicao?.innerHTML || "";

    descricoesRelacionais.push({
      idAba,
      idComponente,
      nomeComponente,
      descricaoHTML,
    });
  }

  return descricoesRelacionais;
}

function coletarTabelasDicionariosDados(
  dicionarios: NodeListOf<HTMLDivElement>,
): DicionarioDadosJSON[] {
  let dicionariosDadosJSON: DicionarioDadosJSON[] = [];
  let tabelas: HTMLTableElement[] = [];

  for (const dicionario of dicionarios) {
    tabelas.push(dicionario.querySelector("table") as HTMLTableElement);
  }

  for (let i: number = 0; i < tabelas.length; i++) {
    let tbody: HTMLTableSectionElement = tabelas[i].tBodies[0];

    let idAba: number = Number(dicionarios[i].getAttribute(PROPRIEDADE_ID_ABA));
    let idComponente: number = Number(dicionarios[i].getAttribute(PROPRIEDADE_ID_COMPONENTE));
    let nomeComponente: string = dicionarios[i].getAttribute(PROPRIEDADE_NOME_COMPONENTE) || "";
    let nomeEntidade: string = dicionarios[i].querySelector("caption")?.innerHTML || "";

    let atributos: string[] = [];
    let descricoes: string[] = [];
    let tipos: string[] = [];
    let tamanhos: string[] = [];
    let nulos: string[] = [];
    let regras: string[] = [];
    let chaves: string[] = [];
    let defaults: string[] = [];
    let unicos: string[] = [];

    for (const row of tbody.rows) {
      atributos.push(row.cells[0].children[0].innerHTML);
      descricoes.push(row.cells[1].children[0].innerHTML);
      tipos.push(row.cells[2].children[0].innerHTML);
      tamanhos.push(row.cells[3].children[0].innerHTML);
      nulos.push(row.cells[4].children[0].innerHTML);
      regras.push(row.cells[5].children[0].innerHTML);
      chaves.push(row.cells[6].children[0].innerHTML);
      defaults.push(row.cells[7].children[0].innerHTML);
      unicos.push(row.cells[8].children[0].innerHTML);
    }

    dicionariosDadosJSON.push({
      idAba,
      idComponente,
      nomeComponente,
      nomeEntidade,
      atributos,
      descricoes,
      tipos,
      tamanhos,
      nulos,
      regras,
      chaves,
      defaults,
      unicos,
    });
  }

  return dicionariosDadosJSON;
}

function salvar(event: Event): void {
  let dataCriado: Date = new Date();
  let tiposDiagrama: string[] = extrairElementosLista(seletorTipoDiagrama?.innerText);
  let componentes: NodeListOf<HTMLDivElement> = document.querySelectorAll(".componente");
  let editores: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    ".elemento-editor-descricao-relacional",
  );
  let dicionarios: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    ".elemento-dicionario-dados",
  );

  let requestComponentes: ComponenteJSON[] = coletarDadosComponentes(componentes);
  let descricoesRelacionais: DescricaoRelacionalJSON[] = coletarDescricoesRelacionais(editores);
  let dicionariosDados: DicionarioDadosJSON[] = coletarTabelasDicionariosDados(dicionarios);

  let requestBody = {
    creationDate: dataCriado,
    types: tiposDiagrama,
    components: requestComponentes,
    relationalDescriptions: descricoesRelacionais,
    dataDictionaries: dicionariosDados,
  };

  fecharTagDetails(event.target as HTMLElement);
}

buttonSalvarArquivo?.addEventListener("click", salvar);
