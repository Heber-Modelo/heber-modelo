/*
 * Copyright (c) 2025. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

import ComponenteDiagrama from "model/componente/componenteDiagrama.js";
import PropriedadeComponente from "model/propriedade/propriedadeComponente.js";
import RepositorioComponente from "infrastructure/repositorio/repositorioComponente.js";
import { repositorioComponenteFactory } from "infrastructure/factory/repositorioComponenteFactory.js";
import { SelecionadorComponente } from "application/paginas/editor/selecionadorComponente.js";
import { selecionadorComponenteFactory } from "infrastructure/factory/selecionadorComponenteFactory.js";

class InputPropriedade {
  private readonly _elementoInput: HTMLInputElement | null;
  private readonly nomePropriedade: string;

  constructor(elementoInput: HTMLInputElement | null, propriedade: string) {
    this._elementoInput = elementoInput;
    this.nomePropriedade = propriedade;
  }

  public atualizar(elementoSelecionado: HTMLElement | null): void {
    atualizarValorInput(elementoSelecionado, this._elementoInput, this.nomePropriedade);
  }

  get elementoInput(): HTMLInputElement | null {
    return this._elementoInput;
  }
}

// NOTE: Não funciona com parênteses.
function calcularExpressao(expressao: string): number | null {
  let regexFiltroExpressao: RegExp = /(?<!\S)[0-9]+(?:[-+%~^*\/]+?\d+(?:\.\d+)?)+(?!\S)/g;

  if (expressao.match(regexFiltroExpressao) === null) {
    return null;
  }

  return eval(expressao);
}

function ajustarValorAtributo(valor: string): string {
  let regexVerificarNumero: RegExp = /^-?\d+$/g;
  if (regexVerificarNumero.test(valor)) {
    return `${parseFloat(valor)}px`;
  }

  let resultadoExpressao: number | null = calcularExpressao(valor);

  if (resultadoExpressao === null) {
    return "0px";
  }

  return `${resultadoExpressao}px`;
}

function modificarPropriedadeElemento(
  elemento: HTMLElement | null,
  inputAtributo: HTMLInputElement | null,
  nomePropriedade: string,
): void {
  if (elemento === null || inputAtributo === null) return;

  let novoValorAtributo: string = ajustarValorAtributo(inputAtributo.value);
  elemento.style.setProperty(nomePropriedade, novoValorAtributo);
}

export function atualizarValorInput(
  elemento: HTMLElement | null,
  inputAtributo: HTMLInputElement | null,
  nomePropriedade: string,
): void {
  if (elemento === null || elemento === undefined || inputAtributo === null) return;

  let valorPropriedade: string = getComputedStyle(elemento).getPropertyValue(nomePropriedade);
  inputAtributo.value = valorPropriedade.substring(0, valorPropriedade.length - 2);
}

export function atualizarInputs(
  elementoSelecionado: HTMLElement | null,
  inputs: InputPropriedade[],
): void {
  if (elementoSelecionado !== null) {
    inputs.forEach((input: InputPropriedade): void => input.atualizar(elementoSelecionado));
    return;
  }

  inputs.forEach((input: InputPropriedade): void => {
    if (input.elementoInput !== null) {
      input.elementoInput.value = "";
    }
  });
}

export function limparPropriedades(abaPropriedades: HTMLElement | null): void {
  if (abaPropriedades === null) return;

  let propriedades: NodeListOf<HTMLElement> = abaPropriedades.querySelectorAll(
    `.${PropriedadeComponente.CLASSE_PROPRIEDADE_CUSTOMIZADA}`,
  );
  propriedades.forEach((propriedade: HTMLElement): void => propriedade.remove());
}

export let inputs: InputPropriedade[] = [];

export function mouseDownSelecionarElemento(event: Event): void {
  let selecionador: SelecionadorComponente = selecionadorComponenteFactory.build();
  let repositorio: RepositorioComponente = repositorioComponenteFactory.build();
  let abaPropriedades: HTMLElement | null = document.querySelector("section#propriedades");
  let componente: ComponenteDiagrama | null = repositorio.pegarPorHTML(event.target as HTMLElement);

  if (componente === null) {
    return;
  }

  selecionador.selecionarElemento(componente);
  limparPropriedades(abaPropriedades);
  componente.propriedades.forEach((propriedade: PropriedadeComponente): void => {
    let editorPropriedade: HTMLLabelElement = propriedade.criarElementoInputPropriedade();
    abaPropriedades?.appendChild(editorPropriedade);
  });

  atualizarInputs(selecionador.componenteSelecionado?.htmlComponente ?? null, inputs);
}

export const editorEixoX: HTMLInputElement | null = document.querySelector(
  "#propriedades input[name='componente-x']",
);

export const editorEixoY: HTMLInputElement | null = document.querySelector(
  "#propriedades input[name='componente-y']",
);

let editorAltura: HTMLInputElement | null = document.querySelector(
  "#propriedades input[name='componente-altura']",
);

let editorLargura: HTMLInputElement | null = document.querySelector(
  "#propriedades input[name='componente-largura']",
);

let editorTamanhoFonte: HTMLInputElement | null = document.querySelector(
  "#propriedades input[name='componente-tamanho-fonte']",
);

let selecionadorComponente: SelecionadorComponente = selecionadorComponenteFactory.build();

inputs.push(new InputPropriedade(editorEixoX, "left"));
inputs.push(new InputPropriedade(editorEixoY, "top"));
inputs.push(new InputPropriedade(editorAltura, "height"));
inputs.push(new InputPropriedade(editorLargura, "width"));
inputs.push(new InputPropriedade(editorTamanhoFonte, "font-size"));

editorEixoX?.addEventListener("input", (): void => {
  modificarPropriedadeElemento(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorEixoX,
    "left",
  );
  selecionadorComponente.moverSetasParaComponenteSelecionado();
  selecionadorComponente.componenteSelecionado?.atualizarOuvintes();
});

editorEixoY?.addEventListener("input", (): void => {
  modificarPropriedadeElemento(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorEixoY,
    "top",
  );
  selecionadorComponente.moverSetasParaComponenteSelecionado();
  selecionadorComponente.componenteSelecionado?.atualizarOuvintes();
});

editorAltura?.addEventListener("input", (): void => {
  modificarPropriedadeElemento(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorAltura,
    "height",
  );
});

editorLargura?.addEventListener("input", (): void => {
  modificarPropriedadeElemento(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorLargura,
    "width",
  );
});

editorTamanhoFonte?.addEventListener("input", (): void => {
  modificarPropriedadeElemento(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorTamanhoFonte,
    "font-size",
  );
});

editorEixoX?.addEventListener("focusout", (): void => {
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoX, "left");
});

editorEixoY?.addEventListener("focusout", (): void => {
  atualizarValorInput(selecionadorComponente.pegarHTMLElementoSelecionado(), editorEixoY, "top");
});

editorAltura?.addEventListener("focusout", (): void => {
  atualizarValorInput(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorAltura,
    "height",
  );
});

editorLargura?.addEventListener("focusout", (): void => {
  atualizarValorInput(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorLargura,
    "width",
  );
});

editorTamanhoFonte?.addEventListener("focusout", (): void => {
  atualizarValorInput(
    selecionadorComponente.pegarHTMLElementoSelecionado(),
    editorTamanhoFonte,
    "font-size",
  );
});
