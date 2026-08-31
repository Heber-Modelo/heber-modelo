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

import TipoArquivo from "domain/enum/tipoArquivo";
import ComponenteJSON from "domain/json/componenteJSON";
import AbaJSON from "domain/json/abaJSON";
import DescricaoRelacionalJSON from "domain/json/descricaoRelacionalJSON";
import DiagramasJSON from "domain/json/diagramasJSON";
import DicionarioDadosJSON from "domain/json/dicionarioDadosJSON";
import converterPixeisParaNumero from "domain/services/converterPixeisParaNumero";

const NOMES_COMPONENTES_ESPECIAIS: string[] = ["editor_descricao_relacional", "tabela_dicionario"];

const PROPRIEDADE_ID_ABA: string = "data-indice-aba";
const PROPRIEDADE_ID_COMPONENTE: string = "data-id";
const PROPRIEDADES_IDS_OUVINTES: string = "data-ids-ouvintes";
const PROPRIEDADE_NOME_COMPONENTE: string = "data-nome-componente";
const PROPRIEDADE_RECEBE_PONTOS_EXTENSORES: string = "data-recebe-pontos-extensores";
const PROPRIEDADE_RECEBE_SETAS_CONECTORAS: string = "data-recebe-setas-conectoras";

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

function coletarAbas(elementosAbas: NodeListOf<HTMLDivElement>): AbaJSON[] {
  let abas: AbaJSON[] = [];

  for (const aba of elementosAbas) {
    let elementoNomeAba: HTMLElement | null = aba.querySelector(".numero-aba");

    let id: number = Number(aba.getAttribute(PROPRIEDADE_ID_ABA));
    let nome: string = elementoNomeAba?.innerText || String(id);

    abas.push({ id, nome });
  }

  return abas;
}

function coletarArquivosCSS(links: NodeListOf<HTMLLinkElement>): string[] {
  let arquivosCSSCarregados: string[] = [];

  for (const link of links) {
    let partesLink: string[] = link.href.split("/");
    arquivosCSSCarregados.push(partesLink[partesLink.length - 1]);
  }

  return arquivosCSSCarregados;
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

    let classes: string[] = [];
    for (const cssClass of componente.classList) {
      classes.push(cssClass);
    }

    let recebePontosExtensores: boolean =
      componente.getAttribute(PROPRIEDADE_RECEBE_PONTOS_EXTENSORES) == "true";
    let recebeSetasConectoras: boolean =
      componente.getAttribute(PROPRIEDADE_RECEBE_SETAS_CONECTORAS) == "true";

    let estiloComponente: CSSStyleDeclaration = getComputedStyle(componente);
    let x: number = converterPixeisParaNumero(estiloComponente.left) || -1;
    let y: number = converterPixeisParaNumero(estiloComponente.top) || -1;
    let height: number = converterPixeisParaNumero(estiloComponente.height) || -1;
    let width: number = converterPixeisParaNumero(estiloComponente.width) || -1;
    let rotation: string = estiloComponente.rotate;

    requestComponentes.push({
      idAba,
      idComponente,
      nomeComponente,
      classes,
      idsOuvintes,
      recebePontosExtensores,
      recebeSetasConectoras,
      innerHTML: componente.innerHTML,
      x,
      y,
      height,
      width,
      rotation,
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

function downloadFile(url: string, filename: string): void {
  let temporaryDownloadAnchor: HTMLAnchorElement = document.createElement("a");
  temporaryDownloadAnchor.setAttribute("href", url);
  temporaryDownloadAnchor.setAttribute("download", filename);
  temporaryDownloadAnchor.style.setProperty("display", "none");
  document.body.append(temporaryDownloadAnchor);
  temporaryDownloadAnchor.click();
  temporaryDownloadAnchor.remove();
}

async function salvar(event: Event, tipoArquivo: TipoArquivo): Promise<void> {
  let dataCriado: Date = new Date();
  let tiposDiagrama: string[] = extrairElementosLista(seletorTipoDiagrama?.innerText);

  let abas: AbaJSON[] = coletarAbas(document.querySelectorAll(".aba:not(#nova-aba)"));
  let arquivosCSSCarregados: string[] = coletarArquivosCSS(
    document.head.querySelectorAll("link.css-carregado"),
  );
  let requestComponentes: ComponenteJSON[] = coletarDadosComponentes(
    document.querySelectorAll("div.componente"),
  );
  let descricoesRelacionais: DescricaoRelacionalJSON[] = coletarDescricoesRelacionais(
    document.querySelectorAll(".elemento-editor-descricao-relacional"),
  );
  let dicionariosDados: DicionarioDadosJSON[] = coletarTabelasDicionariosDados(
    document.querySelectorAll(".elemento-dicionario-dados"),
  );

  let requestBody: DiagramasJSON = {
    creationDate: dataCriado,
    loadedCSSFiles: arquivosCSSCarregados,
    types: tiposDiagrama,
    tabs: abas,
    components: requestComponentes,
    relationalDescriptions: descricoesRelacionais,
    dataDictionaries: dicionariosDados,
  };

  fecharTagDetails(event.target as HTMLElement);

  if (tipoArquivo === TipoArquivo.XML) {
    let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
    let csrfToken: string = csrfMetaTag?.content || "";

    let response: Response = await fetch("/salvar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      credentials: "same-origin",
      body: JSON.stringify(requestBody),
    });

    let blob: Blob = await response.blob();
    let blobURL: string = window.URL.createObjectURL(blob);
    downloadFile(blobURL, "diagrama.xhtml");

    return;
  }

  if (tipoArquivo === TipoArquivo.PDF || tipoArquivo === TipoArquivo.PRINTABLE_PDF) {
    let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
    let csrfToken: string = csrfMetaTag?.content || "";
    let pdfLoaderIndicator: HTMLElement | null = document.querySelector("#pdf-loader-indicator");

    try {
      pdfLoaderIndicator?.style.removeProperty("display");

      let response: Response = await fetch("/exportar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        credentials: "same-origin",
        body: JSON.stringify(requestBody),
      });

      let blob: Blob = await response.blob();
      let blobURL: string = window.URL.createObjectURL(blob);

      if (tipoArquivo === TipoArquivo.PRINTABLE_PDF) {
        let temporaryAnchor: HTMLAnchorElement = document.createElement("a");
        temporaryAnchor.href = blobURL;
        temporaryAnchor.target = "_blank";

        document.body.append(temporaryAnchor);
        temporaryAnchor.click();
        temporaryAnchor.remove();

        return;
      }
      downloadFile(blobURL, "diagrama.pdf");
    } finally {
      pdfLoaderIndicator?.style.setProperty("display", "none");
    }

    return;
  }

  let jsonData: string = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(requestBody, null, 2))}`;
  downloadFile(jsonData, "diagrama.json");
}

let buttonSalvarJSON: HTMLButtonElement | null = document.querySelector("#btn-salvar-json");
let buttonSalvarXML: HTMLButtonElement | null = document.querySelector("#btn-salvar-xml");
let buttonExportarPDF: HTMLButtonElement | null = document.querySelector("#btn-exportar-pdf");
let buttonImprimirPDF: HTMLButtonElement | null = document.querySelector("#btn-imprimir-pdf");

buttonSalvarJSON?.addEventListener("click", (event: MouseEvent): Promise<void> =>
  salvar(event, TipoArquivo.JSON),
);
buttonSalvarXML?.addEventListener("click", (event: MouseEvent): Promise<void> =>
  salvar(event, TipoArquivo.XML),
);
buttonExportarPDF?.addEventListener("click", (event: MouseEvent): Promise<void> =>
  salvar(event, TipoArquivo.PDF),
);

buttonImprimirPDF?.addEventListener("click", (event: MouseEvent): Promise<void> =>
  salvar(event, TipoArquivo.PRINTABLE_PDF),
);
