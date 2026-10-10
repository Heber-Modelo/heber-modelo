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

const girarEspecializacaoDireita = (event: MouseEvent): void => {
  let especializacao: HTMLElement = (event.target as HTMLElement).parentElement as HTMLElement;
  let rotacaoAtual: string = especializacao.style.getPropertyValue("rotate");

  if (rotacaoAtual === "") {
    especializacao.style.setProperty("rotate", "-90deg");
    return;
  }

  let valorNumericoRotacao: number = Number(rotacaoAtual.substring(0, rotacaoAtual.length - 3));
  valorNumericoRotacao -= 90;
  especializacao.style.setProperty("rotate", `${valorNumericoRotacao}deg`);
};

const girarEspecializacaoEsquerda = (event: MouseEvent): void => {
  let especializacao: HTMLElement = (event.target as HTMLElement).parentElement as HTMLElement;
  let rotacaoAtual: string = especializacao.style.getPropertyValue("rotate");

  if (rotacaoAtual === "") {
    especializacao.style.setProperty("rotate", "90deg");
    return;
  }

  let valorNumericoRotacao: number = Number(rotacaoAtual.substring(0, rotacaoAtual.length - 3));
  valorNumericoRotacao += 90;
  especializacao.style.setProperty("rotate", `${valorNumericoRotacao}deg`);
};

/*********************************/
/* Diagrama do Modelo Relacional */
/*********************************/

const callbackCriarAtributoRelacional = (event: MouseEvent): void => {
  let novoAtributo: HTMLDivElement = document.createElement("div");
  (event.target as HTMLElement).parentElement?.append(novoAtributo);
  // noinspection JSCheckFunctionSignatures,JSDeprecatedSymbols
  novoAtributo.outerHTML =
    '<div class="atributo"><span class="chave"><span class="desc-chave"></span></span><span contenteditable="true" spellcheck="true" class="texto">atributo: tipo</span></div>';

  let elementoEntidade: HTMLElement | null = (event.target as HTMLElement).parentElement;
  let alturaEntidade: number | undefined = elementoEntidade?.getBoundingClientRect().height;

  if (alturaEntidade) {
    elementoEntidade?.style.setProperty("height", `calc(${alturaEntidade}px + 2rem)`);
  }
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
