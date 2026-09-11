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

let email: HTMLInputElement | null = document.querySelector("input[name='email']");
let senha: HTMLInputElement | null = document.querySelector("input[name='senha']");
let continuar: HTMLInputElement | null = document.querySelector("#continuar");

function checkInputs(): void {
  if (continuar == null) {
    return;
  }

  continuar.disabled = senha?.value.trim().length == 0 && email?.value.trim().length == 0;
}

email?.addEventListener("input", checkInputs);
senha?.addEventListener("input", checkInputs);

checkInputs();
