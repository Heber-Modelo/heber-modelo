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

let assignmentsContainer: HTMLElement | null = document.querySelector("#atividades");
let assignmentsDetailsTag: HTMLDetailsElement | null = document.querySelector("#assignments");
let btnFecharAssignments: HTMLButtonElement | null = document.querySelector("#close-button");
let btnLimparSelecaoAssignments: HTMLButtonElement | null =
  document.querySelector("#clean-selection-button");
let inputsRadioAssignments: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  "input[name=selected-assignment]",
);

assignmentsDetailsTag?.addEventListener("click", (event: MouseEvent): void => {
  event.preventDefault();
  assignmentsContainer?.style.setProperty("display", "grid");
});

btnFecharAssignments?.addEventListener("click", (): void => {
  assignmentsContainer?.style.removeProperty("display");
});

if (assignmentsDetailsTag) {
  let assignmentsDescriptions: NodeListOf<HTMLParagraphElement> =
    document.querySelectorAll(".assignment-description");
  assignmentsDescriptions.forEach((assignmentDescription: HTMLParagraphElement): void => {
    assignmentDescription.innerHTML = assignmentDescription.innerHTML
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
  });
}

/************************/
/* SELECIONAR ATIVIDADE */
/************************/

let atividadeSelecionadaWrapper: HTMLElement | null =
  document.querySelector("#atividade-selecionada");
let tituloWrapper: HTMLElement | undefined | null =
  atividadeSelecionadaWrapper?.querySelector("#titulo-atividade");
let codigoWrapper: HTMLInputElement | undefined | null =
  atividadeSelecionadaWrapper?.querySelector("#codigo-atividade");
let dataEntregaWrapper: HTMLInputElement | undefined | null =
  atividadeSelecionadaWrapper?.querySelector("#data-entrega-atividade");
let descricaoWrapper: HTMLElement | undefined | null =
  atividadeSelecionadaWrapper?.querySelector("#descricao-atividade");

atividadeSelecionadaWrapper?.style.setProperty("display", "none");

function selecionarAtividade(inputTarget: HTMLInputElement): void {
  let detailsTag: HTMLDetailsElement = inputTarget.parentElement?.parentElement
    ?.parentElement as HTMLDetailsElement;

  let titleElement: HTMLSpanElement | null = detailsTag.querySelector(".title");
  let deadlineElement: HTMLInputElement | null = detailsTag.querySelector(".deadline input");
  let descriptionElement: HTMLParagraphElement | null =
    detailsTag.querySelector(".assignment-description");

  if (tituloWrapper && titleElement) {
    tituloWrapper.innerText = titleElement.innerText;
  }

  if (codigoWrapper) {
    codigoWrapper.value = inputTarget.value;
  }

  if (dataEntregaWrapper && deadlineElement) {
    dataEntregaWrapper.value = deadlineElement.value;
  }

  if (descricaoWrapper && descriptionElement) {
    descricaoWrapper.innerHTML = descriptionElement.innerHTML;
  }
}

inputsRadioAssignments.forEach((inputRadioAssignment: HTMLInputElement): void => {
  inputRadioAssignment.addEventListener("input", (event: InputEvent): void => {
    atividadeSelecionadaWrapper?.style.removeProperty("display");
    let inputTarget: HTMLInputElement = event.target as HTMLInputElement;
    selecionarAtividade(inputTarget);
  });
});

btnLimparSelecaoAssignments?.addEventListener("click", (): void => {
  inputsRadioAssignments.forEach((inputRadio: HTMLInputElement): void => {
    inputRadio.checked = false;
  });

  if (tituloWrapper) {
    tituloWrapper.innerText = "";
  }

  if (codigoWrapper) {
    codigoWrapper.value = "";
  }

  if (dataEntregaWrapper) {
    dataEntregaWrapper.value = "";
  }

  if (descricaoWrapper) {
    descricaoWrapper.innerHTML = "";
  }

  atividadeSelecionadaWrapper?.style.setProperty("display", "none");
});

/*****************/
/* INICIAR PROVA */
/*****************/

let buttonsIniciarProva: NodeListOf<HTMLButtonElement> = document.querySelectorAll("div#tests-list button");

buttonsIniciarProva.forEach((buttonIniciarProva: HTMLButtonElement): void => {
  buttonIniciarProva.addEventListener("click", async (event: MouseEvent): Promise<void> => {
    if (!window.confirm(await traduzirChaveI18n("web.page.editor.start-test"))) {
      return;
    }

    atividadeSelecionadaWrapper?.style.removeProperty("display");
    let inputTarget: HTMLInputElement = event.target as HTMLInputElement;
    selecionarAtividade(inputTarget);

    let buttonAbrirArquivo: HTMLSpanElement | null = document.querySelector("#abrir");
    let buttonNovoArquivo: HTMLSpanElement | null = document.querySelector("#novo");
    let buttonHome: HTMLButtonElement | null = document.querySelector("header > button");
    let detailsAssignments: HTMLDetailsElement | null = document.querySelector("details#assignments");
    let sectionAtividade: HTMLElement | null = document.querySelector("#atividades");

    buttonAbrirArquivo?.remove();
    buttonNovoArquivo?.remove();
    buttonHome?.remove();
    detailsAssignments?.remove();
    sectionAtividade?.remove();

    window.alert(await traduzirChaveI18n("web.page.editor.started-test"));
  })
});
