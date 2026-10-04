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

inputsRadioAssignments.forEach((inputRadioAssignment: HTMLInputElement): void => {
  inputRadioAssignment.addEventListener("input", (event: InputEvent): void => {
    atividadeSelecionadaWrapper?.style.removeProperty("display");
    let inputTarget: HTMLInputElement = event.target as HTMLInputElement;
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
