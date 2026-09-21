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

const inputSenha: HTMLInputElement | null = document.querySelector("input[name='senha']");
const inputConfirmarSenha: HTMLInputElement | null = document.querySelector(
  "input[name='confirmarSenha']",
);
const btnCancelar: HTMLButtonElement | null = document.querySelector("button#btn-cancelar");
const btnEnviar: HTMLButtonElement | null = document.querySelector("form button#btn-enviar");
const btnEnviarVerdadeiro: HTMLButtonElement | null = document.querySelector(
  "form button#btn-enviar-verdadeiro",
);

btnCancelar?.addEventListener("click", (): void => {
  window.location.href = "/login";
});

btnEnviar?.addEventListener("click", (): void => {
  if (inputSenha == null || inputConfirmarSenha == null) return;

  if (inputSenha.value === inputConfirmarSenha.value) {
    btnEnviarVerdadeiro?.click();
  }
});
