const callbackMarcador = (event: Event): void => {
  let classeChavePrimaria: string = "primary-key";
  let elementoAlvo: HTMLElement = event.target as HTMLElement;

  if (elementoAlvo.classList.contains(classeChavePrimaria)) {
    elementoAlvo.classList.remove(classeChavePrimaria);
  } else {
    elementoAlvo.classList.add(classeChavePrimaria);
  }
};

const callbackInverterAtributo = (event: MouseEvent): void => {
  if (event.button == 1) {
    let elementoAlvo: HTMLElement = (event.target as HTMLElement).parentElement as HTMLElement;
    elementoAlvo.append(...Array.from(elementoAlvo.childNodes).reverse());
  }
};

/*********************************/
/* Diagrama do Modelo Relacional */
/*********************************/

class ModeloChaveRelacional {
  private static _svgChave: string =
    "<svg width='10px' height='20px' viewBox='0 0 90 221' xmlns='http://www.w3.org/2000/svg'>" +
    "<rect x='30' y='71' width='30' height='125' fill='currentColor'/>" +
    "<path d='M45 221L60.2169 195.779L54.4046 154.971H35.5954L29.7831 195.779L45 221Z' fill='currentColor'/>" +
    "<rect x='30' y='194' width='30' height='1' fill='currentColor'/>" +
    "<path d='M41 175.5L60.05 164.675V186.325L41 175.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<path d='M41 151.5L60.05 140.675V162.325L41 151.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<path d='M41 127.5L60.05 116.675V138.325L41 127.5Z' fill='currentColor' class='svg-cor-fill'/>" +
    "<circle cx='45' cy='45' r='45' fill='currentColor'/>" +
    "<circle cx='45' cy='45' r='25' fill='currentColor' class='svg-cor-fill'/></svg>";

  private readonly _classeChave: string;
  private readonly _descricaoChave: string;

  constructor(classeChave: string, descricaoChave: string) {
    this._classeChave = classeChave;
    this._descricaoChave = descricaoChave;
  }

  static get svgChave(): string {
    return this._svgChave;
  }

  get classeChave(): string {
    return this._classeChave;
  }

  get descricaoChave(): string {
    return this._descricaoChave;
  }
}

const callbackAlterarAtributoRelacional = (event: MouseEvent): void => {
  if (event.button == 1 && (event.target as HTMLElement).tagName.toLowerCase() === "div") {
    (event.target as HTMLElement).remove();
    return;
  }

  let elementoChave: HTMLElement | null = (event.target as HTMLElement).querySelector(".chave");
  let elementoSvg: SVGSVGElement | HTMLElement | null | undefined =
    elementoChave?.querySelector("svg");
  if (elementoSvg === null || elementoSvg === undefined) {
    elementoSvg = document.createElement("div");
    elementoSvg.innerHTML = ModeloChaveRelacional.svgChave;
    elementoChave?.prepend(elementoSvg);
    elementoSvg = elementoChave?.querySelector("svg");
  }

  let descChave: HTMLSpanElement | null | undefined = elementoChave?.querySelector("span");
  if (
    descChave === null ||
    descChave === undefined ||
    elementoSvg === null ||
    elementoSvg === undefined
  ) {
    return;
  }

  let chavesRelacionais: ModeloChaveRelacional[] = [
    new ModeloChaveRelacional("chave-escondida", ""),
    new ModeloChaveRelacional("chave-primaria", "PK"),
    new ModeloChaveRelacional("chave-estrangeira", "FK"),
    new ModeloChaveRelacional("chave-mista", "PF"),
    new ModeloChaveRelacional("chave-unica", "UQ"),
  ];

  let nomeAtributoIndex: string = "index-fundo";
  let indexAtual: number = Number(
    elementoChave?.hasAttribute(nomeAtributoIndex)
      ? elementoChave?.getAttribute(nomeAtributoIndex)
      : "0",
  );

  if (indexAtual === chavesRelacionais.length - 1) {
    indexAtual = -1;
  }

  indexAtual++;

  elementoSvg.classList.value = chavesRelacionais[indexAtual].classeChave;
  descChave.innerText = chavesRelacionais[indexAtual].descricaoChave;
  elementoChave?.setAttribute(nomeAtributoIndex, String(indexAtual));
};

const callbackCriarAtributoRelacional = (event: MouseEvent): void => {
  let novoAtributo: HTMLDivElement = document.createElement("div");
  (event.target as HTMLElement).parentElement?.append(novoAtributo);
  // noinspection JSCheckFunctionSignatures,JSDeprecatedSymbols
  novoAtributo.outerHTML =
    '<div class="atributo" onmouseup="callbackAlterarAtributoRelacional(event)"><span class="chave"><span class="desc-chave"></span></span><span contenteditable="true" spellcheck="true" class="texto">atributo: tipo</span></div>';
};

/***********************/
/* DICIONÁRIO DE DADOS */
/***********************/

const NUMERO_COLUNAS: number = 9;

function criarLinha(event: Event): void {
  let table: HTMLTableElement | null | undefined = (
    event.target as HTMLElement | null
  )?.parentElement?.parentElement?.querySelector("table");
  let tbody: HTMLTableSectionElement | undefined = table?.tBodies[0];
  let newRow: HTMLTableRowElement | undefined = tbody?.insertRow();

  let th: HTMLTableCellElement = document.createElement("th");
  th.setAttribute("scope", "row");
  let p: HTMLParagraphElement = document.createElement("p");
  p.setAttribute("contenteditable", "true");
  p.setAttribute("spellcheck", "true");

  th.append(p);
  newRow?.append(th);

  for (let i: number = 1; i < NUMERO_COLUNAS; i++) {
    let td: HTMLTableCellElement = document.createElement("td");
    p = document.createElement("p");
    p.setAttribute("contenteditable", "true");
    p.setAttribute("spellcheck", "true");
    td.append(p);
    newRow?.append(td);
  }
}

function excluirLinha(event: Event): void {
  let table: HTMLTableElement | null | undefined = (
    event.target as HTMLElement | null
  )?.parentElement?.parentElement?.querySelector("table");
  let tbody: HTMLTableSectionElement | undefined = table?.tBodies[0];
  tbody?.deleteRow(-1);
}
