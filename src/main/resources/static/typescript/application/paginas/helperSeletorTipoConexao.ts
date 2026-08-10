/*
 * Copyright (c) 2026. Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
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

let checkboxDiagramaRelacional: HTMLInputElement | null =
  document.querySelector("input[value='DRL']");
let checkboxDicionarioDados: HTMLInputElement | null = document.querySelector("input[value='DDD']");

checkboxDicionarioDados?.addEventListener("input", (): void => {
  if (checkboxDiagramaRelacional && checkboxDicionarioDados?.checked) {
    checkboxDiagramaRelacional.checked = true;
  }
});

checkboxDiagramaRelacional?.addEventListener("input", (): void => {
  if (!checkboxDiagramaRelacional?.checked && checkboxDicionarioDados) {
    checkboxDicionarioDados.checked = false;
  }
});
