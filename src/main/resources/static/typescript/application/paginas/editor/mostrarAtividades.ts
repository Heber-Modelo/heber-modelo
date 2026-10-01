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

function fecharAssignmentsContainer(event: MouseEvent): void {
  let targetElement: HTMLElement = event.target as HTMLElement;

  if (targetElement.tagName !== "SECTION" && !assignmentsContainer?.contains(targetElement)) {
    assignmentsContainer?.style.removeProperty("display");
    document.body.removeEventListener("click", fecharAssignmentsContainer);
  }
}

assignmentsDetailsTag?.addEventListener("click", (event: MouseEvent): void => {
  event.preventDefault();
  assignmentsContainer?.style.setProperty("display", "grid");
  setTimeout((): void => {
    document.body.addEventListener("click", fecharAssignmentsContainer);
  }, 200);
});

btnFecharAssignments?.addEventListener("click", (): void => {
  assignmentsContainer?.style.removeProperty("display");
});

btnLimparSelecaoAssignments?.addEventListener("click", (): void => {
  let inputsRadioAssignments: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    "input[name=selected-assignment]",
  );
  inputsRadioAssignments.forEach((inputRadio: HTMLInputElement): void => {
    inputRadio.checked = false;
  });
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
