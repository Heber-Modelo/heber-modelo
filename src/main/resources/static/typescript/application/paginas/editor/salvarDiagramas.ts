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

import traduzirChaveI18n from "infrastructure/services/traduzirChaveI18n";
import NomesComponente from "domain/enum/nomesComponente";
import AbaJSON from "domain/json/abaJSON";
import ComponenteJSON from "domain/json/componenteJSON";
import ComponenteCardinalidadeMetaDadosJSON from "domain/json/componenteCardinalidadeMetaDadosJSON";
import ComponenteConexaoMetaDadosJSON from "domain/json/componenteConexaoMetaDadosJSON";
import DescricaoRelacionalJSON from "domain/json/descricaoRelacionalJSON";
import DicionarioDadosJSON from "domain/json/dicionarioDadosJSON";
import ComponenteDiagrama from "domain/model/componente/componenteDiagrama";
import DiagramasJSON from "domain/json/diagramasJSON";
import OpcoesSalvar from "domain/enum/opcoesSalvar";
import IRepositorioComponente from "domain/model/repositorio/iRepositorioComponente";

const PROPRIEDADE_NOME_DIAGRAMA_ABA: string = "data-nome-diagrama-aba";
const seletorTipoDiagrama: HTMLElement | null = document.querySelector("#tipos-diagrama");

let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
let csrfToken: string = csrfMetaTag?.content || "";

function coletarAbas(): AbaJSON[] {
  let elementosAbas: NodeListOf<HTMLDivElement> = document.querySelectorAll(".aba:not(#nova-aba)");
  let abas: AbaJSON[] = [];

  for (const aba of elementosAbas) {
    let elementoNomeAba: HTMLElement | null = aba.querySelector(".numero-aba");

    let id: number = Number(aba.getAttribute(ComponenteDiagrama.PROPRIEDADE_ID_ABA));
    let nome: string = elementoNomeAba?.innerText || String(id);
    let nomeDiagramaAba: string = aba.getAttribute(PROPRIEDADE_NOME_DIAGRAMA_ABA) || "";

    abas.push({ id, nome, nomeDiagramaAba });
  }

  return abas;
}

function coletarArquivosCSS(): string[] {
  let links: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll("link.css-carregado");
  let arquivosCSSCarregados: string[] = [];

  for (const link of links) {
    let partesLink: string[] = link.href.split("/");
    arquivosCSSCarregados.push(partesLink[partesLink.length - 1]);
  }

  return arquivosCSSCarregados;
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

export default async function salvarDiagramas(
  repositorioComponentes: IRepositorioComponente,
  opcaoSalvar: OpcoesSalvar,
): Promise<void> {
  let abas: AbaJSON[] = coletarAbas();
  let arquivosCSSCarregados: string[] = coletarArquivosCSS();
  let tiposDiagramas: string[] =
    seletorTipoDiagrama?.innerText
      .substring(1, seletorTipoDiagrama.innerText.length - 1)
      .split(",")
      .map((tipo: string): string => tipo.trim()) || [];

  let componentes: ComponenteDiagrama[] = repositorioComponentes.listar();

  let componentesJSON: ComponenteJSON[] = [];
  let descricoesRelacionaisJSON: DescricaoRelacionalJSON[] = [];
  let dicionariosDadosJSON: DicionarioDadosJSON[] = [];

  let metaDadosCardinalidades: ComponenteCardinalidadeMetaDadosJSON[] = [];
  let metaDadosConexoes: ComponenteConexaoMetaDadosJSON[] = [];

  componentes.forEach((componenteDiagrama: ComponenteDiagrama): void => {
    let nomeComponente: NomesComponente =
      NomesComponente[componenteDiagrama.nome.toUpperCase() as keyof typeof NomesComponente];

    switch (nomeComponente) {
      case NomesComponente.CARDINALIDADE:
        componentesJSON.push(componenteDiagrama.toJSON() as ComponenteJSON);
        metaDadosCardinalidades.push(
          componenteDiagrama.metaDadosToJSON() as ComponenteCardinalidadeMetaDadosJSON,
        );
        break;

      case NomesComponente.CONEXAO_ANGULADA:
      case NomesComponente.CONEXAO_ENTIDADE_FRACA:
      case NomesComponente.CONEXAO_SETA:
        componentesJSON.push(componenteDiagrama.toJSON() as ComponenteJSON);
        metaDadosConexoes.push(
          componenteDiagrama.metaDadosToJSON() as ComponenteConexaoMetaDadosJSON,
        );
        break;

      case NomesComponente.EDITOR_DESCRICAO_RELACIONAL:
        descricoesRelacionaisJSON.push(componenteDiagrama.toJSON() as DescricaoRelacionalJSON);
        break;

      case NomesComponente.TABELA_DICIONARIO_DADOS:
        dicionariosDadosJSON.push(componenteDiagrama.toJSON() as DicionarioDadosJSON);
        break;

      default:
        componentesJSON.push(componenteDiagrama.toJSON() as ComponenteJSON);
    }
  });

  let requestBody: DiagramasJSON = {
    creationDate: new Date(),
    loadedCSSFiles: arquivosCSSCarregados,
    types: tiposDiagramas,
    tabs: abas,
    components: componentesJSON,
    relationalDescriptions: descricoesRelacionaisJSON,
    dataDictionaries: dicionariosDadosJSON,
    metaDadosCardinalidades,
    metaDadosConexoes,
  };

  if (opcaoSalvar === OpcoesSalvar.JSON) {
    let jsonData: string = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(requestBody, null, 2))}`;
    downloadFile(jsonData, "diagrama.json");
    return;
  }

  let response: Response = await fetch("/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    credentials: "same-origin",
    body: JSON.stringify(requestBody),
  });

  if (opcaoSalvar === OpcoesSalvar.XML) {
    let blob: Blob = await response.blob();
    let blobURL: string = window.URL.createObjectURL(blob);
    downloadFile(blobURL, "diagrama.xhtml");

    return;
  }

  let xhtml: string = await response.text();
  let xhtmlWrapperElement: HTMLElement = document.createElement("div");
  document.body.append(xhtmlWrapperElement);
  xhtmlWrapperElement.innerHTML = xhtml.split("<body>")[1].split("</body>")[0];
  xhtmlWrapperElement.id = "xhtml-wrapper";
  let paginasXHTML: NodeListOf<HTMLElement> = xhtmlWrapperElement.querySelectorAll(
    "fieldset[data-indice-aba]",
  );
  let nomesAbas: string[] = paginasXHTML
    .values()
    .map((pagina: HTMLElement): string => pagina.querySelector("legend")?.innerText || "")
    .toArray();

  if (opcaoSalvar === OpcoesSalvar.SVG) {
    let { toSvg } = await import("html-to-image");

    let images: string[] = await Promise.all(
      paginasXHTML
        .values()
        .map(async (pagina: HTMLElement): Promise<string> =>
          toSvg(pagina, {
            quality: 1,
            canvasHeight: pngAlturaImagem,
            canvasWidth: pngLarguraImagem,
            height: pngAlturaImagem,
            width: pngLarguraImagem,
          }),
        )
        .toArray(),
    );

    for (let i: number = 0; i < images.length; i++) {
      downloadFile(images[i], `diagramas-${i + 1}-${nomesAbas[i]}.svg`);
    }

    xhtmlWrapperElement.remove();
    return;
  }

  let { default: jsPDF } = await import("jspdf");
  let { toPng } = await import("html-to-image");

  let alturaElementos: number;
  let larguraElementos: number;

  if (autoAjustarTamanhoPNG) {
    alturaElementos = xhtmlWrapperElement.clientHeight + xhtmlWrapperElement.offsetHeight;
    larguraElementos = xhtmlWrapperElement.clientWidth + xhtmlWrapperElement.offsetWidth;
  } else {
    alturaElementos = pngAlturaImagem;
    larguraElementos = pngLarguraImagem;
  }

  let images: string[] = await Promise.all(
    paginasXHTML
      .values()
      .map(async (pagina: HTMLElement): Promise<string> =>
        toPng(pagina, {
          quality: 1,
          canvasHeight: pngAlturaImagem,
          canvasWidth: pngLarguraImagem,
          height: alturaElementos,
          width: larguraElementos,
        }),
      )
      .toArray(),
  );
  xhtmlWrapperElement.remove();

  if (opcaoSalvar === OpcoesSalvar.BANCO) {
    let codigoAtividadeInput: HTMLInputElement | null = document.querySelector("#codigo-atividade");
    let codigoAtividade: string | undefined = codigoAtividadeInput?.value;

    if (codigoAtividade === undefined || codigoAtividade.length === 0) {
      window.alert(await traduzirChaveI18n("web.page.editor.selected-assignment.no-selection"));
      return;
    }

    let formData: FormData = new FormData();
    formData.append("codigoAtividade", codigoAtividade);
    images
      .map((image: string): string => image.substring(image.indexOf(",") + 1))
      .forEach((image: string): void => {
        formData.append("imagens", image);
      });

    await fetch("/enviarAtividade", {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": csrfToken,
      },
      credentials: "same-origin",
      body: formData,
    });

    return;
  }

  if (opcaoSalvar === OpcoesSalvar.PDF) {
    const pdfDocument = new jsPDF("landscape", "mm", [pdfLarguraFolha, pdfAlturaFolha]);

    for (let i: number = 0; i < images.length; i++) {
      pdfDocument.addImage(images[i], "PNG", 0, 0, pdfLarguraFolha, pdfAlturaFolha);

      if (i !== images.length - 1) {
        pdfDocument.addPage();
      }
    }

    pdfDocument.save("diagramas.pdf").autoPrint({ variant: "javascript" });
    pdfDocument.close();

    return;
  }

  for (let i: number = 0; i < images.length; i++) {
    downloadFile(images[i], `diagramas-${i + 1}-${nomesAbas[i]}.png`);
  }
}
