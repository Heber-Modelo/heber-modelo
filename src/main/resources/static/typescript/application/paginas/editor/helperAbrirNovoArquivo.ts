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

function abrirNovoArquivo(): void {
  let temporaryFormElement: HTMLFormElement = document.createElement("form");

  let csrfMetaTag: HTMLMetaElement | null = document.head.querySelector("meta[name=_csrf]");
  let csrfToken: string = csrfMetaTag?.content || "";
  let csrfInput: HTMLInputElement = document.createElement("input");

  csrfInput.name = "_csrf";
  csrfInput.value = csrfToken;
  csrfInput.type = "hidden";

  temporaryFormElement.method = "post";
  temporaryFormElement.target = "_blank";
  temporaryFormElement.append(csrfInput);

  document.body.append(temporaryFormElement);
  temporaryFormElement.submit();
  temporaryFormElement.remove();
}

let btnAbrirNovoArquivo: HTMLButtonElement | null = document.querySelector("#btn-abrir-novo");
btnAbrirNovoArquivo?.addEventListener("click", abrirNovoArquivo);
