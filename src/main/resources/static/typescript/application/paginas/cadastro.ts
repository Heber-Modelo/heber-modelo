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

let inputSenha: HTMLInputElement | null = document.querySelector("input[name='senha']");
let inputConfirmarSenha: HTMLInputElement | null = document.querySelector(
  "input[name='confirmarSenha']",
);
let btnEnviar: HTMLButtonElement | null = document.querySelector("form button#btn-enviar");
let btnEnviarVerdadeiro: HTMLButtonElement | null = document.querySelector(
  "form button#btn-enviar-verdadeiro",
);

btnEnviar?.addEventListener("click", (): void => {
  if (inputSenha == null || inputConfirmarSenha == null) return;

  if (inputSenha.value === inputConfirmarSenha.value) {
    btnEnviarVerdadeiro?.click();
  }
});
