/*
 * Copyright (c) 2025. Heber Ferreira Barra, João Gabriel de Cristo, Matheus Jun Alves Matuda.
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

let inputEmailLogin: HTMLInputElement | null = document.querySelector("input[name='email']");
let inputSenhaLogin: HTMLInputElement | null = document.querySelector("input[name='senha']");
let btnContinuar: HTMLButtonElement | null = document.querySelector("#continuar");

function checkInputs(): void {
  if (btnContinuar == null) {
    return;
  }

  btnContinuar.disabled =
    inputSenhaLogin?.value.trim().length == 0 && inputEmailLogin?.value.trim().length == 0;
}

inputEmailLogin?.addEventListener("input", checkInputs);
inputSenhaLogin?.addEventListener("input", checkInputs);

checkInputs();
